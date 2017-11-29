import Vue from 'vue';
import $ from 'jQuery';
import axios from 'axios';
import Helper from 'utils/helper.js';
import Storage from 'utils/storage.js';
import config from 'config';
import 'utils/json2.js';
const NOT_LOGIN = ["notLogin", "sessionFail"]; //没有登录
const MAX_CACHE_NUM = 10;
const CACHE_KEY_NAME = "ajaxCacheData";
const LOGIN_INVALID = "登录过期,请重新登录";
const NETWORK_ANOMALY = "网络异常,请退出应用重试";
const CACHE_ERROR_TEXT = `本地只能保存${MAX_CACHE_NUM}个缓存数据`;
const VueInstance = Vue.prototype;
/**
 * 统一的请求类,包含登录验证拦截器
 *
 * @class Request
 */
class HttpRequest {
    /**
     * 获得错误信息
     * 
     * @static
     * @param {object} res 后台返回的数据
     * @param {object} errorMsgConfig 自定义错误信息配置
     * @returns 
     * @memberof HttpRequest
     */
    static getErrorMsg(res, errorMsgConfig) {
        let errorMsg = res.message;
        if (errorMsgConfig[res.businessErrorKey]) {
            errorMsg = errorMsgConfig[res.businessErrorKey];
        }
        return errorMsg;
    }
    /**
     * 异常处理
     * 
     * @static
     * @param {object||string} res 后台返回的数据
     * @param {function} succeed 成功时的回调函数
     * @param {function} failure 失败时的回调函数
     * @param {string} errorHandMode 错误处理模式，只显示错误消息:showErrorMsg、只执行错误方法:execErrorFunc、显示错误消息并执行错误方法:all
     * 
     * @memberof HttpRequest
     */
    static abnormal(res, succeed, failure, errorHandMode) {
        let isLogin = true;
        //code为非0时,表示该次请求出现异常
        let code = parseInt(res.code);
        //当res类型为字符串时,数据为后端渲染好的模板
        if ($.type(res) == "string" || !code) {
            if ($.isFunction(succeed)) {
                succeed(res);
            }
        } else {
            //没有登录,跳转到登录页
            if ($.inArray(res.businessErrorKey, NOT_LOGIN) != -1) {
                let href = location.href;
                let loginUrl = config.loginUrl + "?returnUrl=" + href;
                VueInstance
                    .$Message
                    .error({
                        content: LOGIN_INVALID,
                        onClose: function () {
                            Helper.redirect(loginUrl);
                        }
                    });
                isLogin = false;
            } else {
                let errorMsg = HttpRequest.getErrorMsg(res, config.errorMsg);
                if (errorHandMode == "all") {
                    VueInstance.$Message.error({
                        content: errorMsg,
                        onClose: function () {
                            if ($.isFunction(failure)) {
                                failure(res);
                            }
                        }
                    });
                } else
                if (errorHandMode == "showErrorMsg") {
                    VueInstance.$Message.error({
                        content: errorMsg
                    });
                } else if (errorHandMode == "execErrorFunc") {
                    if ($.isFunction(failure)) {
                        failure(res);
                    }
                }
            }
        }
        return isLogin;
    }
    //获取缓存到本地的所有请求数据
    static getAllCacheData() {
        let ajaxCacheData = Storage.get(CACHE_KEY_NAME);
        if (ajaxCacheData !== null) {
            return JSON.parse(ajaxCacheData);
        }
        return null;
    }
    /**
     * 获取缓存到本地的请求数据
     * 
     * @static
     * @param {string} key 数据键名，通常是请求地址
     * @returns 
     * @memberof HttpRequest
     */
    static getCacheData(key) {
        let ajaxCacheData = HttpRequest.getAllCacheData();
        if (ajaxCacheData !== null) {
            return ajaxCacheData[key];
        }
        return null;
    }
    static getCacheDataLen() {
        let len = 0;
        let ajaxCacheData = HttpRequest.getAllCacheData();
        for (let key in ajaxCacheData) {
            len++;
        }
        return len;
    }
    /**
     * 获取过期时间
     * 
     * @static
     * @param {string} expires 获取过期时间
     * @returns 
     * @memberof HttpRequest
     */
    static getExpires(expires) {
        let str = expires.substr(0, 1);
        let time = parseInt(expires.substr(1, expires.length));
        if (str === "d") {
            return time * 24 * 3600 * 1000;
        } else if (str === "h") {
            return time * 3600 * 1000;
        } else if (str === "s") {
            return time * 1000;
        }
    }
    /**
     * 判断缓存数据是否过期
     * 
     * @static
     * @param {integer} expireTime 过期时间
     * @param {string} url 请求地址
     * @returns 
     * @memberof HttpRequest
     */
    static isExpires(expireTime, url) {
        let ajaxCacheData = HttpRequest.getAllCacheData();
        let date = new Date();
        let currentTime = date.getTime();
        if (currentTime >= expireTime) {
            if (ajaxCacheData !== null) {
                delete ajaxCacheData[url];
                Storage.set([{
                    name: CACHE_KEY_NAME,
                    value: ajaxCacheData
                }]);
            }
            return true;
        }
        return false;
    }
    /**
     * 读取缓存数据
     * 
     * @static
     * @param {integer} expireTime 过期时间
     * @param {string} url 请求地址
     * @returns 
     * @memberof HttpRequest
     */
    static readCacheData(expires, url) {
        let expiresTime = HttpRequest.getExpires(expires);
        let isExpires = HttpRequest.isExpires(expiresTime);
        let cacheData = null;
        if (!isExpires) {
            cacheData = HttpRequest.getCacheData(url);
        }
        return cacheData;
    }
    /**
     * 将请求数据缓存到本地
     * 
     * @static
     * @param {string} url 请求地址
     * @param {string} value 缓存到本地的数据
     * @memberof HttpRequest
     */
    static writeCacheData(url, value) {
        let len = HttpRequest.getCacheDataLen();
        if (len + 1 > MAX_CACHE_NUM) {
            console.error(CACHE_ERROR_TEXT);
            return false;
        }
        let ajaxCacheData = HttpRequest.getAllCacheData();
        if (ajaxCacheData === null) {
            ajaxCacheData = {};
        }
        ajaxCacheData[url] = value;
        Storage.set([{
            name: CACHE_KEY_NAME,
            value: JSON.stringify(ajaxCacheData)
        }]);
    }
    /**
     * 使用jQuery发起ajax请求
     *
     * @static
     *
     * @param {array} options 请求配置参数
     * @param {function} error 请求错误回调
     * @options {string} url 请求地址
     * @options {string} type 请求方式
     * @options {object} data 请求数据
     * @options {object} headers 请求头
     * @options {string} errorHandMode 错误处理模式
     * @options {string} expires 过期时间，值为s50:表示50秒，h50:表示50小时，d50:表示50天
     * @options {function} succeed 成功回调
     * @options {function} failure 失败回调
     * @returns
     *
     * @memberof HttpRequest
     */
    static ajax(options, error) {
        let defaults = {
            url: "",
            type: "GET",
            data: null,
            headers: {
                "Content-Type": "application/json"
            },
            errorHandMode: "all",
            expires: "",
            succeed: function (res) {
                return true;
            },
            failure: function (res) {
                return true;
            }
        };
        let config = $.extend(true, defaults, options);
        let errorCallback = error;
        let url = config.url;
        let type = config.type;
        let data = config.data;
        if (type == 'GET') {
            config.headers = null;
        }
        if (data !== null && config.headers != null) {
            data = JSON.stringify(data);
        }
        if (config.expires != "") {
            let cacheData = HttpRequest.readCacheData(config.expires, config.url);
            if (cacheData != null) {
                HttpRequest.abnormal(cacheData, function (cacheData) {
                    config.succeed(cacheData);
                }, function (cacheData) {
                    config.failure(cacheData);
                }, config.errorHandMode);
                return null;
            }
        }
        return $.ajax({
            type: type,
            url: url,
            data: data,
            headers: config.headers,
            success: function (res, textStatus, xhr) {
                HttpRequest.abnormal(res, function (res) {
                    if (config.expires != "") {
                        HttpRequest.writeCacheData(config.url, res);
                    }
                    config.succeed(res);
                }, function (res) {
                    config.failure(res);
                }, config.errorHandMode);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (textStatus != "success" && textStatus != "abort") {
                    VueInstance
                        .$Message
                        .error(NETWORK_ANOMALY);
                    errorCallback && errorCallback(XMLHttpRequest, textStatus, errorThrown);
                }
            }
        });
    }
    /**
     * 使用jQuery发起jsonp请求
     *
     * @static
     *
     * @param {array} options 请求配置参数
     * @param {function} error 请求错误回调
     * @options {string} url 请求地址
     * @options {object} data 请求数据
     * @options {string} errorHandMode 错误处理模式
     * @options {string} expires 过期时间，值为s50:表示50秒，h50:表示50小时，d50:表示50天
     * @options {function} succeed 成功回调
     * @options {function} failure 失败回调
     * @returns
     *
     * @memberof HttpRequest
     */
    static getJsonp(options, error) {
        let defaults = {
            url: "",
            async: true,
            data: null,
            errorHandMode: "all",
            expires: "",
            succeed: function (res) {
                return true;
            },
            failure: function (res) {
                return true;
            }
        };
        let config = $.extend(true, defaults, options);
        let errorCallback = error;
        let data = config.data;
        let ajaxConfig = {
            url: config.url,
            async: config.async,
            dataType: "jsonp",
            jsonp: "callback",
            success: function (res) {
                HttpRequest.abnormal(res, function (res) {
                    if (config.expires != "") {
                        HttpRequest.writeCacheData(config.url, res);
                    }
                    config.succeed(res);
                }, function (res) {
                    config.failure(res);
                }, config.errorHandMode);
            },
            error: (XMLHttpRequest, textStatus, errorThrown) => {
                if (textStatus != "success" && textStatus != "abort") {
                    VueInstance
                        .$Message
                        .error(NETWORK_ANOMALY);
                    errorCallback && errorCallback(XMLHttpRequest, textStatus, errorThrown);
                }
            }
        };
        if (data !== null) {
            data = JSON.stringify(data);
            ajaxConfig["data"] = data;
        }
        if (config.expires != "") {
            let cacheData = HttpRequest.readCacheData(config.expires, config.url);
            if (cacheData != null) {
                HttpRequest.abnormal(cacheData, function (cacheData) {
                    config.succeed(cacheData);
                }, function (cacheData) {
                    config.failure(cacheData);
                }, config.errorHandMode);
                return null;
            }
        }
        return $.ajax(ajaxConfig);
    }
    /**
     * 使用axios发起并发请求
     *
     * @static
     *
     * @param {array} options 请求配置参数
     * @param {function} error 请求错误回调
     * @options {string} url 请求地址
     * @options {string} type 请求方式
     * @options {object} data 请求数据
     * @options {object} headers 请求头
     * @options {function} errorMessage 错误处理模式
     * @options {string} errorHandMode 错误处理模式
     * @options {string} expires 过期时间，值为s50:表示50秒，h50:表示50小时，d50:表示50天
     * @options {function} succeed 成功回调
     * @options {function} failure 失败回调
     * @returns
     *
     * @memberof HttpRequest
     */
    static request(options, error) {
        let defaults = {
            url: "",
            type: "GET",
            data: null,
            headers: {
                "Content-Type": "application/json"
            },
            errorHandMode: "all",
            expires: "",
            succeed: function (res) {
                return true;
            },
            failure: function (res) {
                return true;
            }
        };
        let funcList = [];
        let errorCallback = error;
        for (let ret of options) {
            let config = $.extend(true, defaults, ret);
            let axiosOptions = {
                url: config.url,
                method: config.type,
                headers: config.headers,
                succeed: config.succeed,
                failure: config.failure,
                errorHandMode: config.errorHandMode,
                expires: config.expires
            };
            if (config.type == "GET") {
                config.headers = null;
            }
            if (config.data !== null && config.headers !== null) {
                axiosOptions["data"] = config.data;
                if (config.headers["Content-Type"] && config.headers["Content-Type"].indexOf("x-www-form-urlencoded") != -1) {
                    axiosOptions["data"] = $.param(axiosOptions["data"]);
                }
            } else {
                axiosOptions["params"] = config.data;
            }
            if (config.expires != "") {
                let cacheData = HttpRequest.readCacheData(config.expires, config.url);
                if (cacheData != null) {
                    HttpRequest.abnormal(cacheData, function (cacheData) {
                        config.succeed(cacheData);
                    }, function (cacheData) {
                        config.failure(cacheData);
                    }, config.errorHandMode);
                    return null;
                }
            }
            funcList.push((() => {
                return axios.request(axiosOptions);
            })());
        }
        axios
            .all(funcList)
            .then(axios.spread(function () {
                let len = arguments.length;
                for (let i = 0; i < len; i++) {
                    let arg = arguments[i];
                    let data = arg.data;
                    let isLogin = HttpRequest.abnormal(data, function (data) {
                        arg
                            .config
                            .succeed(data);
                    }, function (data) {
                        arg
                            .config
                            .failure(data);
                    }, arg.config.errorHandMode);
                    if (!isLogin) {
                        break;
                    } else {
                        if (arg.config.expires != "") {
                            HttpRequest.writeCacheData(arg.config.url, data);
                        }
                    }
                }
            }))
            .catch(function (error) {
                let status = error.status;
                if (status !== undefined && status != 200 && status != 307) {
                    VueInstance
                        .$Message
                        .error(NETWORK_ANOMALY);
                }
                errorCallback && errorCallback();
                console.log(error);
            });
    }
}
VueInstance.http = HttpRequest;
export default HttpRequest;