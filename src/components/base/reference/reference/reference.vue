<template>
    <iframe class="c-peference" :width="width" :height="height" :src="setIframeUrl()" frameborder="0" :scrolling="scrolling" allowtransparency="true">
    </iframe>
</template>

<script>
import './styles/peference.style';
export default {
    name: "Reference",
    props: {
        width: {
            type: String,
            default: "100%"
        },
        height: {
            type: String,
            default: "100%"
        },
        src: {
            type: String,
            default: ""
        },
        postData: {
            type: Object,
            default: () => {
                return null;
            }
        },
        scrolling: {
            type: String,
            default: "true"
        },
        eventsCallback: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            iframeUrl: ""
        };
    },
    created() {
        this.iframeUrl = this.src;
    },
    mounted() {
        this.relatedEvents();
    },
    methods: {
        //根据传入的地址和参数重新生成地址
        setIframeUrl() {
            let url = this.iframeUrl;
            console.log(this.src)
            console.log(url)
            if (this.postData !== null) {
                var paramArr = [];
                for (let key in this.postData) {
                    paramArr.push(key + "=" + encodeURI(this.postData[key]));
                }
                url += "?" + paramArr.join("&");
            }
            return url;

        },
        relatedEvents() {
            let self = this;
            window.addEventListener('message', function(e) {
                console.log(e)
                let eventName = e.data;
                self.eventsCallback[eventName] && typeof (self.eventsCallback[eventName]) == "function" && self.eventsCallback[eventName]();
            }, false);
        }
    }
}
</script>