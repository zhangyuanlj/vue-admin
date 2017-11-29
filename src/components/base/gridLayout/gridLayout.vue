<template>
  <div class="c-grid-layout">
    <div class="rows g-parent-clear" v-for="(row, rIndex) in list" :key="rIndex">
      <div :class="setColClass" v-for="(col, cIndex) in row" :key="cIndex">
        <div class="cols-wrapper">
          <slot :name="col"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import "./styles/gridLayout.style";
  export default {
    name: "Grid-Layout",
    data() {
      return {
        list: []
      };
    },
    props: {
      rowsNum: {
        type: Number,
        default: 0
      },
      colsNum: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.createList();
    },
    computed: {
      setColClass() {
        return `cols cols-${this.colsNum}`;
      }
    },
    methods: {
      createList() {
        for (let i = 0; i < this.rowsNum; i++) {
          let tmp = [];
          for (let j = 0; j < this.colsNum; j++) {
            tmp.push(`${i + 1}-${j + 1}`);
          }
          this.list.push(tmp);
        }
      }
    }
  };
</script>