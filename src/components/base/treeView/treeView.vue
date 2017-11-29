<template>
    <div :id="setId">
    </div>
</template>
<script>
import $ from "jQuery";
import Helper from "utils/helper.js";
import Tree from "./scripts/treeview.js";
import "./styles/treeview.style";
export default {
  name: "TreeView",
  data() {
    return {
      defaults: {
        $parent: $("#treeWrapper"),
        action: "treeview.php?id={id}",
        ajaxType: "GET",
        keyName: {
          id: "id",
          parentId: "parentId",
          name: "name"
        },
        rootId: 0,
        selectNodes: "",
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
    options: {
      type: Object
    }
  },
  computed: {
    setId() {
      this.wrapperId = Helper.setId("treeview-wrapper");
      return this.wrapperId;
    }
  },
  methods: {
    init() {
      $.extend(true, this.defaults, this.options);
      this.defaults.$parent = $("#" + this.wrapperId);
      this.tree = new Tree(this.defaults);
    },
    getId() {
      return this.tree.getId();
    },
    nodeCheckedEvent(nodeData) {
      this.tree.nodeCheckedEvent(nodeData);
    },
    nodeRadioEvent(nodeData) {
      this.tree.nodeRadioEvent(nodeData);
    },
    expandAll() {
      this.tree.expandAll();
    },
    toggle(display) {
      this.tree.toggle(display);
    },
    refreshNode(nodeId, action) {
      this.tree.refreshNode(nodeId, action);
    },
    getSelectNode() {
      return this.tree.getSelectNode();
    },
    getCheckedNodes(hasChild) {
      return this.tree.getCheckedNodes(hasChild);
    },
    createNode(nodeData) {
      return this.tree.createNode(nodeData);
    },
    updateNode(nodeData) {
      return this.tree.updateNode(nodeData);
    },
    removeNode(nodeId) {
      return this.tree.removeNode(nodeId);
    },
    destroy() {
      this.tree.destroy();
    }
  }
};
</script>