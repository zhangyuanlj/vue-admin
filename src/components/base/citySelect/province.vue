<template>
    <li :class="setClass" :data-id="province.id" :data-name="province.name" @click.stop="selectProvince(index)">
        <a href="javascript:void(0);" class="province-name">{{province.name}}</a>
        <div class="group-con city-list" v-if="province.city.length" :style="setLeft(index)">
            <a href="javascript:void(0);" v-for="city in province.city" :title="city.name" :key="city.id" :data-id="city.id" :data-pid="province.pid" :data-name="city.name" @click.stop="selectCity(city.name)">{{city.name}}</a>
        </div>
    </li>
</template>

<script>
export default {
    data() {
        return {
            show: false
        };
    },
    props: {
        province: {
            type: Object
        },
        index: {
            type: Number
        },
        selectCityCallback: {
            type: Function,
            default: () => {
                return true;
            }
        }
    },
    mounted() {
        document.addEventListener("click", () => {
            this.hide();
        }, true);
    },
    computed: {
        setClass() {
            if (this.show) {
                return "active";
            }
            return "";
        },
    },
    methods: {
        hide() {
            this.show = false;
        },
        setOtheListHide(index) {
            let $children = this.$parent.$children;
            $children.splice(0, 1);
            $children.forEach(($component, i) => {
                if (i != index) {
                    $component.hide();
                }
            });
        },
        setLeft(index) {
            const cols = 6;
            const boundaryNum = 3;
            if (index % cols < boundaryNum || index < boundaryNum) {
                return "left:-5px;";
            }
            return "right:-5px;";
        },
        selectProvince(index) {
            this.setOtheListHide(index);
            this.show = !this.show;
        },
        selectCity(cityName) {
            this.$parent.visible = false;
            this.$parent.$parent.selectCityName = cityName;
            this.selectCityCallback(cityName);
        }
    }
}
</script>
