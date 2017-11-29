<template>

</template>

<script>
export default {
    name: "Amap-RoutePlanne",
    methods: {
        init(pointsData) {
            if (!AMap.Driving) {
                console.error("使用路径规划时，请保证'AMap.Driving'插件已经加载！");
                return false;
            }
            this.pointsData = pointsData;
            let mid = this.pointsData.mid;
            let startPoints = this.pointsData.startPoints;
            let endPoints = this.pointsData.endPoints;
            var driving = new AMap.Driving({
                map: window.amap
            });
            if (!mid) {
                driving.search(new AMap.LngLat(startPoints.lng, startPoints.lat), new AMap.LngLat(endPoints.lng, endPoints.lat));
            } else {
                driving.search(new AMap.LngLat(startPoints.lng, startPoints.lat), new AMap.LngLat(endPoints.lng, endPoints.lat), {
                    waypoints: mid
                });
            }
        }
    }
}
</script>