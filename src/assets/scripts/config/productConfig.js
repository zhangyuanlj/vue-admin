//项目配置文件，线上环境
const authManagelHost = "http://auth.manage.jumaps.com:8003";
const config = {
    //工作台地址
    homeUrl: "/main.html#/home/",
    //用户中心登录頁地址
    loginUrl: authManagelHost + "/main.html#/login/",
    //用户中心地址配置
    authApiHost: "http://10.101.0.23:8002",
    authManagelHost: authManagelHost,
    //数据请求地址
    requestUrl: "http://vehicle.jumaps.com:8000"
};
export default config;