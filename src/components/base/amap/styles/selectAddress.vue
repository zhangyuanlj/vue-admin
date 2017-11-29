<template>
  <div style="height:100%;">
    <Amap ref="map" :options="mapOptions">
      <Amap-Marker ref="currentMarker">
      </Amap-Marker>
    </Amap>
    <div class="c-select-address">
      <div class="input-wrapper">
        <Dropdown trigger="custom" :visible="visible" @on-click="selected" style="width:260px">
          <Input v-model="queryAddress" @on-change="queryChange" @on-focus="reset" placeholder="请输入您要检索的地址..." :clearable="true" icon="search"></Input>
          <DropdownMenu slot="list" style="height:270px;overflow-y:auto;">
            <DropdownItem v-for="(item, index) in queryData" :name="index" :key="index" :title="item.name">{{item.name}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="btn-wrapper">
        <Button type="primary" @click.stop="markerQuery">Marker模式</Button>
        <Button @click.stop="reset">重置</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Helper from "utils/helper.js";
import Utils from "./scripts/utils.js";
import loadScripts from "utils/loadScripts.js";
import "./styles/amap.style";
export default {
  name: "Amap-Select-Address-Tool",
  data() {
    return {
      mapOptions: {
        initConfig: {
          plugins: ["AMap.ToolBar", "AMap.Geocoder"],
          mapLoadCallback: amap => {
            this.center = amap.getCenter();
          },
          loadPluginsCallback: amap => {
            let toolBar = new AMap.ToolBar({
              visible: false
            });
            amap.addControl(toolBar);
            toolBar.show();
            if (this.currentMarkerPosition.length) {
              this.addCurrentMarker();
            }
          }
        }
      },
      mode: "input",
      queryAddress: "",
      selectedAddress: "",
      visible: false,
      queryData: [],
      marker: null,
      currentMarker: null,
      positionPicker: null
    };
  },
  props: {
    currentMarkerPosition: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  mounted() {
    this.$refs.map.init();
  },
  methods: {
    queryChange() {
      let queryKey = this.queryAddress;
      if (queryKey != "") {
        let requestUrl =
          "//restapi.amap.com/v3/assistant/inputtips?s=rsv3&key=88849e0bf91150659e86cb0bd0d05e35&callback=jsonp_853581_&platform=JS&logversion=2.0&sdkversion=1.3";
        let requestData = {
          keywords: queryKey
        };
        this.http.request([
          {
            url: requestUrl,
            data: requestData,
            succeed: res => {
              let ret = res;
              ret = ret.substring(res.indexOf("(") + 1, res.length - 1);
              ret = JSON.parse(ret);
              ret = ret.tips;
              this.queryData = ret;
              if (this.queryData.length) {
                this.visible = true;
              } else {
                this.visible = false;
              }
              console.log(ret);
            }
          }
        ]);
      } else {
        this.visible = false;
      }
    },
    addCurrentMarker() {
      let self = this;
      let markersOptions = [];
      this.currentMarkerPosition.forEach((ret, i) => {
        markersOptions.push({
          options: {
            position: ret.position
          },
          eventConfig: {
            eventName: "click",
            eventCallback: e => {
              Utils.getAddress(ret.position, (location, detail) => {
                let detailStr = `<p>当前地点：${detail.name}</p><p>坐标：${detail.location}</p><p>详细地址：${detail.address}</p>`;
                this.$InfoWindow().create({
                  position: ret.position,
                  title: "地址详情",
                  titleType: "info",
                  content: `<div class="detail-info">${detailStr}</div>`,
                  closeWhenClickMap: false,
                  closeCallback: function() {}
                });
                console.log(detail);
              });
            }
          }
        });
        if (!i) {
          amap.setCenter(ret.position);
        }
      });
      this.$refs.currentMarker.init(markersOptions);
    },
    addMarker(location, ret) {
      let detail = `<p>当前地点：${ret.name}</p><p>坐标：${ret.location}</p><p>详细地址：${ret.address}</p>`;
      this.selectedAddress = ret;
      if (this.marker !== null) {
        this.marker.off("click");
        this.marker.setMap(null);
        this.marker = null;
      }
      this.marker = new AMap.Marker({
        position: location
      });
      this.marker.setMap(amap);
      this.marker.on("click", () => {
        this.$InfoWindow().create({
          position: location,
          title: "地址详情",
          titleType: "info",
          content: `<div class="detail-info">${detail}</div>`,
          closeWhenClickMap: false,
          closeCallback: function() {}
        });
      });
      amap.setCenter(location);
      console.log(location);
      console.log(this.getAddress());
    },
    selected(name) {
      this.reset();
      let ret = this.queryData[name];
      if (
        ret.location == "" ||
        (Helper.isArray(ret.location) && !ret.location.length)
      ) {
        Utils.getLocation(ret.address, location => {
          ret.location = location;
          this.selectedAddress = ret;
          this.visible = false;
          this.addMarker(location, ret);
        });
      } else {
        let location = !Helper.isArray(location)
          ? ret.location.split(",")
          : location;
        this.selectedAddress = ret;
        this.visible = false;
        this.addMarker(location, ret);
      }
    },
    markerQuery() {
      this.reset();
      this.visible = false;
      this.mode = "markerQuery";
      amap.on("click", e => {
        if (this.mode == "markerQuery") {
          let location = [e.lnglat.getLng(), e.lnglat.getLat()];
          Utils.getAddress(location, (location, detail) => {
            this.addMarker(location, detail);
            console.log(detail);
          });
        }
      });
    },
    reset() {
      let location = [this.center.lng, this.center.lat];
      console.log(this.getAddress());
      this.queryAddress = "";
      this.selectedAddress = "";
      this.visible = false;
      this.mode = "input";
      if (this.marker !== null) {
        this.marker.off("click");
        this.marker.setMap(null);
        this.marker = null;
      }
      this.$InfoWindow().close();
      amap.setCenter(location);
      console.log(location);
    },
    getAddress() {
      let location = this.selectedAddress.location;
      if (location && !Helper.isArray(location)) {
        this.selectedAddress.location = location.split(",");
      }
      return this.selectedAddress;
    }
  }
};
</script>