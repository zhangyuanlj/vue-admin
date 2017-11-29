<template>
    <Cascader :data="data" :trigger="trigger" :disabled="disabled" :change-on-select="changeonselect" :load-data="loadData" @on-change="handleChange" @on-visible-change="visibleChange">
    </Cascader>
</template>

<script>
import $ from 'jQuery';
import config from "config";
import "utils/httpRequest.js";
export default {
    name: "DistPicker",
    data() {
        return {
            data: []
        }
    },
    props: {
        trigger: {
            type: String,
            default: 'click'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        changeonselect: {
            type: Boolean,
            default: true
        },
        handleChangeCallback: {
            type: Function,
            default: (selectedData) => {
                return true;
            }
        }
    },
    created() {
        this.getData(0, this.data);
    },
    methods: {
        getData(id, element,callback) {
            const requestUrlParent = `${config.menuRequestUrL}/region/${id}/children.html`;
            $.ajax({
                url: requestUrlParent,
                success: res => {
                    this.http.abnormal(res, (res) => {
                        res.data.forEach((itemlist, index) => {
                            if (!itemlist.leaf) {
                                element.push({
                                    label: itemlist.regionName,
                                    id: itemlist.regionId,
                                    leaf: itemlist.leaf,
                                    value: itemlist.regionCode,
                                    children: [],
                                    loading: false
                                })
                            } else {
                                element.push({
                                    label: itemlist.regionName,
                                    id: itemlist.regionId,
                                    leaf: itemlist.leaf,
                                    value: itemlist.regionCode
                                })
                            }
                        })
                    });
                    callback && callback();
                }
            });
        },
        loadData(item, callback) {
            item.loading = true;
            setTimeout(() => {
                this.getData(item.id, item.children,() => {
                    item.loading = false;
                    callback();
                });
            }, 1000);
        },
        handleChange(value, selectedData) {
            this.handleChangeCallback(selectedData);
        },
        visibleChange(Boolean) {

        }
    }
}
</script>

