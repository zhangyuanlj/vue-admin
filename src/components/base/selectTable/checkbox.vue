<template>
    <div @click="selected()" ref="selectTableCheckbox" class="c-select-table-checkbox">
        <Icon :type="setType"></Icon>
        <span>
            <slot></slot>
        </span>
    </div>
</template>

<script>
import Vue from "vue";
import "./styles/selectTable.style";
export default {
  name: "SelectTableCheckbox",
  data() {
    return {
      checked: false
    };
  },
  props: {
    propsChecked: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {
        return {};
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    selectedCallback: {
      type: Function,
      default: params => {
        return true;
      }
    }
  },
  created() {
    this.checked = this.propsChecked;
    Vue.prototype.$SelectTableCheckbox = this;
  },
  computed: {
    setType() {
      if (this.checked) {
        return "ios-checkmark";
      } else {
        return "ios-checkmark-outline";
      }
    }
  },
  methods: {
    unSelected() {
      this.checked = false;
    },
    isSelected() {
      return this.checked;
    },
    getParams() {
      return this.params;
    },
    setSelected() {
      let $list = this.$parent.$parent.$parent.$children;
      $list.forEach(item => {
        let $checkbox = item.$children[0].$children[0];
        $checkbox.unSelected();
      });
    },
    selected() {
      if (!this.multiple) {
        this.setSelected();
        this.checked = true;
      } else {
        this.checked = !this.checked;
      }
      this.selectedCallback(this.params);
    },
    multipleSelected() {
      let $list = this.$parent.$parent.$parent.$children;
      let selectedItem = [];
      $list.forEach(item => {
        let $checkbox = item.$children[0].$children[0];
        if ($checkbox.isSelected()) {
          selectedItem.push(this.getParams());
        }
      });
      return selectedItem;
    },
    cancel() {
      this.setSelected();
    }
  }
};
</script>