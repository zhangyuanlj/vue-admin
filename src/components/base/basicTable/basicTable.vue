<template>
    <div class="c-basic-table g-parent-clear">
        <Table :loading="spinShow" :width="width" :height="height" :columns="columns" :data="data" :border="border" :size="size" @on-selection-change="selectionList" @on-sort-change="sortChangeCallback"></Table>
        <div class="page-container g-parent-clear" v-if="showPage">
            <div class="page-total">共{{pageTotal}}条数据,每页{{pageSize}}条数据</div>
            <div class="page-wrapper">
                <Page :total="pageTotal" :current="currentPage" :page-size="pageSize" :show-sizer="showSizer" @on-change="changePage" @on-page-size-change="changePageSize"></Page>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import $ from "jQuery";
import Helper from "utils/helper.js";
import "./styles/basicTable.style";
const MAX_SCREEN_WIDTH = 1366;
const SELECTION_WIDTH = 60;
const DEFAULT_COL_WIDTH = 120;
export default {
  name: "BasicTable",
  data() {
    return {
      showWidth: 0,
      tableWidth: 0,
      columns: [],
      selectionRows: [],
      currentPage: 1,
      pageSize: 10,
      spinShow: false
    };
  },
  props: {
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    propsColumns: {
      type: Array
    },
    data: {
      type: Array
    },
    border: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    },
    showPage: {
      type: Boolean,
      default: false
    },
    pageTotal: {
      type: Number,
      default: 100
    },
    showSizer: {
      type: Boolean,
      default: true
    },
    propsPageSize: {
      type: Number,
      default: 10
    },
    showCheckBox: {
      type: Boolean,
      default: false
    },
    multiSelected: {
      type: Boolean,
      default: true
    },
    propsSpinShow: {
      type: Boolean,
      default: false
    },
    changePageCallback: {
      type: Function,
      default: pageNum => {
        return true;
      }
    },
    changePageSizeCallback: {
      type: Function,
      default: pageSize => {
        return true;
      }
    },
    sortChangeCallback: {
      type: Function,
      default: params => {
        return true;
      }
    },
    selectionCallback: {
      type: Function,
      default: selection => {
        return true;
      }
    }
  },
  mounted() {
    this.$win = $(window);
    this.columns = this.propsColumns;
    this.spinShow = this.propsSpinShow;
    this.pageSize = this.propsPageSize;
    this.setColumns();
    //窗口尺寸调整时、同时更新表格的尺寸
    $(window).resize(() => {
      this.setColumns();
    });
  },
  updated() {
    this.spinShow = this.propsSpinShow;
  },
  methods: {
    setColumns() {
      const checkboxType = "selection";
      //显示复选框
      if (this.showCheckBox) {
        let tmp = [
          {
            type: checkboxType,
            key: checkboxType,
            width: SELECTION_WIDTH,
            align: "center",
            fixed: "left"
          }
        ];
        if (this.columns[0].key != checkboxType) {
          this.columns = tmp.concat(this.columns);
        } else {
          this.$set(this.columns, 0, tmp[0]);
        }
      }
      this.getWidth();
      if (this.tableWidth > this.showWidth) {
        this.columns.forEach((item, index) => {
          if (item["type"] != "selection") {
            if (item["width"]) {
              item["width"] = item["width"];
            } else if (item["layoutWeight"]) {
              item["width"] = item["layoutWeight"] * DEFAULT_COL_WIDTH;
            } else {
              item["width"] = DEFAULT_COL_WIDTH;
            }
          }
          if (item["key"] == "operation") {
            item["fixed"] = "right";
          }
          this.$set(this.columns, index, item);
        });
      } else {
        this.columns.forEach((item, index) => {
          if (item["fixed"]) {
            delete item["fixed"];
          }
          if (item["width"]) {
            if (item["key"] != "operation" && item["key"] != "selection") {
              delete item["width"];
            }
          }
          this.$set(this.columns, index, item);
        });
      }
    },
    getWinWidth() {
      return $(window).width();
    },
    getContainerWidth() {
      return $(".c-basic-table").width();
    },
    //获取实际显示区域以及除去复选框组、操作按钮组之外的实际表格的宽度
    getWidth() {
      let containerWidth = this.getContainerWidth();
      this.showWidth = containerWidth;
      this.tableWidth = 0;
      this.columns.forEach((item, index) => {
        if (item["key"] == "selection") {
          this.showWidth -= SELECTION_WIDTH;
        } else if (item["key"] == "operation") {
          if (item["width"]) {
            this.showWidth -= item["width"];
          } else if (item["layoutWeight"]) {
            this.showWidth -= item["layoutWeight"] * DEFAULT_COL_WIDTH;
          } else {
            this.showWidth -= DEFAULT_COL_WIDTH;
          }
        } else {
          if (item["width"]) {
            this.tableWidth += item["width"];
          } else if (item["layoutWeight"]) {
            this.tableWidth += item["layoutWeight"] * DEFAULT_COL_WIDTH;
          } else {
            this.tableWidth += DEFAULT_COL_WIDTH;
          }
        }
      });
    },
    setPageNo(pageNum) {
      this.currentPage = pageNum;
    },
    changePage(pageNum) {
      if (this.showCheckBox) {
        this.selectionRows = [];
      }
      this.spinShow = true;
      this.setPageNo(pageNum);
      this.changePageCallback(pageNum);
    },
    changePageSize(pageSize) {
      this.spinShow = true;
      this.pageSize = pageSize;
      this.changePageSizeCallback(pageSize);
    },
    selectionList(selection) {
      if (this.showCheckBox) {
        this.selectionRows = selection;
        this.selectionCallback();
      }
    }
  }
};
</script>