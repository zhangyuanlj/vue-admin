/*
 * 无限级树目录
 * author:张渊
 * modifyTime:2017-05-31
 */
import $ from 'jQuery';
import Helper from 'utils/helper.js';
//每个节点每次加载的最大数目
let MAX_LOAD_LEN = 100;
let Tree = function (config) {
    this.$doc = $(document);
    this.$treeView = null;
    this.isRoot = true;
    this.page = 1;
    this.speed = 200;
    this.config = {
        $parent: $("#treeWrapper"),
        action: "treeview.php?id={id}",
        ajaxType: "GET",
        keyName: {
            id: "id",
            parentId: "parentId",
            name: "name"
        },
        rootId: 0,
        selectNodes: "",
        nodeOptions: {
            showNodeLevelName: false,
            hasRadio: false,
            hasCheckBox: false,
            customData: [],
            saveKeyName: "id"
        },
        expandAll: false,
        loadingCallback: function () {
            return true;
        },
        successCallback: function () {
            return true;
        },
        expandCallback: function () {
            return true;
        },
        nodeCallback: function (nodeValue) {
            return true;
        },
        checkedCallback: function (eventName) {
            return true;
        }
    };
    this._setConfig(config);
    this.init();
};
Tree.prototype = {
    /**
     * 设置config
     * @param object config 配置项
     */
    _setConfig: function (config) {
        if (!config) {
            return false;
        }
        $.extend(true, this.config, config);
    },
    //获取选中节点
    _getSelectNodes: function () {
        return this.config.selectNodes != "" ?
            this
            .config
            .selectNodes
            .split(",") :
            "";
    },
    /**
     * 获取请求的地址
     * @param string action 请求地址
     * @param integer nodeId 节点id
     */
    _getAction: function (action, nodeId) {
        return action.replace(/{id}/g, nodeId);
    },
    /**
     * 初始化树
     * @param object config 配置项
     */
    _render: function (config) {
        let $parent = config.$parent;
        let date = new Date();
        let treeViewId = Helper.setId("treeview");
        this.treeTemp = '<ul id="' + treeViewId + '"></ul>';
        this.treeListTemp = '<li class="c-treeview-li" data-id="{nodeId}" data-parent-id="{nodeParentId}" ' +
            'data-title="{node}" data-leaf="{leaf}" data-disable="{disable}"{customData}><a href' +
            '="javascript:void(0);" class="c-treeview-a{disableStyle}" title="{node}">{fold}{' +
            'selected}<strong class="c-treeview-node">{icon}<span>{nodeName}</span></strong></a>{children}' +
            '</li>';
        $parent.html(this.treeTemp);
        this.$treeView = $("#" + treeViewId);
    },
    /**
     * 加载数据成功回调
     * @param object paramList 参数列表
     */
    _loadTreeSuccess: function (paramList) {
        let that = this;
        let _config = this.config;
        let treeHtml = [];
        let list = paramList.res.data;
        let expandAll = _config.expandAll;
        let keyName = _config.keyName;
        let saveKeyName = _config.nodeOptions.saveKeyName;
        let isPartialLoad = false;
        if (!paramList.res.code) {
            let dataLength = list.length;
            let totalPage = Math.ceil(dataLength / MAX_LOAD_LEN);
            if (dataLength > MAX_LOAD_LEN) {
                this.page++;
                dataLength = MAX_LOAD_LEN;
                isPartialLoad = true;
            }
            for (let i = 0; i < dataLength; i++) {
                (function (index) {
                    try {
                        let id = list[index][keyName.id];
                        let saveKeyValue = list[index][saveKeyName];
                        let parentId = paramList.nodeId;
                        let name = list[index][keyName.name];
                        let nodeName = name;
                        let disable = list[index].disable;
                        let expand = list[index].expand;
                        let icon = list[index].icon;
                        let isParent = !list[index].leaf;
                        let selected = "";
                        let temp = that.treeListTemp;
                        if (_config.nodeOptions.showNodeLevelName) {
                            let nodeLevelName = that._getNodeLevelName(parentId);
                            if (nodeLevelName != "") {
                                name = nodeLevelName + name;
                            }
                        }
                        if (!disable) {
                            disable = false;
                        }
                        if (!expand) {
                            expand = false;
                        }
                        if (!icon) {
                            icon = "";
                        }
                        if (_config.nodeOptions.hasRadio) {
                            selected = (that.selectNodes != "" && $.inArray(saveKeyValue, that.selectNodes) != -1) ?
                                '<i class="c-treeview-radio c-treeview-radio-checked"></i>' :
                                '<i class="c-treeview-radio"></i>';
                        } else if (_config.nodeOptions.hasCheckBox) {
                            selected = (that.selectNodes != "" && $.inArray(saveKeyValue, that.selectNodes) != -1) ?
                                '<i class="c-treeview-check c-treeview-checked"></i>' :
                                '<i class="c-treeview-check"></i>';
                            if (paramList.$list != null) {
                                let $parentNode = paramList
                                    .$list
                                    .find(".c-treeview-a:eq(0)");
                                let $checkNode = $parentNode
                                    .parents(".c-treeview-li:eq(0)")
                                    .find(".c-treeview-checked");
                                if ($checkNode.length && !$parentNode.hasClass("c-treeview-disable")) {
                                    selected = '<i class="c-treeview-check c-treeview-checked"></i>';
                                }
                            }
                        }
                        if ((expandAll && isParent) || (that._isExpand(saveKeyValue) && isParent)) {
                            expand = true;
                        }
                        if (icon == "") {
                            if (isParent) {
                                icon = '<i class="c-treeview-icon c-treeview-picon"></i>';
                            } else {
                                icon = '<i class="c-treeview-icon c-treeview-cicon"></i>';
                            }
                        } else {
                            icon = '<i class="c-treeview-icon ' + icon + '"></i>';
                        }
                        temp = temp.replace(/{nodeId}/g, id);
                        temp = temp.replace(/{nodeParentId}/g, parentId);
                        temp = temp.replace(/{fold}/g, isParent ?
                            '<i class="c-treeview-fold"></i>' :
                            '<i class="c-treeview-placehd"></i>');
                        temp = temp.replace(/{icon}/g, icon);
                        temp = temp.replace(/{node}/g, name);
                        temp = temp.replace(/{nodeName}/g, nodeName);
                        temp = temp.replace(/{disable}/g, disable);
                        temp = temp.replace(/{disableStyle}/g, disable ?
                            ' c-treeview-disable' :
                            '');
                        temp = temp.replace(/{selected}/g, selected);
                        temp = temp.replace(/{children}/g, isParent ?
                            '<ul class="c-treeview-child"></ul>' :
                            '');
                        temp = temp.replace(/{leaf}/g, isParent ?
                            'false' :
                            'true');
                        temp = that._setCustomData(list[index], temp);
                        treeHtml.push(temp);
                        if (expand) {
                            setTimeout(function () {
                                that._expandNode(id);
                            }, 100);
                        }
                    } catch (err) {
                        console.log(err);
                    }
                })(i);
            }
            if (this.isRoot) {
                this.isRoot = false;
            } else {
                paramList
                    .$fold
                    .removeClass("c-treeview-loading");
                paramList
                    .$list
                    .attr("data-load", "true");
            }
            if (!isPartialLoad) {
                paramList
                    .$tree
                    .html(treeHtml.join("\n"));
                paramList
                    .$tree
                    .hide()
                    .slideDown(that.speed);
                this
                    .config
                    .successCallback();
            } else {
                paramList
                    .$tree
                    .append(treeHtml.join("\n"));
                if (this.page <= totalPage) {
                    this._loadTree(paramList.nodeId, paramList.action, isPartialLoad);
                } else {
                    this
                        .config
                        .successCallback();
                }
            }
        }
    },
    /**
     * 加载树
     * @param integer nodeId 节点ID
     * @param string action 请求地址
     * @param boolean isPartialLoad 是否分批加载
     */
    _loadTree: function (nodeId, action, isPartialLoad) {
        let $tree = this.$treeView;
        let $list = null;
        let $fold = null;
        let _action = this._getAction(action, nodeId);
        let treeViewId = $tree.attr("id");
        let that = this;
        let _config = this.config;
        let requestData = {};
        requestData["page"] = this.page;
        requestData["pageSize"] = MAX_LOAD_LEN;
        if (!this.isRoot) {
            $list = $("#" + treeViewId + " .c-treeview-li[data-id='" + nodeId + "']");
            $childList = $("#" + treeViewId + " .c-treeview-li[data-id='" + nodeId + "'] .c-treeview-child").eq(0);
            $fold = $("#" + treeViewId + " .c-treeview-li[data-id='" + nodeId + "'] .c-treeview-a:eq(0) .c-treeview-fold");
            $tree = $childList;
            $fold.addClass("c-treeview-loading");
        }
        _config.loadingCallback();
        $.ajax({
            url: _action,
            type: _config.ajaxType,
            data: requestData,
            dataType: "json",
            success: function (res) {
                let paramList = {
                    $tree: $tree,
                    $fold: $fold,
                    $list: $list,
                    res: res,
                    nodeId: nodeId,
                    action: _action
                };
                that._loadTreeSuccess(paramList);
            }
        });
    },
    /**
     * 是否展开一个节点
     * @param string saveKeyValue 保存到数据里的节点的值
     */
    _isExpand: function (saveKeyValue) {
        let len = this.selectNodes.length;
        for (let i = 0; i < len; i++) {
            if (!this.selectNodes[i].indexOf(saveKeyValue) && saveKeyValue != this.selectNodes[i]) {
                return true;
            }
        }
        return false;
    },
    /**
     * 设置节点自定义属性
     * @param object nodeData 节点数据
     * @param string temp 生成的节点模版
     */
    _setCustomData: function (nodeData, temp) {
        let _temp = temp;
        let customData = this.config.nodeOptions.customData;
        let len = customData.length;
        if ($.isArray(customData) && customData.length) {
            let dataList = [];
            for (let i = 0; i < len; i++) {
                let attrName = customData[i];
                let attrVal = nodeData[attrName] ? nodeData[attrName] : "";
                dataList.push('data-' + customData[i] + '="' + attrVal + '"');
            }
            dataList = " " + dataList.join(" ");
            _temp = temp.replace(/{customData}/g, dataList);
        } else {
            _temp = temp.replace(/{customData}/g, "");
        }
        return _temp;
    },
    /**
     * 获取节点自定义属性
     * @param object $node jQuery dom对象
     */
    _getCustomData: function ($node) {
        let dataList = {};
        let customData = this.config.nodeOptions.customData;
        let len = customData.length;
        for (let i = 0; i < len; i++) {
            let attrName = 'data-' + customData[i];
            dataList[customData[i]] = $node.attr(attrName);
        }
        return dataList;
    },
    _expandEventFunc: function ($node, treeViewId, _config) {
        let $parent = $node.parents(".c-treeview-li");
        let nodeId = $parent.attr("data-id");
        let parentId = $parent.attr("data-parent-id");
        let $list = $("#" + treeViewId + " .c-treeview-li[data-id='" + nodeId + "'] .c-treeview-child").eq(0);
        let $icon = $("#" + treeViewId + " .c-treeview-li[data-id='" + nodeId + "'] .c-treeview-a:eq(0) .c-treeview-icon");
        let dataLoad = $parent.attr("data-load");
        let disable = $parent.attr("data-disable");
        if (disable == "true" || $node.hasClass("c-treeview-loading")) {
            return false;
        }
        if ($node.hasClass("c-treeview-fold-open")) {
            $node.removeClass("c-treeview-fold-open");
            if ($icon.hasClass("c-treeview-picon")) {
                $icon.removeClass("c-treeview-picon-open");
            }
            $list.slideUp(this.speed);
        } else {
            $node.addClass("c-treeview-fold-open");
            if ($icon.hasClass("c-treeview-picon")) {
                $icon.addClass("c-treeview-picon-open");
            }
            $list.slideDown(this.speed);
        }
        _config.expandCallback();
        if (dataLoad == "true") {
            return false;
        }
        this._expandNode(nodeId);
    },
    //绑定树展开关闭事件
    _expandEvent: function () {
        let $tree = this.$treeView;
        let treeViewId = $tree.attr("id");
        let that = this;
        let selector = "#" + treeViewId + " .c-treeview-fold";
        let _config = this.config;
        this
            .$doc
            .off(selector)
            .on("click", selector, function (e) {
                that._expandEventFunc($(this), treeViewId, _config);
                e.stopPropagation();
            });
    },
    //给每个节点绑定事件
    _bindNodeEvent: function () {
        let self = this;
        let $tree = this.$treeView;
        let treeViewId = $tree.attr("id");
        let selector = "#" + treeViewId + " .c-treeview-a";
        let _config = this.config;
        this
            .$doc
            .off(selector)
            .on("click", selector, function (e) {
                let $this = $(this);
                let $parent = $this.parents(".c-treeview-li");
                let $nodeTag = $this.children(".c-treeview-node");
                let nodeId = $parent.attr("data-id");
                let parentId = $parent.attr("data-parent-id");
                let name = $parent.attr("data-title");
                let disable = $parent.attr("data-disable");
                if (disable == "true") {
                    return false;
                }
                let nodeValue = {
                    id: nodeId,
                    parentId: parentId,
                    name: name
                };
                let customData = self._getCustomData($parent);
                nodeValue = $.extend(nodeValue, customData, true);
                $("#" + treeViewId + " .c-treeview-node").removeClass("c-treeview-select");
                $nodeTag.addClass("c-treeview-select");
                _config.nodeCallback(nodeValue);
                e.stopPropagation();
            });
    },
    //获取禁止选择的checkbox列表
    _getDisableList: function (treeViewId, nodeId) {
        return $("#" + treeViewId + " li[data-id='" + nodeId + "'] .c-treeview-child .c-treeview-a[class*='c-treeview-disable'] .c-treeview-check");
    },
    //获取checkbox列表
    _getList: function (treeViewId, nodeId, $disableCheckbox) {
        return $("#" + treeViewId + " li[data-id='" + nodeId + "'] .c-treeview-child .c-treeview-check").not($disableCheckbox);
    },
    //获取选中checkbox列表
    _getCheckedList: function (treeViewId, nodeId, $disableCheckbox) {
        return $("#" + treeViewId + " li[data-id='" + nodeId + "'] .c-treeview-child .c-treeview-checked").not($disableCheckbox);
    },
    /**
     * 选中节点
     * @param Array $node 节点
     */
    _checked: function ($node) {
        let nodeLength = $node.length;
        for (let i = 0; i < nodeLength; i++) {
            $node[i].removeClass("c-treeview-half-checked");
            $node[i].addClass("c-treeview-checked");
        }
    },
    /**
     * 撤销选中
     * @param Array $node 节点
     */
    _unChecked: function ($node) {
        let nodeLength = $node.length;
        for (let i = 0; i < nodeLength; i++) {
            $node[i].removeClass("c-treeview-half-checked");
            $node[i].removeClass("c-treeview-checked");
        }
    },
    /**
     * 设置半选
     * @param Array $node 节点
     */
    _halfChecked: function ($node) {
        let nodeLength = $node.length;
        for (let i = 0; i < nodeLength; i++) {
            $node[i].removeClass("c-treeview-checked");
            $node[i].addClass("c-treeview-half-checked");
        }
    },
    /**
     * 查找父节点，并处理全选、反选、半选
     * @param String parentId 父节点ID
     */
    _searchParentNodes: function (parentId) {
        let $tree = this.$treeView;
        let treeViewId = $tree.attr("id");
        let $parentNode = $("#" + treeViewId + " li[data-id='" + parentId + "']");
        let nodeOptions = this.config.nodeOptions;
        if (!$parentNode.length) {
            return false;
        }
        let $nodes = $parentNode;
        if (nodeOptions.hasCheckBox) {
            let $nodesCheck = $("#" + treeViewId + " li[data-id='" + parentId + "'] .c-treeview-check").eq(0);
            let $disableCheckbox = this._getDisableList(treeViewId, parentId);
            let $checkList = this._getList(treeViewId, parentId, $disableCheckbox);
            let $checkedList = this._getCheckedList(treeViewId, parentId, $disableCheckbox);
            let checkListLen = $checkList.length;
            let checkedListLen = $checkedList.length;
            $nodesCheck = $nodesCheck.not($tree.find(".c-treeview-disable .c-treeview-check"));
            if ((checkedListLen < checkListLen) && checkedListLen) {
                this._halfChecked([$nodesCheck]);
            } else if (!checkedListLen) {
                this._unChecked([$nodesCheck]);
            } else {
                this._checked([$nodesCheck]);
            }
        } else if (nodeOptions.hasRadio) {
            let $item = $("#" + treeViewId + " li[data-id='" + parentId + "'] .c-treeview-radio");
            let $nodesCheck = $item
                .eq(0)
                .not($tree.find(".c-treeview-disable .c-treeview-radio"));
            let $li = $nodesCheck
                .parents(".c-treeview-li")
                .eq(0);
            let itemParentId = $li.attr("data-parent-id");
            let $excludeList = $li.find(".c-treeview-child .c-treeview-radio");
            let $radioList = $("#" + treeViewId + " li[data-parent-id='" + itemParentId + "'] .c-treeview-radio").not($excludeList);
            $radioList.removeClass("c-treeview-radio-checked");
            if ($li.find(".c-treeview-radio-checked").length) {
                $nodesCheck.addClass("c-treeview-radio-checked");
            } else {
                $nodesCheck.removeClass("c-treeview-radio-checked");
            }
        }
        let nodesParentId = $nodes.attr("data-parent-id");
        this._searchParentNodes(nodesParentId);
    },
    //获取节点层级名称
    _getNodeLevelName: function (parentId) {
        let $parentNode = this
            .$treeView
            .find("li[data-id='" + parentId + "']");
        let title = $parentNode.attr("data-title");
        if (title) {
            return title + "->";
        }
        return "";
    },
    /**
     * 展开指定节点
     * @param Integer nodeId 当前节点ID
     */
    _expandNode: function (nodeId) {
        let $tree = this.$treeView;
        let treeViewId = $tree.attr("id");
        let $fold = $("#" + treeViewId + " .c-treeview-li[data-id='" + nodeId + "'] .c-treeview-a:eq(0) .c-treeview-fold");
        let $icon = $("#" + treeViewId + " .c-treeview-li[data-id='" + nodeId + "'] .c-treeview-a:eq(0) .c-treeview-icon");
        let _action = this._getAction(this.config.action, nodeId);
        $fold.addClass("c-treeview-fold-open");
        if ($icon.hasClass("c-treeview-picon")) {
            $icon.addClass("c-treeview-picon-open");
        }
        this._loadTree(nodeId, _action, false);
    },
    //获取控件ID
    getId: function () {
        return this
            .$treeView
            .attr("id");
    },
    /**
     * 选中一个或者多个节点
     * @param object nodeData 节点数据
     */
    nodeCheckedEvent: function (nodeData) {
        let $tree = this.$treeView;
        let treeViewId = $tree.attr("id");
        let that = this;
        let selector = "#" + treeViewId + " .c-treeview-check";
        let _config = this.config;
        let selectCallback = function ($selected) {
            let $this = $selected;
            let $parent = $this.parents(".c-treeview-li");
            let nodeId = $parent.attr("data-id");
            let parentId = $parent.attr("data-parent-id");
            let disable = $parent.attr("data-disable");
            let parent = $parent
                .children(".c-treeview-child")
                .length ?
                true :
                false;
            let $disableCheckbox = that._getDisableList(treeViewId, nodeId);
            let $checkbox = that._getList(treeViewId, nodeId, $disableCheckbox);
            let eventName = "checked";
            if (disable == "true") {
                return false;
            }
            if (!$this.hasClass("c-treeview-checked")) {
                that._checked([$this]);
                if (parent) {
                    $checkbox.removeClass("c-treeview-half-checked");
                    $checkbox.addClass("c-treeview-checked");
                }
            } else {
                that._unChecked([$this]);
                if (parent) {
                    $checkbox.removeClass("c-treeview-half-checked");
                    $checkbox.removeClass("c-treeview-checked");
                }
                eventName = "unChecked";
            }
            that._searchParentNodes(parentId);
            _config.checkedCallback(eventName);
        };
        if (nodeData) {
            let $selected = $("#" + treeViewId + " .c-treeview-li[data-id='" + nodeData.id + "'] .c-treeview-check").eq(0);
            selectCallback($selected);
        } else {
            this
                .$doc
                .off(selector)
                .on("click", selector, function (e) {
                    selectCallback($(this));
                    e.stopPropagation();
                });
        }
    },
    /**
     * 单选按钮事件
     * @param object nodeData 节点数据
     */
    nodeRadioEvent: function (nodeData) {
        let $tree = this.$treeView;
        let treeViewId = $tree.attr("id");
        let that = this;
        let selector = "#" + treeViewId + " .c-treeview-radio";
        let _config = this.config;
        let selectCallback = function ($selected) {
            let $this = $selected;
            let $parent = $this.parents(".c-treeview-li");
            let nodeId = $parent.attr("data-id");
            let parentId = $parent.attr("data-parent-id");
            let disable = $parent.attr("data-disable");
            let $radioList = $tree.find(".c-treeview-radio");
            let eventName = "checked";
            if (disable == "true") {
                return false;
            }
            $radioList
                .not($this)
                .removeClass("c-treeview-radio-checked");
            if (!$this.hasClass("c-treeview-radio-checked")) {
                $this.addClass("c-treeview-radio-checked");
            } else {
                $this.removeClass("c-treeview-radio-checked");
                eventName = "unChecked";
            }
            _config.checkedCallback(eventName);
        };
        if (nodeData) {
            let $selected = $("#" + treeViewId + " .c-treeview-li[data-id='" + nodeData.id + "'] .c-treeview-radio").eq(0);
            selectCallback($selected);
        } else {
            this
                .$doc
                .off(selector)
                .on("click", selector, function (e) {
                    selectCallback($(this));
                    e.stopPropagation();
                });
        }
    },
    //展开所有节点
    expandAll: function () {
        let _config = this.config;
        _config.expandAll = true;
        this.isRoot = true;
        this._loadTree(this.defaultNodeId, _config.action, false);
    },
    //切换树的状态
    toggle: function (display) {
        let $tree = this.$treeView;
        let treeViewId = $tree.attr("id");
        let $fold = $tree.find(".c-treeview-li:first .c-treeview-fold:first");
        if (display == "show") {
            $fold.removeClass("c-treeview-fold-open");
        } else if (display == "hide") {
            $fold.addClass("c-treeview-fold-open");
        }
        this._expandEventFunc($fold, treeViewId, this.config);
    },
    /**
     * 刷新树的某个节点
     * @param integer nodeId 节点ID
     * @param string action 请求地址
     */
    refreshNode: function (nodeId, action) {
        let $tree = this.$treeView;
        let treeViewId = $tree.attr("id");
        let parentId = $("#" + treeViewId + " .c-treeview-li[data-id='" + nodeId + "']").attr("data-parent-id");
        let $fold = $("#" + treeViewId + " .c-treeview-li[data-id='" + nodeId + "'] .c-treeview-a:eq(0) .c-treeview-fold");
        let $checkbox = $("#" + treeViewId + " .c-treeview-li[data-id='" + nodeId + "'] .c-treeview-a:eq(0) .c-treeview-check");
        if ($fold.hasClass("c-treeview-fold-open")) {
            this.page = 1;
            this._loadTree(nodeId, action, false);
        }
        this._searchParentNodes(parentId);
    },
    /**
     * 创建一个节点
     * @param object nodeData 节点数据
     */
    createNode: function (nodeData) {
        let $tree = this.$treeView;
        let temp = this.treeListTemp;
        let config = this.config;
        let keyName = config.keyName;
        let nodeId = nodeData[keyName.id] ? nodeData[keyName.id] : -1;
        let parentId = nodeData[keyName.parentId] ? nodeData[keyName.parentId] : config.rootId;
        let name = nodeData[keyName.name] ? nodeData[keyName.name] : "";
        let disable = nodeData[keyName.disable] ? nodeData[keyName.disable] : false;
        let leaf = nodeData[keyName.leaf] ? nodeData[keyName.leaf] : true;
        let icon = nodeData[keyName.icon] ? nodeData[keyName.icon] : "";
        let $parentNode = $tree.find(".c-treeview-li[data-id='" + parentId + "']");
        let $childList = $parentNode.find(".c-treeview-child").eq(0);
        let $fold = $parentNode.find(".c-treeview-fold").eq(0);
        let $icon = $parentNode.find(".c-treeview-icon").eq(0);
        let isParent = !leaf;
        let selected = "";
        if (!$childList.length) {
            $parentNode.append('<ul class="c-treeview-child"></ul>');
        }
        if (!$fold.length) {
            $fold = $parentNode.find(".c-treeview-placehd").eq(0);
            $fold.removeClass("c-treeview-placehd");
            $fold.addClass("c-treeview-fold");
        }
        if ($icon.hasClass("c-treeview-cicon")) {
            $icon.removeClass("c-treeview-cicon");
            $icon.addClass("c-treeview-picon");
        }
        $fold.addClass("c-treeview-fold-open");
        if (config.nodeOptions.hasRadio) {
            selected = '<i class="c-treeview-radio"></i>';
        } else if (config.nodeOptions.hasCheckBox) {
            selected = '<i class="c-treeview-check"></i>';
        }
        if (icon == "") {
            $icon.addClass("c-treeview-picon-open");
            if (isParent) {
                icon = '<i class="c-treeview-icon c-treeview-picon"></i>';
            } else {
                icon = '<i class="c-treeview-icon c-treeview-cicon"></i>';
            }
        } else {
            icon = '<i class="c-treeview-icon ' + icon + '"></i>';
        }
        temp = temp.replace(/{nodeId}/g, nodeId);
        temp = temp.replace(/{nodeParentId}/g, parentId);
        temp = temp.replace(/{fold}/g, isParent ?
            '<i class="c-treeview-fold"></i>' :
            '<i class="c-treeview-placehd"></i>');
        temp = temp.replace(/{icon}/g, icon);
        temp = temp.replace(/{node}/g, name);
        temp = temp.replace(/{nodeName}/g, name);
        temp = temp.replace(/{disable}/g, disable);
        temp = temp.replace(/{disableStyle}/g, disable ?
            ' c-treeview-disable' :
            '');
        temp = temp.replace(/{selected}/g, selected);
        temp = temp.replace(/{children}/g, isParent ?
            '<ul class="c-treeview-child"></ul>' :
            '');
        temp = temp.replace(/{leaf}/g, isParent ?
            'false' :
            'true');
        temp = this._setCustomData(nodeData, temp);
        $childList.append(temp);
        if (parentId == config.rootId) {
            this.isRoot = true;
        }
        this._expandNode(parentId);
    },
    /**
     * 更新一个节点
     * @param object nodeData 节点数据
     */
    updateNode: function (nodeData) {
        let $tree = this.$treeView;
        let config = this.config;
        let keyName = config.keyName;
        let customData = config.nodeOptions.customData;
        let nodeId = nodeData[keyName.id] ? nodeData[keyName.id] : -1;
        let name = nodeData[keyName.name] ? nodeData[keyName.name] : "";
        let disable = nodeData[keyName.disable] ? nodeData[keyName.disable] : false;
        let leaf = nodeData[keyName.leaf] ? nodeData[keyName.leaf] : true;
        let icon = nodeData[keyName.icon] ? nodeData[keyName.icon] : "";
        let isParent = !leaf;
        let $node = $tree.find(".c-treeview-li[data-id='" + nodeId + "']");
        let $link = $node.find(".c-treeview-a").eq(0);
        let $name = $link.find(".c-treeview-node span").eq(0);
        let len = customData.length;
        if ($.isArray(customData) && customData.length) {
            for (let i = 0; i < len; i++) {
                let attrName = customData[i];
                let attrVal = nodeData[attrName] ? nodeData[attrName] : "";
                $node.attr("data-" + customData[i], attrVal);
            }
        }
        $node.attr({
            "data-id": nodeId,
            "data-title": name,
            "data-leaf": leaf,
            "data-disable": disable
        });
        $node.find(".c-treeview-a").eq(0).attr("title", name);
        $name.text(name);
    },
    /**
     * 删除一个节点
     * @param integer nodeId 节点数据
     */
    removeNode: function (nodeId) {
        let $tree = this.$treeView;
        let $node = $tree.find(".c-treeview-li[data-id='" + nodeId + "']");
        $node.remove();
    },
    //获取选中的节点
    getSelectNode: function () {
        let $tree = this.$treeView;
        let treeViewId = $tree.attr("id");
        let $selectNodes = $("#" + treeViewId + " .c-treeview-node[class*='c-treeview-select']");
        if (!$selectNodes.length) {
            return null;
        }
        let $parent = $selectNodes.parents(".c-treeview-li");
        let id = $parent.attr("data-id");
        let parentId = $parent.attr("data-parent-id");
        let name = $parent.attr("data-title");
        let ret = {
            id: id,
            parentId: parentId,
            name: name
        };
        let customData = this._getCustomData($selectNodes);
        return $.extend(true, ret, customData);
    },
    /**
     * 获取单选按钮、复选框选中的节点
     * @param boolean hasChild 当某个节点包含子节点时,选中时是否包含子节点
     */
    getCheckedNodes: function (hasChild) {
        let that = this;
        let _config = this.config;
        if (!_config.nodeOptions.hasRadio && !_config.nodeOptions.hasCheckBox) {
            console.error("树组件里不包含单选按钮和复选框,无法获取选中的值!");
            return false;
        }
        let $tree = this.$treeView;
        let treeViewId = $tree.attr("id");
        let selectStyle = _config.nodeOptions.hasRadio ?
            "c-treeview-radio-checked" :
            "c-treeview-checked";
        let $checkedNodes = $("#" + treeViewId + " ." + selectStyle);
        let nodesList = [];
        $checkedNodes.each(function () {
            let $this = $(this);
            let $item = $this.parents(".c-treeview-li");
            let checkNode = selectStyle == "c-treeview-checked" ?
                ".c-treeview-check:eq(0)" :
                ".c-treeview-radio:eq(0)";
            let $parent = $item
                .parents(".c-treeview-li:eq(0)")
                .find(checkNode);
            let id = $item.attr("data-id");
            let parentId = $item.attr("data-parent-id");
            let name = $item.attr("data-title");
            //复选框
            if (hasChild && $parent.hasClass(selectStyle)) {
                return true;
            }
            let ret = {
                id: id,
                parentId: parentId,
                name: name
            };
            let customData = that._getCustomData($item);
            let temp = $.extend(true, ret, customData);
            nodesList.push(temp);
        });
        return nodesList;
    },
    init: function () {
        let _config = this.config;
        this.selectNodes = this._getSelectNodes();
        this._render(_config);
        this._loadTree(_config.rootId, _config.action, false);
        this._expandEvent();
        this._bindNodeEvent();
        if (_config.nodeOptions.hasRadio) {
            this.nodeRadioEvent();
        }
        if (_config.nodeOptions.hasCheckBox) {
            this.nodeCheckedEvent();
        }
    },
    //销毁树目录
    destroy: function () {
        this
            .$treeView
            .remove();
        this.$treeView = null;
        return null;
    }
};
export default Tree;