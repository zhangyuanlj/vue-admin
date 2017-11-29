/**
 * 取地址栏参数,如果不存在返回空字符串
 *
 * @param string paramName 参数名称
 * @param string url 地址字符串,如果不传入则为浏览器地址从问号 (?) 开始的 URL
 *
 */
let getParam = function(paramName, url) {
    var _url = url ? url : window.location.search;
    var svalue = _url.match(new RegExp("[\?\&]" + paramName + "=([^\&]*)(\&?)", "i"));
    return svalue ? svalue[1] : "";
};

export default Url = {
    getParam: getParam
}