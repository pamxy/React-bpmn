import _ from 'lodash';

export default class Boolean {

    /**
     * 是否为Boolean
     * @param val 检查值
     */
    public static isBoolean(val: any): boolean {
        return _.isBoolean(val)
    }

    /**
     * 是否为Boolean
     * @param val 检查值
     * @param def 可选检查值非Boolean类型返回此默认参数
     * @return
     */
    public static toBoolean(val: any, def: boolean): boolean {
        if (_.isBoolean(val)) {
            return val
        }
        return def
    }
}
