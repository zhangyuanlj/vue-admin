import $ from 'jQuery';
import 'utils/json2.js';
/**
 * Socket操作类
 *
 * @class Socket
 */
class Socket {
    constructor(options) {
        this._defaults = {
            // 连接地址
            url: "",
            // 连接成功时的回调
            onOpen: function (e) {
                return;
            },
            // 收到服务器消息时的回调
            onMessage: function (e) {
                return;
            },
            // 出错时的回调
            onError: function (e) {
                return;
            },
            // 连接关闭时的回调
            onClose: function (e) {
                return;
            }
        };
        $.extend(true, this._defaults, options);
        this._initConnect();
    }
    // 初始化长连接
    _initConnect(callback) {
        let self = this,
            defaults = this._defaults,
            websocket = window.WebSocket || window.MozWebSocket;
        this._socketObj = new websocket(encodeURI(defaults.url));
        // Connection opened
        this._socketObj.onopen = function (event) {
            !self._isConnected && callback && callback();
            self._isConnected = true;
            defaults.onOpen(event);
        };
        // Listen for messages
        this._socketObj.onmessage = function (event) {
            defaults.onMessage(event);
        };
        // Listen for closed
        this._socketObj.onclose = function (event) {
            self._close();
            defaults.onClose(event);
        };
        // Listen for error
        this._socketObj.onerror = function (event) {
            defaults.onError(event);
        };
    }
    // 发送
    _send(message) {
        console.log(JSON.stringify(message));
        this
            ._socketObj
            .send(JSON.stringify(message));
    }
    // 关闭
    _close() {
        this._isConnected = false;
        this
            ._socketObj
            .close();
    }
    // 发送消息
    send(message) {
        console.log(this._socketObj);
        let self = this;
        if (!this._socketObj || this._socketObj.readyState != 1) {
            this._close();
            this._initConnect(function () {
                self._send(message);
            });
        } else {
            this._send(message);
        }
    }
    // 关闭连接
    close() {
        this._close();
    }
}
Socket._isConnected = false;
Socket._socketObj = null;
export default Socket;