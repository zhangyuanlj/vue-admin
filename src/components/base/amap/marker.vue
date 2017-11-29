<template>

</template>

<script>
import Helper from 'utils/helper.js';
let clusterDefaultOptions = {
    show: false,
    gridSize: 80,
    minClusterSize: 12
};
export default {
    name: "Amap-Marker",
    methods: {
        init(markersOptions, clusterOptions) {
            this.markers = {};
            clusterDefaultOptions = Helper.deepCopy(clusterDefaultOptions, clusterOptions);
            window.amap.clearMap();
            markersOptions.forEach((ret, index, list) => {
                let marker = new AMap.Marker(ret.options);
                let eventConfig = ret.eventConfig;
                marker.setMap(window.amap);
                marker.off(eventConfig.eventName);
                marker.on(eventConfig.eventName, (e) => {
                    eventConfig.eventCallback && eventConfig.eventCallback(e);
                });
                this.markers[ret.options.extData.id] = marker;
            });
            if (clusterDefaultOptions.show) {
                this.addCluster();
            }
        },
        getMarkersArray() {
            let tmp = [];
            for (let key in this.markers) {
                tmp.push(this.markers[key]);
            }
            return tmp;
        },
        //添加点聚合
        addCluster() {
            let markersArray = this.getMarkersArray();
            if (this.cluster) {
                this
                    .cluster
                    .setMap(null);
            }
            this.cluster = new AMap.MarkerClusterer(window.amap, markersArray, {
                gridSize: clusterDefaultOptions.gridSize,
                minClusterSize: clusterDefaultOptions.minClusterSize
            });
        }
    }
}
</script>
