import $ from 'jQuery';
import 'libs/jquery.mousewheel.js';
import 'libs/jquery.mCustomScrollbar.js';
import 'assets/styles/mcustom-scrollbar.style';
/**
 * 自定义滚动条
 * 
 * @param {object} $scrollArea 需要创建滚动条的区域 
 */
const customScrollbar = function($scrollArea) {
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
export default customScrollbar;