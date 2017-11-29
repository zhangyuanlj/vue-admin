<template>
  <div class="icon-item" :data-authKey="itemData.authKey">
    <a href="javascript:void(0);" class="icon-wrapper" :title="itemData.authName">
      <i :class="setIcon(itemData.iconCls)"></i>
    </a>
    <div class="pop-menu">
        <div v-if="!this.loaded" class="pop-menu-loading">加载中...</div>
        <ul v-if="cmenuData.length" class="p-menu-child">
          <li v-for="(cmenu, cindex) in cmenuData" :key="cmenu.resourceId">
            <MenuSubItem :ref="cmenu.resourceId" :propsDomain="itemData.systemUrl" :subItemData="cmenu" :accordion="accordion" :propsActiveSysName="itemData.authKey" :propsActiveName="activeName" :selectedCallback="selectedCallback"></MenuSubItem>
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
import $ from "jQuery";
import config from "config";
import axios from "axios";
import MenuSubItem from "./menuSubItem.vue";
import { destroyScrollbar } from "../customScrollbar/scripts/customScrollbar.js";
const on = "p-menu-open";
const off = "p-menu-close";
const loading = "p-menu-loading";
export default {
  components: {
    MenuSubItem
  },
  data() {
    return {
      loaded: false,
      cmenuData: [],
      showTimer: null
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
    propsActiveSysName: {
      type: String,
      default: ""
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
    this.contentScroll();
    this.registerEvent();
  },
  methods: {
    setIcon(icon) {
      if (icon) {
        return `icon ${icon}-big`;
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
            }, 100);
            console.log(res);
          },
          failure: (XMLHttpRequest, textStatus, errorThrown) => {
            console.error("获取菜单数据失败，错误描述：" + textStatus + "！");
          }
        });
      }
    },
    show($item, authKey) {
      const $left = $("#c-layout-left");
      const $popMenu = $(".pop-menu");
      const menuH = 270;
      const $activePopMenu = $item.find(".pop-menu");
      let winH = $(window).height();
      let top = $activePopMenu.position().top;
      $activePopMenu.removeAttr("style");
      if (winH - top <= 270) {
        $activePopMenu.css("bottom", 0);
      } else {
        $activePopMenu.css("top", 0);
      }
      $popMenu.hide();
      $activePopMenu.show();
      this.getData(authKey);
      destroyScrollbar($left);
    },
    hide() {
      const $popMenu = $(".pop-menu");
      $popMenu.hide();
    },
    openMenu() {
      this.openNames.forEach((menu, index) => {
        if (this.$refs[menu]) {
          this.$refs[menu][0].show();
        }
      });
    },
    contentScroll() {
      const $left = $("#c-layout-left");
      const $el = $(this.$el);
      const $popMenu = $el.children(".pop-menu");
      const $scrollArea = $("#scrollArea");
      const scrollCallback = function(event, delta) {
        let startTop = parseFloat($scrollArea.css("margin-top"));
        let endTop = $scrollArea.height() - $left.height() + 40;
        let dir = delta > 0 ? "Up" : "Down",
          vel = delta;
        startTop += vel * 10;
        if (endTop <= 0) {
          startTop = 0;
        } else {
          if (dir == "Up") {
            if (startTop >= 0) {
              startTop = 0;
            }
          } else if (dir == "Down") {
            if (startTop <= 0 - endTop) {
              startTop = 0 - endTop;
            }
          }
        }
        $scrollArea.css("margin-top", `${startTop}px`);
        return false;
      };
      $left.off().on("mousewheel", function(event, delta) {
        return scrollCallback(event, delta);
      });
      $popMenu.off().on("mousewheel", function(event, delta) {
        event.stopPropagation();
      });
    },
    registerEvent() {
      let self = this;
      $(this.$el)
        .off()
        .on({
          mouseover: function(e) {
            let $this = $(this);
            let authKey = $(this).attr("data-authKey");
            self.show($this, authKey);
            e.stopPropagation();
          },
          mouseout: function(e) {
            self.hide();
            e.stopPropagation();
          }
        });
    }
  }
};
</script>