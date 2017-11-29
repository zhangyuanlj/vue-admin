/**
 * 删除字符串左右两端的空格 
 * @param {Str} str 被trim的字符串 
 */
let trim = function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}


/**
 * 通过事件event.target 向上寻找指定nodeName和className的节点
 * @param {Obj} e event事件对象
 * @param {Str} nodeName 节点名
 * @param {Str} className 单个css类名 
 */
let getDomByTarget = function(e, nodeName, className) {
    let target = e.target;
    let path = e.path;
    let len = path && path.length ? path.length : 0;
    let i, node;
    if (judgeNodeByNameAndClass(target, nodeName, className)) {
        return target;
    } else {
        for (i = 1; i < len; i++) {
            node = path[i];
            if (judgeNodeByNameAndClass(node, nodeName, className)) {
                return node;
            }
        }
        return null;
    }
};

/**
 * 通过节点名和节点class名判断是否是目标节点
 * @param {Object} node js 原生dom对象 
 * @param {String} nodeName 节点名
 * @param {String} _class 单个css类名
 */
let judgeNodeByNameAndClass = function(node, nodeName, _class) {
    let _nodeName = nodeName + '';
    if (node.nodeName === _nodeName.toUpperCase() && arrayContainItem(node.classList, _class)) {
        return true;
    } else {
        return false;
    }
};

/**
 * 数组是否包括某个元素
 * @param {Array} arr 数组
 * @param {*} item  数组元素
 */
let arrayContainItem = function(arr, item) {
    let i, _item;
    for (i = 0; i < arr.length; i++) {
        _item = arr[i];
        if (_item === item) {
            return true;
        }
    }
    return false;
};

/**
 * 返回数组中指定元素的索引
 * @param {Array} arr 数组
 * @param {*} item  数组元素
 */
let getArrayIndexByItem = function(arr, item) {
    let i, _item;
    for (i = 0; i < arr.length; i++) {
        _item = arr[i];
        if (_item === item) {
            return i;
        }
    }
    return null;
};


/**
 * 获取节点指定attribute属性值
 * @param {Object} dom js 原生dom对象 
 * @param {String} attrName attr属性名
 */
let getDomAttribute = function(dom, attrName) {
    let i, attr, data;
    if (dom && dom.attributes && attrName !== "") {
        attr = dom.attributes;
        for (i in attr) {
            data = attr[i];
            if (data.nodeName === attrName) {
                return data.nodeValue || null
            }
        }
        return null;
    } else {
        return null;
    }
};

/**
 * 获取dom元素位置和尺寸
 * @param {Object} dom js 原生dom对象 
 */
let getDomPosition = function(dom) {
    let result, left, top, width, height;
    if (dom && dom.nodeName) {
        left = dom.offsetLeft;
        top = dom.offsetTop;
        width = dom.offsetWidth;
        height = dom.offsetHeight;
        result = {
            left: left,
            top: top,
            width: width,
            height: height
        }
        return result;
    } else {
        return null;
    }
};

/**
 * 添加事件
 * @param {Object} dom js原生dom对象
 * @param {String} eventType 事件类型
 * @param {Function} handlerFunc 事件处理方法 
 */
let addEventHandler = function(dom, eventType, handlerFunc) {
    if (dom.addEventListener) {
        dom.addEventListener(eventType, handlerFunc, false);
    } else {
        dom.attachEvent('on' + eventType, handlerFunc);
    }
};

/**
 * 移除事件
 * @param {Object} dom js原生dom对象
 * @param {String} eventType 事件类型
 * @param {Function} handlerFunc 事件处理方法 
 */
let removeEventHandler = function(dom, eventType, handlerFunc) {
    if (dom.removeEventListener) {
        dom.removeEventListener(eventType, handlerFunc);
    } else {
        dom.detachEvent('on' + eventType, handlerFunc);
    }
};

/**
 * 通过css选择权返回第一个匹配的dom对象
 * @param {String} selector css选择器 
 */
let querySelector = function(selector) {
    return document.querySelector(selector);
}

/**
 * 通过css选择器返回匹配的所有dom对象数组
 * @param {String} selector css选择器
 */
let querySelectorAll = function(selector) {
    return document.querySelectorAll(selector);
}

export default util = {
    trim: trim, //删除字符串左右两端的空格 
    querySelectorAll: querySelectorAll, //通过css选择器返回匹配的所有dom对象数组
    querySelector: querySelector, //通过css选择权返回第一个匹配的dom对象
    getDomByTarget: getDomByTarget, //通过事件event.target 向上寻找指定nodeName和className的节点
    getDomAttribute: getDomAttribute, //获取节点指定attribute属性值
    getDomPosition: getDomPosition, //获取dom元素位置和尺寸
    addEventHandler: addEventHandler, //添加事件
    removeEventHandler: removeEventHandler //移除事件
}