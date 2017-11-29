//输入命令更新组件
const config = require('./config');
const file = require('./file');
const fs = require('fs');
const http = require('http');
const request = require('request');
const consoler = require('consoler');
const versionFile = "version.txt";
const versionFilePath = "./src/" + versionFile;
var resourcesUrl = config.resourcesUrl;
//获取版本
const getVersion = function () {
    if (fs.existsSync(versionFilePath)) {
        var data = fs.readFileSync(versionFilePath, "utf-8");
        return data;
    }
    return false;
};
//拷贝列表中的文件
const copyList = function (list, version) {
    var copyNum = 0;
    list
        .forEach(function (ret, index) {
            var dir = "src" + ret.dir;
            file.mkdirs(dir, null, function () {
                var filename = dir + "/" + ret.filename;
                var stream = fs.createWriteStream(filename);
                request(ret.data)
                    .pipe(stream)
                    .on('close', function () {
                        copyNum++;
                        consoler.info(filename + "拷贝成功!");
                        if (copyNum == list.length) {
                            fs.writeFileSync(versionFilePath, version);
                            consoler.success('更新成功！!');
                        }
                    });
            });
        });
};
//从服务器端拉取更新列表
const getList = function () {
    console.log(resourcesUrl);
    http.get(resourcesUrl, function (req, res) {
        var res = '';
        req.on('data', function (data) {
            res += data;
        });
        req.on('end', function () {
            res = eval("[" + res + "]");
            //console.log(res);
            if (res[0].code) {
                consoler.error(res[0].message);
            } else {
                var list = res[0].data.list;
                var version = res[0].data.version;
                consoler.loading('正在现在更新，请稍后...');
                copyList(list, version);
            }
        });
    });
};
const update = function () {
    var version = getVersion();
    if (version !== false) {
        resourcesUrl += "?version=" + version;
    }
    getList();
};
try {
    update();
} catch (err) {}