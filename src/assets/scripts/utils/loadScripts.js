//已加载脚本队列
window.loadedScripts = {};
const QUEUE_NUM = 30;
/**
 * 动态加载脚本
 * 
 * @param {array} scriptsList 脚本URL列表
 * @param {function} callback 成功回调
 * @param {string} version 附加的版本号
 */
let loadScripts = function (scriptsList, callback, version) {
    let scriptsLen = scriptsList.length;
    let loadIndex = 0;
    let createScript = function (url, loadedCallback) {
        try {
            if (loadedScripts[url]) {
                loadedCallback();
                return false;
            }
            let scriptEl = document.createElement("script");
            scriptEl.type = "text/javascript";
            scriptEl.setAttribute("name", url);
            if (scriptEl.readyState) {
                scriptEl.onreadystatechange = function () {
                    if (scriptEl.readyState == "loaded" ||
                        scriptEl.readyState == "complete") {
                        scriptEl.onreadystatechange = null;
                        loadedCallback();
                    }
                };
            } else {
                scriptEl.onload = function () {
                    loadedCallback();
                };
            }
            loadedScripts[url] = url;
            //版本号存在,并且加载的不是第三方脚本,则加版本号
            if (url.indexOf("http") == -1 && version) {
                url += "?v=" + version;
            }
            scriptEl.src = url;
            document.body.appendChild(scriptEl);
        } catch (err) {
            console.error(url + "加载失败,请刷新重试!\n" + err);
        }
    };
    let startCreate = function (index) {
        let loadUrl = scriptsList[index];
        index++;
        createScript(loadUrl, function () {
            if (index == scriptsLen) {
                callback && callback.call(self);
            } else {
                startCreate(index);
            }
        });
    };
    if (scriptsLen <= QUEUE_NUM) {
        startCreate(loadIndex);
    } else {
        console.warn("超过加载队列最大值:" + QUEUE_NUM);
    }
};
export default loadScripts;