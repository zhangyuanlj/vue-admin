import Vue from 'vue';
import InfoWindow from '../infoWindow.vue';
const newInstance = function () {
    const instance = new Vue({
        render: h => h(InfoWindow)
    });
    const component = instance.$mount();
    const $InfoWindow = component.$children[0];
    const $el = $InfoWindow.$el;
    const $close = $el.getElementsByClassName("close-win")[0];
    $close.removeEventListener("click", null);
    $close.addEventListener("click", () => {
        $InfoWindow.close();
    }, true);
    return {
        create: function (options) {
            $InfoWindow.setOptions(options);
            $InfoWindow.create();
        },
        close: function () {
            $InfoWindow.close();
        }
    };
};
Vue.prototype.$InfoWindow = newInstance;