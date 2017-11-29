<template>
    <div :id="setComponentId" class="c-map-infowin" :style="setStyle">
        <div class="inner">
            <div :class="setClass">
                <span class="close-win g-fr" title="关闭" @click.stop="close">
                    <Icon type="close-round" />
                </span>
                <h4>{{defaults.title}}</h4>
            </div>
            <div class="con" v-html="defaults.content"></div>
        </div>
    </div>
</template>

<script>
import Helper from 'utils/helper.js';
const componentId = "c-map-infowin";
export default {
    data() {
        return {
            show: false,
            defaults: {
                width: 340,
                title: "当前位置相关信息",
                //info,success,warning 标题场景应用
                titleType: "",
                content: "",
                position: [],
                offset: new AMap.Pixel(0, -30),
                closeWhenClickMap: true,
                openCallback: () => {
                    return true;
                },
                closeCallback: () => {
                    return true;
                }
            }
        };
    },
    computed: {
        setStyle() {
            return `width:${this.defaults.width}px;`;
        },
        setClass() {
            const titleClass = "title";
            return `${titleClass} ${this.defaults.titleType}-title`;
        },
        setComponentId() {
            this.componentId = Helper.setId(componentId);
            return this.componentId;
        }
    },
    methods: {
        setOptions(options) {
            this.defaults = Helper.deepCopy(this.defaults, options);
        },
        create() {
            let self = this;
            let outerHTML = this.$el;
            if(this.infoWindow){
                this.close();
            }
            this.infoWindow = new AMap.InfoWindow({
                position: self.defaults.position,
                content: outerHTML,
                offset: self.defaults.offset,
                isCustom: true,
                closeWhenClickMap: self.defaults.closeWhenClickMap
            });
            this.infoWindow.off();
            this.infoWindow.on("open", () => {
                this.defaults.openCallback();
            });
            this.infoWindow.open(window.amap);
        },
        getEl() {
            return document.getElementById(this.componentId);
        },
        getId() {
            return this.componentId;
        },
        close() {
            window
                .amap
                .clearInfoWindow();
            this.defaults.closeCallback();
        }
    }
}
</script>