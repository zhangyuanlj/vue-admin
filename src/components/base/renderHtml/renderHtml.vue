<template>
    <div :class="styleName" v-html="conHtml">
    </div>
</template>

<script>
export default {
    name: "RenderHtml",
    props: {
        styleName: {
            type: String,
            default: ""
        },
        conHtml: {
            type: String,
            default: ""
        }
    }
}
</script>