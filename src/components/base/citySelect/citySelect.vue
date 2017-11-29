<template>
    <Poptip trigger="hover" placement="bottom-start">
        <Button type="text" icon="ios-paperplane" :title="selectCityName">{{selectCityName}}</Button>
        <div slot="content">
            <div class="c-city-select" @click.stop="citySelectClick">
                <h3 class="group-title">热门城市</h3>
                <div class="group-con g-parent-clear">
                    <a href="javascript:void(0);" v-for="hotCity in cityData.hot" :key="hotCity.id" :data-id="hotCity.id" :data-pid="hotCity.pid" :data-name="hotCity.name" :title="hotCity.name" @click.stop="selectCity(hotCity.name)">{{hotCity.name}}</a>
                </div>
                <div class="group-line"></div>
                <h3 class="group-title">热门省份</h3>
                <ul class="group-con g-parent-clear">
                    <template v-for="(province, index) in cityData.province">
                        <Province :province="province" :index="index" :selectCityCallback="selectCityCallback" :key="province.id"></Province>
                    </template>
                </ul>
            </div>
        </div>
    </Poptip>
</template>

<script>
import './styles/citySelect.style';
import cityData from './scripts/cityData.js';
import Province from './province.vue';
export default {
    name: "CitySelect",
    components: {
        Province
    },
    data() {
        return {
            selectCityName: "成都市",
            cityData: cityData
        };
    },
    props: {
        selectCityCallback: {
            type: Function,
            default: () => {
                return true;
            }
        }
    },
    methods: {
        selectCity(cityName) {
            this.$children[0].visible = false;
            this.selectCityName = cityName;
            this.selectCityCallback(cityName);
        },
        citySelectClick() {
            let $children = this.$children[0].$children;
            $children.forEach(($component) => {
                $component.hide();
            });
        }
    }
}
</script>