const config = {
    staticDomain: "",
    buildPath: "dist",
    assetsPath: "assets",
    imgPath: "images",
    stylesPath: "styles",
    scriptsPath: "scripts",
    projectTitle: "后台管理系统",
    //组件服务器地址
    resourcesUrl: "http://10.101.0.130:8080/getList.php",
    //环境变量develop：开发，test：测试，product：线上
    environment: "develop"
};
module.exports = config;
