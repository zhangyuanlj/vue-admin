// 弹窗自定义菜单
<template>
    <!-- 右键菜单 -->
    <div v-show="show" class="c-pop-menu" :style="{left:left+'px', top:top+'px'}">
        <i v-if="arrowPosition === 'leftTop'" class="c-pop-menu-icon-arrow"></i>
        <i v-else-if="arrowPosition === 'leftCenter'" class="c-pop-menu-icon-arrow c-pop-menu-icon-arrow-left-center"></i>
        <i v-else-if="arrowPosition === 'leftBottom'" class="c-pop-menu-icon-arrow c-pop-menu-icon-arrow-left-bottom"></i>
        <i v-else-if="arrowPosition === 'bottomLeft'" class="c-pop-menu-icon-arrow c-pop-menu-icon-arrow-bottom"></i>
        <i v-else-if="arrowPosition === 'bottomCenter'" class="c-pop-menu-icon-arrow c-pop-menu-icon-arrow-bottom c-pop-menu-icon-arrow-bottom-center"></i>
        <i v-else-if="arrowPosition === 'bottomRight'" class="c-pop-menu-icon-arrow c-pop-menu-icon-arrow-bottom c-pop-menu-icon-arrow-bottom-right"></i>
        <i v-else-if="arrowPosition === 'rightTop'" class="c-pop-menu-icon-arrow c-pop-menu-icon-arrow-right"></i>
        <i v-else-if="arrowPosition === 'rightCenter'" class="c-pop-menu-icon-arrow c-pop-menu-icon-arrow-right c-pop-menu-icon-arrow-right-center"></i>
        <i v-else-if="arrowPosition === 'rightBottom'" class="c-pop-menu-icon-arrow c-pop-menu-icon-arrow-right c-pop-menu-icon-arrow-right-bottom"></i>
        <i v-else style="display:none;"></i>
        <ul class="c-pop-menu-list">
            <li v-for="item in list" :key="item.title" @click="item.clickFunc(item.title)" class="c-pop-menu-item">
                <Button type="text"><Icon v-show="item.showIcon" :type="item.iconType"></Icon>  {{item.title}}</Button>
            </li>
        </ul>
    </div>
    <!-- end 右键菜单 -->
</template>
<script>
import './styles/popMenu.style';
export default {
    props: {
        show: {//是否显示
            type: Boolean,
            default: false
        },
        arrowPosition: {//弹出层边框箭头位置
            type: String,
            default: "leftTop"//leftTop|leftCenter|leftBottom|bottomLeft|bottomCenter|bottomRight|rightTop|rightCenter|rightBottom
        },
        left: {//左边位置
            type: [Number, String],
            default: 0
        },
        top: {//顶部位置
            type: [Number, String],
            default: 0
        },
        list: {
            type: Array,
            default: () => {
                return [{
                    title: "示例",//菜单项显示名称
                    showIcon: true,//是否显示图标
                    iconType: "edit",//图标样式名，参照ivueview
                    clickFunc: () => {//菜单项点击事件
                        console.log(this);
                    }
                }];
            }
        }
    }
}
</script>
