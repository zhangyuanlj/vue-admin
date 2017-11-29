<template>
    <div class="c-spin" v-if="spinShow">
        <div class="c-spin-bg"></div>
        <Spin :fix="true">
            <div class="c-spin-wrapper">
                <div class="spinner">
                    <div class="double-bounce1"></div>
                    <div class="double-bounce2"></div>
                </div>
                <div v-if="showSpinText" class="c-spin-text">{{spinText}}</div>
            </div>
        </Spin>
    </div>
</template>

<script>
import './styles/spin.style';
export default {
    name: "SpinLoading",
    data() {
        return {};
    },
    props: {
        spinShow: {
            type: Boolean,
            default: false
        },
        showSpinText: {
            type: Boolean,
            default: true
        },
        spinText: {
            type: String,
            default: "加载中..."
        }
    }
}
</script>