<template>
    <div>
        <a href="javascript:void(0);" class="p-menu-text menu-text" @click.stop="cmenuToggle(itemData.authKey)">
            <i :class="setIcon(itemData.iconCls)"></i>
            <strong>{{itemData.authName}}</strong>
            <span v-show="itemData" :class="setSwitchClass" @click.stop="cmenuToggle(itemData.authKey)"></span>
        </a>
        <collapse-transition>
            <div v-show="showCmenu">
                <ul v-if="cmenuData.length" class="p-menu-child">
                    <li v-for="(cmenu, cindex) in cmenuData" :key="cmenu.resourceId">
                        <MenuSubItem :ref="cmenu.resourceId" :propsDomain="itemData.systemUrl" :subItemData="cmenu" :accordion="accordion" :propsActiveSysName="itemData.authKey" :propsActiveName="activeName" :selectedCallback="selectedCallback"></MenuSubItem>
                    </li>
                </ul>
            </div>
        </collapse-transition>
    </div>
</template>

<script>
import $ from "jQuery";
import config from "config";
import axios from "axios";
import { customScrollbar } from "../customScrollbar/scripts/customScrollbar.js";
import CollapseTransition from "utils/collapseTransition.js";
import MenuSubItem from "./menuSubItem.vue";
const on = "p-menu-open";
const off = "p-menu-close";
const loading = "p-menu-loading";
export default {
  components: {
    CollapseTransition,
    MenuSubItem
  },
  data() {
    return {
      loaded: false,
      cmenuData: [],
      showCmenu: false
    };
  },
  props: {
    itemData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    accordion: {
      type: Boolean,
      default: false
    },
    openNames: {
      type: Array,
      default: () => {
        return [];
      }
    },
    activeName: {
      type: String,
      default: ""
    },
    selectedCallback: {
      type: Function,
      default: () => {
        return true;
      }
    }
  },
  mounted() {
    const $left = $("#c-layout-left");
    $left.off();
    customScrollbar($left);
  },
  computed: {
    setSwitchClass() {
      if (this.showCmenu) {
        if (!this.loaded) {
          return loading;
        } else {
          return on;
        }
      }
      return off;
    }
  },
  methods: {
    setIcon(icon) {
      if (icon) {
        if (this.showCmenu) {
          return `${icon}-active`;
        } else {
          return icon;
        }
      }
      return "";
    },
    getData(authKey) {
      if (!this.loaded) {
        //系统菜单数据地址
        let requestUrl = `${config.authManagelHost}/resource/${authKey}/menu.html`;
        this.http.getJsonp({
          url: requestUrl,
          succeed: res => {
            this.loaded = true;
            this.cmenuData = res.data;
            if (!this.cmenuData) {
              this.cmenuData = [];
            }
            setTimeout(() => {
              this.openMenu();
            }, 200);
            console.log(res);
          },
          failure: (XMLHttpRequest, textStatus, errorThrown) => {
            console.error("获取菜单数据失败，错误描述：" + textStatus + "！");
          }
        });
      }
    },
    show(authKey) {
      this.showCmenu = true;
      this.getData(authKey);
    },
    hide() {
      this.showCmenu = false;
    },
    closeCmenu() {
      let $list = this.$parent.$refs;
      for (let key in $list) {
        $list[key][0].hide();
      }
    },
    cmenuToggle(authKey) {
      if (this.accordion) {
        this.closeCmenu();
        this.show(authKey);
      } else {
        if (this.showCmenu) {
          this.hide();
        } else {
          this.show(authKey);
        }
      }
    },
    openMenu() {
      this.openNames.forEach((menu, index) => {
        if (this.$refs[menu]) {
          this.$refs[menu][0].show();
        }
      });
    }
  }
};
</script>