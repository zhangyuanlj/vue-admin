<template>
    <div :id="setId" :style="setSize">
        <slot></slot>
    </div>
</template>

<script>
import Helper from "utils/helper.js";
import loadScripts from "utils/loadScripts.js";
import "./styles/amap.style";
export default {
  name: "Amap",
  data() {
    return {
      defaults: {
        initConfig: {
          width: "100%",
          height: "100%",
          key: "88849e0bf91150659e86cb0bd0d05e35",
          plugins: [],
          mapLoadCallback: amap => {
            return true;
          },
          loadPluginsCallback: amap => {
            return true;
          }
        },
        AMapConfig: {
          resizeEnable: true,
          zoom: 11
        }
      },
      pluginsLoaded: false
    };
  },
  props: {
    options: {
      type: Object
    }
  },
  computed: {
    setId() {
      this.containerId = Helper.setId("amap-container");
      return this.containerId;
    },
    setSize() {
      let width = this.defaults.initConfig.width;
      let height = this.defaults.initConfig.height;
      width = typeof width == "string" ? width : width + "px";
      height = typeof height == "string" ? height : height + "px";
      return "width:" + width + ";height:" + height;
    }
  },
  methods: {
    init() {
      let amap = null;
      let protocol = location.protocol;
      this.defaults = Helper.deepCopy(this.defaults, this.options);
      this.initConfig = this.defaults.initConfig;
      this.AMapConfig = this.defaults.AMapConfig;
      let mapUrl =
        protocol +
        "//webapi.amap.com/maps?v=1.3&key=" +
        this.initConfig.key +
        "&callback=initMap";
      let initMap = () => {
        if (window.amap) {
          window.amap.destroy();
          window.amap = null;
        }
        window.amap = new AMap.Map(this.containerId, this.AMapConfig);
        this.initConfig.mapLoadCallback(window.amap);
        if (this.initConfig.plugins.length) {
          if (this.pluginsLoaded) {
            this.initConfig.loadPluginsCallback(window.amap);
          } else {
            AMap.plugin(this.initConfig.plugins, () => {
              this.pluginsLoaded = true;
              this.initConfig.loadPluginsCallback(window.amap);
            });
          }
        }
      };
      if (window.initMap) {
        initMap();
      } else {
        window.initMap = initMap;
        loadScripts([mapUrl]);
      }
    }
  }
};
</script>