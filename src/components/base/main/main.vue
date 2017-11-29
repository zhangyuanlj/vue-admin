<template>
  <div ref="mainView" id="c-layout" :class="setLayoutClass('c-layout')">
    <div v-if="showHead" id="c-layout-head" class="c-layout-head g-parent-clear">
      <div class="logo" :style="setLogo"></div>
      <div class="menu">
        <Menu mode="horizontal" :theme="headerTheme" @on-select="selectCallback">
          <Menu-item name="home">
            <Icon type="monitor"></Icon>
            工作台
          </Menu-item>
          <!-- <Menu-item name="user">
                          <Dropdown>
                              <div class="user-menu">
                                  <Icon type="android-person"></Icon>
                                  我的信息
                              </div>
                              <DropdownMenu slot="list">
                                  <div class="user-menu-con">
                                      <div class="user-image">
                                          <img :src="userDefaultImg">
                                      </div>
                                      <div class="user-info">
                                          <p>
                                              <span>登录</span>wangzhipeng</p>
                                          <p>
                                              <span>部门</span>驹马研发中心</p>
                                          <p>
                                              <span>所属公司</span>成都分公司</p>
                                      </div>
                                  </div>
                              </DropdownMenu>
                          </Dropdown>
                      </Menu-item> -->
          <Menu-item name="exit">
            <Icon type="power"></Icon>
            退出系统
          </Menu-item>
        </Menu>
      </div>
    </div>
    <div v-if="showLeft" id="c-layout-left" class="c-layout-left">
      <MenuList ref="menuList" :accordion="true" :openSysNames="openSysNames" :openNames="openNames" :activeName="activeName" :selectedCallback="selectedCallback"></MenuList>
    </div>
    <div id="c-layout-right" :class="setLayoutClass('c-layout-right')">
      <!-- <PageTab ref="pageTab"></PageTab> -->
      <router-view></router-view>
    </div>
    <div id="c-go-top" class="c-go-top">
      <div class="arrow">
        <Icon type="android-arrow-up" class="icon"></Icon>
      </div>
      <div class="text">
        <p>返回</p>
        <p>顶部</p>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jQuery";
import Vue from "vue";
import config from "config";
import Helper from "utils/helper.js";
import Route from "utils/route.js";
import userDefaultImg from "./images/user.png";
import logoDefaultImg from "./images/logo.png";
import "./styles/main.style";
const HEAD_HEIGHT = 60;
const LOCAL_DOMAIN = location.origin;
const ENTRY_URL = config.entryUrl ? config.entryUrl : "main.html";
const LOGO = config.logoImage ? config.logoImage : logoDefaultImg;
let userAgent = navigator.userAgent;
export default {
  name: "MainView",
  data() {
    return {
      showHead: true,
      showLeft: true,
      headerTheme: "light",
      menuTheme: "dark",
      userDefaultImg: userDefaultImg,
      layoutHeight: 0,
      pages: [],
      openSysNames: [],
      openNames: [],
      activeName: "",
      full: false,
      closeMenu: false,
      selectedCallback: (key, name, domain, url, params) => {
        if (!url) {
          return false;
        }
        let baseUrl = `${domain}/${url}vueSys/?openMenus=`;
        let href = baseUrl + encodeURI(params);
        if (LOCAL_DOMAIN == domain) {
          Helper.redirect(href);
        } else {
          //兼容旧的管理系统
          href = `${domain}/${url}`;
          window.open(href);
        }
        // this.addTab({
        //   key: key,
        //   name: name,
        //   url: href,
        //   active: false
        // });
      }
    };
  },
  beforeCreate() {
    Vue.prototype.$MainView = this;
  },
  created() {
    this.checkBrowser();
  },
  mounted() {
    let self = this;
    let params = Route.getParameters();
    this.hide();
    if (this.showLeft) {
      if (!this.closeMenu && params && params["openMenus"]) {
        this.openMenus();
      }
    }
    //检测到在手机浏览器运行则显示图标菜单
    if (userAgent.indexOf("Mobile") != -1) {
      this.initMenu(true);
    }
    this.goTop();
  },
  computed: {
    setLogo() {
      return `background-image:url('${LOGO}');`;
    }
  },
  methods: {
    //初始化关闭，需要打开才打开
    initMenu(closeMenu) {
      let params = Route.getParameters();
      this.closeMenu = closeMenu;
      if (this.closeMenu) {
        this.$refs.menuList.hide();
      } else {
        this.$refs.menuList.show();
      }
      this.$refs.menuList.updateRight();
      if (!this.closeMenu && params && params["openMenus"]) {
        this.openMenu();
      }
    },
    //设置整个界面是否全屏显示
    setFullScreen(full) {
      const $screen = $("html, body");
      this.full = full;
      if (this.full) {
        $screen.addClass("g-full-screen");
      } else {
        $screen.removeClass("g-full-screen");
      }
      this.initMenu(full);
    },
    //检测当前状态是否为全屏
    isFullScreen() {
      return this.full;
    },
    openMenus() {
      let params = Route.getParameters();
      if (params != null) {
        let menuList = decodeURI(params.openMenus);
        menuList = menuList.split("-");
        this.openSysNames = [menuList[0]];
        this.openNames = [menuList[1]];
        this.activeName = menuList[2];
      }
    },
    setLayoutClass(styleName) {
      if (this.full) {
        return `${styleName} g-full-screen`;
      }
      return styleName;
    },
    selectCallback(name) {
      let $menu = $("#c-layout-head .ivu-menu-item");
      setTimeout(() => {
        $menu.attr("class", "ivu-menu-item");
      }, 100);
      //跳转到工作台
      if (name == "home") {
        Helper.redirect(config.homeUrl);
      } else if (name == "exit") {
        //退出登录
        this.$Modal.confirm({
          title: "确认对话框",
          content: "您确认要退出系统吗？",
          loading: true,
          onOk: () => {
            setTimeout(() => {
              let loginUrl = config.loginUrl + "?type=logout";
              this.$Modal.remove();
              Helper.redirect(loginUrl);
            }, 3000);
          }
        });
      }
      console.log(name);
    },
    hideHead() {
      let $layout = $("#c-layout");
      let $left = $("#c-layout-left");
      this.showHead = false;
      $layout.css("padding-top", 0);
      $left.css("top", 0);
    },
    hideLeft() {
      let $content = $("#c-layout-right");
      this.showLeft = false;
      $content.css("margin-left", 0);
    },
    //根据浏览器参数和被调用方指定属性隐藏dom
    hide() {
      let params = Route.getParameters();
      if (params !== null) {
        if (params.hide) {
          let $dom = $("*[data-hide='true']");
          let id = $dom.attr("id");
          if (id == "c-layout-head") {
            this.hideHead();
          }
          if (id == "c-layout-left") {
            this.hideLeft();
          }
          $dom.css("visibility", "hidden");
        } else {
          if (params.hideHead) {
            this.hideHead();
          } else if (params.hideLeft) {
            this.hideLeft();
          } else if (params.hideLayout) {
            this.hideHead();
            this.hideLeft();
          } else {
            //hideAdd,hideDelete,hideQuery,hideEdit
            for (let key in params) {
              let name = key.replace("hide", "");
              name = name.toLowerCase();
              $(`*[name='${name}']`).css("visibility", "hidden");
            }
          }
        }
      }
    },
    addTab(item) {
      // this.$refs.pageTab.add(item);
    },
    //浏览器嗅探，如果不是WebKit内核的浏览器就跳转到谷歌浏览器下载页面
    checkBrowser() {
      if (userAgent.indexOf("AppleWebKit") == -1) {
        let downloadUrl = "/main.html#/download/";
        Helper.redirect(downloadUrl);
      }
    },
    goTop() {
      let $win = $(window);
      let $goTop = $("#c-go-top");
      let self = this;
      $win.on("scroll", function() {
        let $this = $(this);
        if ($this.scrollTop() > 0) {
          $goTop.show();
        } else {
          $goTop.hide();
        }
      });
      $goTop.on("click", function() {
        $win.scrollTop(0);
      });
    }
  }
};
</script>