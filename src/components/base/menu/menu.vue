<template>
    <div>
        <ul v-if="!closeMenu" class="c-menu">
            <li v-for="(pmenu, pindex) in menuListData" :key="pmenu.name">
                <MenuListItem :ref="pmenu.authKey" :itemData="pmenu" :openNames="openNames" :activeName="activeName" :accordion="accordion" :selectedCallback="selectedCallback"></MenuListItem>
            </li>
        </ul>
        <ul v-if="closeMenu" id="scrollArea" class="c-icon-menu">
            <li v-for="(pmenu, pindex) in menuListData" :key="pmenu.name">
                <IconMenuListItem :ref="pmenu.authKey" :itemData="pmenu" :openNames="openNames" :activeName="activeName" :accordion="accordion" :selectedCallback="selectedCallback"></IconMenuListItem>
            </li>
        </ul>
        <div class="c-menu-switch" :style="setLeft()">
            <a href="javascript:void(0);" :title="this.closeMenu ? '打开菜单' : '关闭菜单'" :class="this.closeMenu ? 'open' : ''" @click.stop="toggleMenu()"></a>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import $ from "jQuery";
import config from "config";
import Route from "utils/route.js";
import axios from "axios";
import MenuListItem from "./menuItem.vue";
import IconMenuListItem from "./iconMenuItem.vue";
import "utils/httpRequest.js";
import "./styles/menu.style";
export default {
  name: "MenuList",
  components: {
    MenuListItem,
    IconMenuListItem
  },
  data() {
    return {
      menuListData: [],
      closeMenu: false
    };
  },
  props: {
    accordion: {
      type: Boolean,
      default: false
    },
    openSysNames: {
      type: Array,
      default: () => {
        return [];
      }
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
  created() {
    this.getData();
  },
  updated() {
    if (!this.closeMenu) {
      this.openMenu();
    }
  },
  methods: {
    getData() {
      //该用户拥有的所有菜单
      const requestUrl = `${config.authManagelHost}/home/loadLoginEmployeeSystemAuths.html`;
      this.http.getJsonp({
        url: requestUrl,
        succeed: res => {
          let params = Route.getParameters();
          this.menuListData = res.data.systemAuths;
          this.$nextTick(() => {
            if (!this.closeMenu && params && params["openMenus"]) {
              this.openMenu();
            }
            this.updateRight();
          });
        },
        failure: (XMLHttpRequest, textStatus, errorThrown) => {
          console.error("获取菜单数据失败，错误描述：" + textStatus + "！");
        }
      });
    },
    openMenu() {
      this.openSysNames.forEach((pmenu, pindex) => {
        let $sysMenu = this.$refs[pmenu][0];
        if ($sysMenu) {
          $sysMenu.show(pmenu);
        }
      });
    },
    setLeft() {
      if (!this.closeMenu) {
        return `left:0;`;
      }
      return `left:-193px;`;
    },
    updateRight() {
      const $left = $("#c-layout-left");
      const $right = $("#c-layout-right");
      let params = Route.getParameters();
      if (params && (params["hideLeft"] || params["hideLayout"])) {
        $left.css("width", 0);
        $right.css("margin-left", 0);
      } else {
        if (this.closeMenu) {
          $left.css("width", "47px");
          $right.css("margin-left", "47px");
        } else {
          $left.css("width", "240px");
          $right.css("margin-left", "240px");
        }
      }
    },
    show() {
      this.closeMenu = false;
    },
    hide() {
      this.closeMenu = true;
    },
    toggleMenu() {
      let params = Route.getParameters();
      this.closeMenu = !this.closeMenu;
      this.updateRight();
      if (!this.closeMenu && params && params["openMenus"]) {
        this.$MainView.openMenus();
      }
    }
  }
};
</script>