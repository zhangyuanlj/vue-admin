<template>
    <div>
        <div v-show="listData.length" class="c-page-tab g-parent-clear">
            <a v-for="(item, index) in listData" v-if="index<maxTabsLen" :key="index+1" href="javascript:void(0);" :class="item.active ? 'current' : ''" :title="item.name" @contextmenu.prevent="contextMenu(index)" @click.stop="selected(index)">
                <span>{{item.name}}</span>
                <strong @click.stop="remove(index)" title="关闭">
                    <Icon type="close-round"></Icon>
                </strong>
            </a>
            <Dropdown v-if="listData.length>maxTabsLen" :width="160" placement="bottom-start" @on-click="selected">
                <a href="javascript:void(0);" class="more">
                    <span>查看更多</span>
                    <Icon type="android-arrow-dropdown"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <div v-for="(item, index) in listData" v-if="index>=maxTabsLen" :key="index+1">
                        <DropdownItem :title="item.name" :name="index" :selected="item.active">
                            <span class="more-item-text">{{item.name}}</span>
                        </DropdownItem>
                    </div>
                </DropdownMenu>
            </Dropdown>
        </div>
        <ContextMenu ref="contextMenu" :menuData="menuData" :clickMenuCallback="clickMenuCallback"></ContextMenu>
    </div>
</template>

<script>
import $ from 'jQuery';
import config from 'config';
import Helper from 'utils/helper.js';
import './styles/pageTab.style';
export default {
    data() {
        return {
            listData: [],
            maxTabsLen: 15,
            menuData: [{
                key: "current",
                name: "关闭标签页"
            }, {
                key: "all",
                name: "关闭全部标签页"
            }, {
                key: "reset",
                name: "关闭其他标签页"
            }],
            clickMenuCallback: (key) => {
                this.contextMenuSelected(key);
            }
        };
    },
    name: "PageTab",
    methods: {
        active(index) {
            this.listData.forEach((item, i) => {
                if (i == index) {
                    item.active = true;
                }
                else {
                    item.active = false;
                }
            });
        },
        inList(item) {
            let len = this.listData.length;
            let isExist = false;
            for (let i = 0; i < len; i++) {
                if(this.listData[i].key == item.key){
                    isExist = true;
                    break;
                }
            }
            return isExist;
        },
        getTabIndex(item){
            let len = this.listData.length;
            let index = 0;
             for (let i = 0; i < len; i++) {
                if(this.listData[i].key == item.key){
                    index = i;
                    break;
                }
            }
            return index;
        },
        add(item) {
            if (this.inList(item)) {
                let activeIndex = this.getTabIndex(item);
                this.active(activeIndex);
                return false;
            }
            this.listData.push(item);
            let index = this.listData.length - 1;
            this.active(index);
        },
        selected(index) {
            let url = this.listData[index].url;
            this.active(index);
            Helper.redirect(url);
        },
        contextMenu(index) {
            // console.log(event);
            if (event.which == 3) {
                let nodeName = event.srcElement.nodeName.toLowerCase();
                let $el = nodeName == "span" || nodeName == "i" ? $(event.srcElement).parent("a") : $(event.srcElement);
                let left = $el.position().left;
                let top = $el.position().top + 40;
                this.$refs.contextMenu.setPosition(left, top);
                this.$refs.contextMenu.show();
                this.deleteIndex = index;
            }
        },
        contextMenuSelected(key) {
            if (key === "current") {
                this.remove(this.deleteIndex);
            }
            else if (key === "all") {
                this.removeAll();
            }
            else if (key === "reset") {
                this.removeReset(this.deleteIndex);
            }
        },
        redirectHome(){
            if(!this.listData.length){
                let baseUrl = config.homeUrl;
                Helper.redirect(baseUrl);
            }
        },
        remove(index) {
            let i = index - 1;
            if (i <= 0) {
                i = 0;
            }
            this.listData.splice(index, 1);
            this.active(i);
            this.redirectHome();
        },
        removeAll() {
            this.listData = [];
            this.redirectHome();
        },
        removeReset(index) {
            this.listData = [this.listData[index]];
        }
    }
}
</script>