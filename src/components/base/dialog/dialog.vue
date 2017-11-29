<template>
    <Modal v-model="show" :width="width" scrollable="scrollable" :mask-closable="maskClosable" :closable="false">
        <p slot="header">
            {{title}}
        </p>
        <slot></slot>
        <div slot="footer">
            <!-- v-for 必须包含:key="" -->
            <Button v-for="btn in btns" :type="btn.type" :key="btn.text" @click="btn.click">{{btn.text}}</Button>
        </div>
    </Modal>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        width: {
            type: Number,
            default: 500
        },
        maskClosable:{
            type:Boolean,
            default:false
        },
        scrollable: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: ""
        },
        btns: {
            type: Array,
            default: () => {
                return []
            }
        }
    }
}
</script>