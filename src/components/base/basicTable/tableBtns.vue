<template>
    <div class="c-table-btn">
        <span v-for="(item, i) in list" :key="i">
            <Dropdown v-if="item.children" :class="setClass(i)" :transfer="true">
                <a href="javascript:void(0)">
                    {{item.name}}
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list" class="c-table-btn-item">
                    <DropdownItem v-for="(children, j) in item.children" :name="j" :key="j" :disabled="item.disable || children.disable ? true : false">
                        <strong class="dropdown-item" @click="clickCallback(children.callback, children.disable)">{{children.name}}</strong>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <a href="javascript:void(0);" v-else :class="setClass(i)" @click="clickCallback(item.callback, item.disable)">{{item.name}}</a>
            <i class="split-line" v-if="i!=list.length-1"></i>
        </span>
    </div>
</template>

<script>
export default {
  name: "TableBtns",
  data() {
    return {};
  },
  props: {
    params: {
      type: Object,
      default: () => {
        return {};
      }
    },
    list: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods: {
    setClass(index) {
      let styleName = "item";
      let itemStyleName = styleName;
      let len = this.list.length;
      if (index == len - 1) {
        itemStyleName = `${styleName} ${styleName}-last`;
      }
      if (this.list[index].disable) {
        itemStyleName += ` ${styleName}-disable`;
      }
      return itemStyleName;
    },
    clickCallback(callback, disable) {
      !disable && callback && callback(this.params);
    }
  }
};
</script>
