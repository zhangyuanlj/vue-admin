<template>
    <div class="c-from-detail">
        <div class="rows g-parent-clear" v-for="(row, i) in data" :key="i+1">
            <div v-if="row.length > 1" class="item" v-for="(item, j) in row" :key="j+1">
                <strong class="label">{{item.label}}：</strong>
                <span class="con">{{item.con}}</span>
            </div>
            <div v-else class="item exclusive">
                <strong class="label">{{row[0].label}}：</strong>
                <span class="con">{{row[0].con}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import "./styles/formDetail.style";
export default {
  name: "FormDetail",
  data() {
    return {};
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  }
};
</script>