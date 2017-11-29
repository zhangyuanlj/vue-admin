<template>
    <div class="c-content-page">
        <div class="title">
            <div class="btn-group g-parent-clear" v-if="btnGroup.length">
                <ButtonGroup>
                  <template v-for="(btn, index) in btnGroup">
                    <Button v-if="index<4" :key="index+1" @click="btn.callback && btn.callback(btn.key, btn.text)" class="btn-item">
                      <Icon v-if="btn.icon" :type="btn.icon"></Icon>
                      {{btn.text}}
                    </Button>
                  </template>
                  <Dropdown v-if="btnGroup.length>4" :transfer="true">
                      <Button>
                        更多
                        <Icon type="ios-more"></Icon>
                      </Button>
                      <DropdownMenu slot="list" class="c-btn-group-list">
                          <template v-for="(btn, index) in btnGroup">
                            <DropdownItem v-if="index>4" :key="index+1">
                              <strong @click="btn.callback && btn.callback(btn.key, btn.text)">
                                <Icon v-if="btn.icon" :type="btn.icon"></Icon>
                                {{btn.text}}
                              </strong>
                            </DropdownItem>
                          </template>
                      </DropdownMenu>
                  </Dropdown>
                </ButtonGroup>
            </div>
            <h3>{{title}}</h3>
        </div>
        <div :class="setContentClass">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
import "./styles/contentPage.style";
export default {
  name: "Content-Page",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: "内容页标题"
    },
    showContentBg: {
      type: Boolean,
      default: true
    },
    btnGroup: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    setContentClass() {
      let styleName = "content";
      if (!this.showContentBg) {
        styleName = `${styleName} content-no-bg`;
      }
      return styleName;
    }
  }
};
</script>