<template>
    <div class="c-iframe-page">
        <iframe class="c-peference" :width="width" :height="height" :src="setIframeUrl()" frameborder="0" :scrolling="scrolling" allowtransparency="true">
        </iframe>
    </div>
</template>

<script>
import Helper from "utils/helper.js";
import "./styles/peference.style";
export default {
  name: "Reference",
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300"
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
      iframeUrl: "",
      urlParameters: null
    };
  },
  created() {
    this.iframeUrl = this.src;
    this.urlParameters = this.postData;
  },
  mounted() {
    this.relatedEvents();
  },
  methods: {
    //根据传入的地址和参数重新生成地址
    setIframeUrl() {
      let url = this.iframeUrl;
      if (this.urlParameters !== null) {
        let urlParameters = this.urlParameters;
        let paramArr = [];
        for (let key in this.urlParameters) {
          if (urlParameters[key] == "") {
            paramArr.push(key);
          } else {
            paramArr.push(key + "=" + urlParameters[key]);
          }
        }
        url += "?" + paramArr.join("&");
      }
      return Helper.addTimeStamp(url);
    },
    //重置iframe地址
    resetUrl(url, postData) {
      this.iframeUrl = "#";
      setTimeout(() => {
        this.iframeUrl = url;
        this.urlParameters = postData;
      }, 100);
    },
    relatedEvents() {
      let self = this;
      window.addEventListener(
        "message",
        function(e) {
          let eventName = e.data;
          self.eventsCallback &&
            typeof self.eventsCallback[eventName] == "function" &&
            self.eventsCallback[eventName]();
        },
        false
      );
    }
  }
};
</script>