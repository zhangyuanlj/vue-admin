// 带右键自定义菜单的下拉树
<template>
    <div :id="treeDomId" class="c-tree-context-menu">
        <TreeView :options="treeOptions" ref="contextMenuTree">
        </TreeView>
        <!-- 右键菜单 -->
        <ContextMenu :show="contextMenu.show" :top="contextMenu.top" :left="contextMenu.left" :list="contextMenuList"></ContextMenu>
        <!-- end 右键菜单 -->
    </div>
</template>
<script>

import './styles/treeContextMenu.style';
import PopMenu from './popMenu.vue';
import Util from './scripts/util.js';
export default {
    components: {
        ContextMenu: PopMenu
    },
    data() {
        return {
            treeDomId: "treeWithContextMenu",
            contextMenu: {
                show: false,
                left: 0,
                top: 0
            },
            contextMenuList: [],
            itemData: {}
        }
    },
    props: {
        //下拉树配置
        treeOptions: {
            type: Object,
            default: () => {
                return {
                    action: "",
                    ajaxType: "",
                    rootId: 0,
                    expandAll: false,
                    keyName: {
                        id: "",
                        parentId: "",
                        name: ""
                    },
                    nodeOptions: {
                        customData: []
                    }
                }
            }
        },
        //右键菜单配置
        menuList: {
            type: Array,
            default: [{
                title: "",//菜单名
                showIcon: true,//是否显示图标
                iconType: "plus-round",//图标名，参考iview
                clickFunc: (data) => {//菜单点击方法，返回当前树节点所有nodeOptions.customData的数据,并隐藏右键菜单
                    return false;
                }
            }]
        }
    },
    created() {
        let i, _menu;
        this.treeDomId += '-' + new Date().getTime();
        for (i = 0; i < this.menuList.length; i++) {
            _menu = this.menuList[i];
            this.contextMenuList.push({
                title: _menu.title,
                showIcon: _menu.showIcon,
                iconType: _menu.iconType,
                clickFunc: this.onContextMenuClick
            });
        }
    },
    mounted() {
        let tree = Util.querySelector("#" + this.treeDomId);
        //添加下拉树鼠标右键事件
        Util.addEventHandler(tree, "mousedown", this.onRightClick);
        //屏蔽浏览器右键菜单事件
        Util.addEventHandler(tree, "contextmenu", this.onContextMenu);
        this.$refs.contextMenuTree.init();
    },
    beforeDestroyed() {
        let tree = Util.querySelector("#" + this.treeDomId);
        //移除下拉树鼠标右键事件
        Util.removeEventHandler(tree, "mousedown", this.onRightClick);
        //移除屏蔽浏览器右键菜单事件
        Util.removeEventHandler(tree, "contextmenu", this.onContextMenu);
    },
    methods: {
        // 获取当前节点数据，并存储到itemData
        getItemData(dom) {
            let i, key;
            let keyList = this.treeOptions.nodeOptions.customData;
            for (i = 0; i < keyList.length; i++) {
                key = keyList[i] + '';
                this.itemData[key] = Util.getDomAttribute(dom, 'data-' + key.toLowerCase());
            }
        },
        //下拉树事件方法
        onRightClick(e) {
            let item, paramId, parentId, paramName, paramKey, paramDescribed, position;
            if (2 === e.button && e.target && e.path) {
                // 右键 显示右键菜单
                item = Util.getDomByTarget(e, 'li', 'c-treeview-li');
                if (item) {
                    position = Util.getDomPosition(item);
                    this.getItemData(item);
                    this.contextMenu = {
                        show: true,
                        left: position.left + e.layerX + 20,
                        top: position.top
                    }
                    e.stopPropagation();
                }
            } else if (2 !== e.button && e.target && e.path) {
                //非右键 隐藏右键菜单
                item = Util.getDomByTarget(e, 'div', 'c-pop-menu');
                !item && this.hideTreeMenu();
            }
        },
        //屏蔽右键方法
        onContextMenu(e) {
            e.returnValue = false;
            return false;
        },
        // 隐藏右键菜单
        hideTreeMenu() {
            this.contextMenu = {
                show: false,
                left: 0,
                top: 0
            }
        },
        //右键菜单点击事件
        onContextMenuClick(title) {
            let func = getMenuClickFuncByTitle(title, this.menuList);
            func(this.itemData);
            this.hideTreeMenu();
        },
        //更新根节点
        updateRootTree() {
            this.$refs.contextMenuTree.tree.isRoot = true;
            this.$refs.contextMenuTree.tree._loadTree(this.treeOptions.rootId, this.treeOptions.action);
        },
        //创建节点
        createTreeNode(nodeData) {
            this.$refs.contextMenuTree.createNode(nodeData);
        },
        //更新指定节点
        updateTreeNode(nodeData) {
            this.$refs.contextMenuTree.updateNode(nodeData);
        },
        //删除节点
        removeTreeNode(nodeId) {
            this.$refs.contextMenuTree.removeNode(nodeId);
        }
    }
}

// 通过菜单名获取菜单点击方法
let getMenuClickFuncByTitle = function(title, menuList) {
    let i, menu;
    for (i = 0; i < menuList.length; i++) {
        menu = menuList[i];
        if (menu.title === title) {
            return menu.clickFunc;
        }
    }
    return null;
}
</script>
