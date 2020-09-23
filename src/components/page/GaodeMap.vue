<template>
    <!-- 高德地图 -->
    <div class="amap-page-container">
        <el-amap-search-box
            class="search-box"
            :search-option="searchOption"
            :on-search-result="onSearchResult"
        ></el-amap-search-box>
        <el-amap vid="amapDemo" :center="mapCenter" :zoom="12" :events="events" class="amap-demo">
            <el-amap-marker v-for="marker in markers" :position="marker" :key="marker.index"></el-amap-marker>
        </el-amap>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 高德地图
            longitudeAndlatitude: 0, // 高德地图经纬度
            // amaplon: 0,
            // amaplat: 0,
            AMapAddress: '', // 高德地图定位位置
            center: [116.404, 39.915],
            lng: 0,
            lat: 0,
            loaded: false,
            plugin: [
                {
                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    timeout: 100, //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0, //定位结果缓存0毫秒，默认：0
                    convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true, //显示定位按钮，默认：true
                    buttonPosition: 'RB', //定位按钮停靠位置，默认：'LB'，左下角
                    showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
                    extensions: 'all',
                    pName: 'Geolocation',
                    events: {
                        init(o) {
                            // o 是高德地图定位插件实例
                            o.getCurrentPosition((status, result) => {
                                console.log(result);
                                if (result && result.position) {
                                    self.lng = result.position.lng;
                                    self.lat = result.position.lat;
                                    self.center = [self.lng, self.lat];
                                    self.loaded = true;
                                    self.$nextTick();
                                }
                            });
                        },
                        click(e) {
                            let { lng, lat } = e.lnglat;
                            self.lng = lng;
                            self.lat = lat;

                            // 这里通过高德 SDK 完成。
                            var geocoder = new AMap.Geocoder({
                                radius: 1000,
                                extensions: 'all'
                            });
                            geocoder.getAddress([lng, lat], function(status, result) {
                                if (status === 'complete' && result.info === 'OK') {
                                    if (result && result.regeocode) {
                                        self.address = result.regeocode.formattedAddress;
                                        self.$nextTick();
                                    }
                                }
                            });
                        }
                    }
                }
            ],
            events: {
                init(o) {
                    console.log('初始化高德地图1');
                },
                click(e) {
                    self.longitude = e.lnglat.lng;
                    self.latitude = e.lnglat.lat;
                    let lonAndlat = self.longitude + ',' + self.latitude;
                    console.log(self.longitude + ',' + self.latitude);
                    self.$message('正在计算区域名称');
                    getAMapAddressByLocation(lonAndlat).then(response => {
                        self.AMapAddress = response.data.data;
                        self.$message.success('当前地址为:' + self.AMapAddress);
                    });
                }
            },
            // 高德地图搜索需要
            markers: [
                [121.59996, 31.197646],
                [121.40018, 31.197622],
                [121.69991, 31.207649]
            ],
            searchOption: {
                city: '北京',
                citylimit: true
            },
            mapCenter: [116.408016, 39.948038]
        };
    },
    methods: {
        // 高德地图搜索功能
        addMarker: function() {
            let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
            let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
            this.markers.push([lng, lat]);
        },
        onSearchResult(pois) {
            let latSum = 0;
            let lngSum = 0;
            if (pois.length > 0) {
                pois.forEach(poi => {
                    let { lng, lat } = poi;
                    lngSum += lng;
                    latSum += lat;
                    this.markers.push([poi.lng, poi.lat]);
                });
                let center = {
                    lng: lngSum / pois.length,
                    lat: latSum / pois.length
                };
                this.mapCenter = [center.lng, center.lat];
            }
        }
    }
};
</script>