import $ from 'jQuery';
import 'libs/jquery.mousewheel.js';
import 'libs/jquery.mCustomScrollbar.js';
import 'assets/styles/mcustom-scrollbar.style';
import '../styles/customScrollbar.style';
/**
 * 创建自定义滚动条
 *
 * @param {object} $scrollArea 需要创建滚动条的区域
 */
const customScrollbar = function ($scrollArea) {
    $scrollArea.mCustomScrollbar({
        scrollInertia: 100,
        axis: 'y',
        autoHideScrollbar: true,
        mouseWheel: {
            enable: true,
            axis: "y",
            preventDefault: true
        },
        advanced: {
            updateOnContentResize: true
        },
        theme: "scroll-bar"
    });
};
/**
 * 销毁自定义滚动条
 *
 * @param {object} $scrollArea 需要创建滚动条的区域
 */
const destroyScrollbar = function ($scrollArea) {
    $scrollArea.mCustomScrollbar("destroy");
};
export {
    customScrollbar, 
    destroyScrollbar
};