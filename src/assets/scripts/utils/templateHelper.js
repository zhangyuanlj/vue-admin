import DateTime from 'utils/dateTime.js';
/**
 * 模版引擎助手函数
 * 
 * @class TplHelper
 */
class TplHelper {
    /**
     * 数字千分位显示 例如15000执行函数后转换为15,000
     * 
     * @static
     * @param integer num 要处理的数字
     * @returns string 返回处理好的数字
     * @memberof TplHelper
     */
    static numberFormat(num) {
        //如果传进来的值不是数字，则原值返回
        if (isNaN(num) || num < 1000) {
            return num;
        }
        let _num = num.toString(),
            result = '';
        while (_num.length > 3) {
            result = ',' + _num.slice(-3) + result;
            _num = _num.slice(0, _num.length - 3);
        }
        if (_num) {
            result = _num + result;
        }
        return result;
    }
    /**
     * 将数字四舍五入为指定小数位数的数字
     * 
     * @static
     * @param {integer} num 要处理的数字
     * @param {integer} decimals 指定小数位数 
     * @returns float||integer
     * @memberof TplHelper
     */
    static toFixed(num, decimals){
        let _num = num.toString();
        if(_num.indexOf(".") == -1){
            _num = parseFloat(_num);
            return _num.toFixed(decimals);
        }
        return num;
    }
    /**
     * 格式化日期时间字符串
     * 
     * @static
     * @param {string} dataTime 后端返回的日期时间 
     * @param {string} formate 格式化字符串,例如YYYY-MM-DD hh:ss:mm
     * @returns 
     * @memberof TplHelper
     */
    static formateDateTime(dataTime, formate){
        let date = DateTime.getDateObj({
            dateTime: dataTime,
            dayCount: 0
        });
        return DateTime.formateDateTime(date, formate);
    }
}
export default TplHelper;