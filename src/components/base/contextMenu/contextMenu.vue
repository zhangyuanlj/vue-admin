<template>
    <div v-show="visible" class="c-context-menu" :style="setStyle">
        <a v-for="(item, index) in menuData" href="javascript:void(0);" :key="index+1" @click.stop="clickMenuCallback(item.key)">
            {{item.name}}
        </a>
    </div>
</template>

<script>
import './styles/contextMenu.style';
export default {
    data() {
        return {
            width: 120,
            left: 0,
            top: 0,
            visible: false
        };
    },
    props: {
        menuData: {
            type: Array,
            default: () => {
                return [];
            }
        },
        clickMenuCallback: {
            type: Function,
            default: (key) => {
                return true;
            }
        }
    },
    name: "ContextMenu",
    mounted() {
        document.addEventListener("click", () => {
            this.hide();
        }, true);
    },
    computed: {
        setStyle() {
            return `width:${this.width}px;left:${this.left}px;top:${this.top}px;`;
        }
    },
    methods: {
        show() {
            this.visible = true;
        },
        hide() {
            this.visible = false;
        },
        setPosition(left, top) {
            this.left = left;
            this.top = top;
        }
    }
}
</script>