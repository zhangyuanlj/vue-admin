<template>
    <DataTable ref="dataTable" :propsColumns="setColumns" :requestConfig="requestConfig" :showPage="showPage" :sortChangeCallback="sortChangeCallback"></DataTable>
</template>

<script>
import $ from "jQuery";
import "utils/httpRequest.js";
export default {
  name: "SelectTable",
  data() {
    return {
      columns: []
    };
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    propsColumns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    requestConfig: {
      type: Object,
      default: () => {
        return {
          url: "",
          type: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          data: {}
        };
      }
    },
    showPage: {
      type: Boolean,
      default: false
    },
    sortChangeCallback: {
      type: Function,
      default: () => {
        return true;
      }
    },
    selectedCallback: {
      type: Function,
      default: () => {
        return true;
      }
    }
  },
  created() {
    this.columns = this.propsColumns;
  },
  mounted() {
    $("#c-layout-head").on("click", () => {
      console.log(this.$SelectTableCheckbox.multipleSelected());
    });
  },
  computed: {
    setColumns() {
      this.columns[0]["render"] = (h, params) => {
        let self = this;
        let column = params.column;
        let text = params.row[column["key"]];
        let checked = params.row["checked"];
        text = text ? text : "暂无";
        checked = checked ? checked : false;
        return h("div", [
          h(
            "SelectTable-Checkbox",
            {
              props: {
                propsChecked: checked,
                params: params,
                multiple: self.multiple,
                selectedCallback: params => {
                  this.selectedCallback(params);
                }
              }
            },
            text
          )
        ]);
      };
      return this.columns;
    }
  },
  methods: {
    //查找符合条件的数据,filters为查询条件
    query(filters) {
      this.$refs.dataTable.query(filters);
    },
    //取消选中
    cancel() {
      this.$SelectTableCheckbox.cancel();
    }
  }
};
</script>