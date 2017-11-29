<template>
  <BasicTable ref="basicTable" :propsColumns="propsColumns" :pageTotal="dataTotal" :propsPageSize="pageSize" :showCheckBox="showCheckBox" :propsSpinShow="loading" :data="data" :border="border" :showPage="showPage" :changePageCallback="changePageCallback" :changePageSizeCallback="changePageSizeCallback"
    :sortChangeCallback="sortChangeCallback" :selectionCallback="selectionCallback">
  </BasicTable>
</template>

<script>
export default {
  name: "DataTable",
  data() {
    return {
      loading: false,
      data: [],
      dataTotal: 0,
      pageNo: 1,
      pageSize: 15,
      requestData: {},
      filters: null,
      changePageCallback: pageNum => {
        this.pageNo = pageNum;
        this.getData();
      },
      changePageSizeCallback: pageSize => {
        this.pageNo = 1;
        this.pageSize = pageSize;
        this.getData();
      }
    };
  },
  props: {
    propsColumns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    showCheckBox: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
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
          listFieldName: listFieldName,
          data: null
        };
      }
    },
    propsPageSize: {
      type: Number,
      default: 0
    },
    showPage: {
      type: Boolean,
      default: true
    },
    selectionCallback: {
      type: Function,
      default: () => {
        return true;
      }
    },
    sortChangeCallback: {
      type: Function,
      default: () => {
        return true;
      }
    }
  },
  created() {
    if (this.showPage) {
      this.setPageSize();
    }
    this.getData();
  },
  methods: {
    setPageSize() {
      if (this.propsPageSize) {
        this.pageSize = this.propsPageSize;
      }
    },
    setRequestData() {
      this.requestData =
        this.requestConfig.data !== null ? this.requestConfig.data : {};
      if (this.showPage) {
        this.requestData["pageNo"] = this.pageNo;
        this.requestData["pageSize"] = this.pageSize;
      }
      if (this.filters !== null) {
        this.requestData["filters"] = this.requestData["filters"]
          ? this.requestData["filters"]
          : {};
        for (let key in this.filters) {
          this.requestData["filters"][key] = this.filters[key];
        }
      }
    },
    getData() {
      let self = this;
      let requestUrl = this.requestConfig.url;
      let listFieldName = this.requestConfig.listFieldName;
      this.loading = true;
      this.setRequestData();
      this.http.request([
        {
          url: requestUrl,
          type: self.requestConfig.type,
          data: self.requestData,
          headers: self.requestConfig.headers,
          succeed: res => {
            try {
              let data = res.data;
              this.loading = false;
              this.dataTotal = data.total;
              this.data = listFieldName ? data[listFieldName] : data;
            } catch (err) {
              this.dataTotal = 0;
              this.data = [];
              console.log(err);
            }
          }
        }
      ]);
    },
    //查找符合条件的数据,filters为查询条件
    query(filters) {
      if (this.showPage) {
        this.pageNo = 1;
        this.$refs.basicTable.setPageNo(this.pageNo);
      }
      this.filters = filters;
      this.getData();
    }
  }
};
</script>
