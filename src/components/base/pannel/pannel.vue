<template>
    <div class="c-pannel">
        <div v-if="showPannelTitle" class="c-pannel-title g-parent-clear">
            <div class="left">
                <span v-if="showIcon">
                    <Icon :type="iconType" />
                </span>
                <strong>{{pannelTitle}}</strong>
            </div>
            <div class="right" v-if="showToolIcon">
                <span v-for="item in iconList" :key="item.name" @mousedown.stop="callback($event, item.callbackName)" class="icon-item">
                    <Icon :type="item.iconType" />
                    <strong v-if="showToolIconText">{{item.iconText}}</strong>
                </span>
            </div>
        </div>
        <div class="c-pannel-con">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import './styles/pannel.style';
export default {
    name: "Pannel",
    props: {
        showPannelTitle: {
            type: Boolean,
            default: true
        },
        showIcon: {
            type: Boolean,
            default: false
        },
        iconType: {
            type: String,
            default: ""
        },
        pannelTitle: {
            type: String,
            default: "面板标题"
        },
        showToolIcon: {
            type: Boolean,
            default: true
        },
        showToolIconText: {
            type: Boolean,
            default: false
        },
        iconList: {
            type: Array
        },
        stopPropagation: {
            type: Boolean,
            default: false
        },
        clickCallback: {
            type: Object
        }
    },
    methods: {
        callback(event, callbackName) {
            if (this.clickCallback[callbackName]) {
                this.clickCallback[callbackName]();
            }
            event.stopPropagation();
        }
    }
}
</script>
