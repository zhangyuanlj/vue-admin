<template>
    <div>
        <a v-if="subItemData.children && subItemData.children.length" href="javascript:void(0);" class="child-item-text menu-text" @click.stop="smenuToggle">
            <i :class="setIcon(subItemData.iconCls)"></i>
            <strong>{{subItemData.resourceName}}</strong>
            <span v-show="subItemData.children && subItemData.children.length" :class="setSwitchClass" @click.stop="smenuToggle"></span>
        </a>
        <a v-else :ref="subItemData.resourceId" href="javascript:void(0);" :class="setClass(subItemData.resourceId)" @click.stop="selected(subItemData.resourceId, subItemData.resourceName, subItemData.actionUri)" class="child-item-text menu-text">
            <i :class="subItemData.iconCls ? subItemData.iconCls : ''"></i>
            <strong>{{subItemData.resourceName}}</strong>
            <span></span>
        </a>
        <collapse-transition>
            <div v-show="showSmenu">
                <ul v-if="subItemData.children && subItemData.children.length" class="sub-menu">
                    <li v-for="(smenu, sindex) in subItemData.children" :key="smenu.resourceId">
                        <a :ref="smenu.resourceId" href="javascript:void(0);" :class="setClass(smenu.resourceId)" @click.stop="selected(smenu.resourceId, smenu.resourceName, smenu.actionUri)">
                            <i :class="smenu.iconCls ? smenu.iconCls : ''"></i>
                            <strong>{{smenu.resourceName}}</strong>
                            <span></span>
                        </a>
                    </li>
                </ul>
            </div>
        </collapse-transition>
    </div>
</template>

<script>
import CollapseTransition from "utils/collapseTransition.js";
const on = "c-menu-open";
const off = "c-menu-close";
const styleName = "sub-menu-text menu-text";
const selectedStyleName = "sub-menu-text-selected";
export default {
  components: {
    CollapseTransition
  },
  data() {
    return {
      domain: "",
      showSmenu: false,
      activeName: ""
    };
  },
  props: {
    propsDomain: {
      type: String,
      default: ""
    },
    subItemData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    accordion: {
      type: Boolean,
      default: false
    },
    propsActiveSysName: {
      type: String,
      default: ""
    },
    propsActiveName: {
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
    this.domain = this.propsDomain;
  },
  computed: {
    setSwitchClass() {
      if (this.showSmenu) {
        return on;
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
    show() {
      this.showSmenu = true;
    },
    hide() {
      this.showSmenu = false;
    },
    closeSmenu() {
      let $list = this.$parent.$refs;
      for (let key in $list) {
        $list[key][0].hide();
      }
    },
    smenuToggle() {
      if (this.accordion) {
        this.closeSmenu();
        this.show();
      } else {
        this.showSmenu = !this.showSmenu;
      }
    },
    setClass(name) {
      if (this.activeName == "") {
        this.activeName = this.propsActiveName;
      }
      if (this.activeName == name) {
        return `${styleName} ${selectedStyleName}`;
      }
      return styleName;
    },
    unSelected() {
      let $list = this.$parent.$parent.$children;
      $list.forEach(($menu, cindex) => {
        if ($menu.$children.length) {
          $menu.$children.forEach(($item, cindex) => {
            $item.activeName = "";
          });
        }
      });
    },
    selected(key, name, url) {
      let params = `${this.propsActiveSysName}-${this.subItemData
        .resourceId}-${key}`;
      let domain = this.domain;
      this.unSelected();
      this.activeName = key;
      this.selectedCallback(key, name, domain, url, params);
    }
  }
};
</script>