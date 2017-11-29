<template>
  <Dropdown :id="setId" :placement="placement">
    <Input v-model="names" :placeholder="placeholder" :style="setWidth" readonly="readonly">
    </Input>
    <Dropdown-menu slot="list">
      <TreeView ref="treeView" :options="treeOptions" class="c-combotree-menu" :style="setWidth"></TreeView>
      <input :name="inputName" type="hidden" v-model="values">
    </Dropdown-menu>
  </Dropdown>
</template>

<script>
import $ from "jQuery";
import Helper from "utils/helper.js";
const TOP_POS = "top-start";
const BOTTOM_POS = "bottom-start";
export default {
  name: "ComboTree",
  data() {
    return {
      names: "",
      values: "",
      comboTreeId: "",
      placement: BOTTOM_POS,
      treeOptions: {
        keyName: {
          id: "id",
          parentId: "parentId",
          name: "name"
        },
        action: "asyncData/treeview.php?id={id}",
        ajaxType: "GET",
        showTop: false,
        nodeOptions: {
          showNodeLevelName: false,
          hasRadio: false,
          hasCheckBox: false,
          customData: [],
          saveKeyName: "id"
        },
        expandAll: false,
        loadingCallback: function() {
          return true;
        },
        successCallback: function() {
          return true;
        },
        expandCallback: function() {
          return true;
        },
        nodeCallback: function(nodeValue) {
          return true;
        },
        checkedCallback: function(eventName) {
          return true;
        }
      }
    };
  },
  props: {
    propsNames: {
      type: String
    },
    propsValues: {
      type: String
    },
    placeholder: {
      type: String,
      default: "请选择..."
    },
    width: {
      type: Number,
      default: 240
    },
    inputName: {
      type: String,
      default: "selectedValue"
    },
    propsTreeOptions: {
      type: Object
    }
  },
  computed: {
    setId() {
      this.comboTreeId = Helper.setId("combo-tree");
      return this.comboTreeId;
    },
    setWidth() {
      return "width:" + this.width + "px;";
    }
  },
  created() {
    this.names = this.propsNames;
    this.values = this.propsValues;
  },
  methods: {
    init(values) {
      $.extend(this.treeOptions, this.propsTreeOptions);
      this.getTreeOptions(values);
      this.$treeView = this.$refs.treeView;
      this.$treeView.init();
      this.setPosition();
    },
    //重新设置树的配置项
    getTreeOptions(values) {
      let nodeCallback = this.treeOptions.nodeCallback;
      let successCallback = this.treeOptions.successCallback;
      this.treeOptions["selectNodes"] = values;
      this.treeOptions.nodeCallback = nodeData => {
        if (this.treeOptions.nodeOptions.hasRadio) {
          this.$treeView.nodeRadioEvent(nodeData);
        } else if (this.treeOptions.nodeOptions.hasCheckBox) {
          this.$treeView.nodeCheckedEvent(nodeData);
        }
        this.showValue();
        this.$emit("on-visible-change");
        nodeCallback(nodeData);
      };
      this.treeOptions.checkedCallback = eventName => {
        this.showValue();
      };
      if (this.treeOptions.nodeOptions.showNodeLevelName) {
        this.treeOptions.successCallback = () => {
          this.showValue();
          successCallback();
        };
      }
    },
    getSelectNodes: function() {
      let checkedNodes = this.$treeView.getCheckedNodes(true);
      let nodeOptions = this.treeOptions.nodeOptions;
      let nodesText = [];
      let nodesId = [];
      let len = checkedNodes.length;
      for (let i = 0; i < len; i++) {
        nodesText.push(checkedNodes[i].name);
        nodesId.push(
          checkedNodes[i][
            nodeOptions.customData.length ? nodeOptions.customData[0] : "id"
          ]
        );
      }
      return {
        nodesText: nodesText.join(","),
        nodesId: nodesId.join(",")
      };
    },
    setPosition() {
      let $win = $(window);
      let $dropdown = $("#" + this.comboTreeId);
      let $rel = $dropdown.find(".ivu-dropdown-rel");
      let $select = $dropdown.find(".ivu-select-dropdown");
      let updatePos = () => {
        let winH = $win.height();
        let relH = $rel.height();
        let selectH = $select.height();
        if (winH - $rel.offset().top - relH < selectH) {
          this.placement = TOP_POS;
        } else {
          this.placement = BOTTOM_POS;
        }
      };
      updatePos();
      $win.resize(() => {
        updatePos();
      });
    },
    showValue() {
      let checkedNodes = this.getSelectNodes();
      this.names = checkedNodes.nodesText;
      this.values = checkedNodes.nodesId;
    },
    getValue() {
      let self = this;
      return {
        names: self.names,
        values: self.values
      };
    },
    validation(mess) {
      if (this.values == "") {
        this.$Message.error(mess);
        return false;
      }
      return true;
    }
  }
};
</script>