/**
 * Created by chunyang.gao on 17/4/11.
 */
import RULES from './rules.js'
import { is,objectAssign } from './util'


/**
 *
 * @param rule  校验的具体规则,比如正在表达式或者函数
 * @param field   待校验的model字段名称
 * @param value   待校验的model字段对应的值
 * @param isArray  校验规则是否是数组['required','email']
 * @returns {boolean}
 */
function check (rule, field, value, isArray) {
    // console.log("this");
    // console.log(this);指向vue实例
    if (Array.isArray(rule)) {
        return rule.map(item =>
                check.call(this, item, field, value, true)
            ).indexOf(false) === -1
    }
    let vm=this;
//在实例上定义的校验规则
    const $rules = this.VV.$rules
    const $errors = this.VV.$errors

    const regex = is('String', rule)
        ? $rules[rule]
        : (is('String', (rule.test||rule.remote)) ? $rules[rule.test] : rule)

    if (!regex ) {
        console.warn(' rule does not exist: ' + (rule.test || rule))
        return
    }
    if(!regex.test&&!regex.remote){
        console.warn(' rule does not exist: ' + (rule.test || rule.remote))
        return
    }
    //rule.message 自定义校验规则时取错误信息
//regex.)message  用插件内置rule时,内置错误
    regex.message = rule.message || regex.message
    let valid=true;

    //检查校验规则是不是函数,正在执行test; 函数直接call调用;
    if( is('Function', regex.test)){
        valid= regex.test.call(this, value)
    }else if(is('Function', regex.remote)){
        var _self=this
        regex.remote.call(this,value,function (bol) {
            if(bol){
                valid=true;
                vm.$delete($errors, field)
            }else{
                console.log(_self)
                // _self.$forceUpdate();
                valid=false;
                // $errors[field] = regex.message
                vm.$set($errors, field, regex.message);

            }
        })

    }else{
        valid=regex.test.test(value)
    }


    if (isArray) {
        const oldError = $errors[field]

        if (valid) {
            vm.$delete($errors, field)
        } else if (!oldError) {
            $errors[field] = regex.message
        }
    } else {
        const error = $errors[field] || []
        const oldError = error.indexOf(regex.message)

        if (valid) {
            oldError > -1 && error.splice(oldError, 1)
            if (!error.length) vm.$delete($errors, field)
        } else if (oldError < 0) {
            error.push(regex.message)
            vm.$set($errors, field, error)
        }
    }

    const hasError = Boolean(Object.keys($errors).length)
//实例属性,判断有没有错误信息
    this.VV.valid = !hasError
    this.VV.invalid = hasError

    return valid
}

class validator{

    constructor(_vm){
        this.vm = _vm
    }
    clear(){
        this.$errors = {}
        return this
    }
    check(fields){
        const vm = this.vm
        const rules = vm.$options.vvlist

        fields = fields || Object.keys(rules)

//function check (rule, field, value, isArray)
        return fields.map(field =>
                check.call(vm, rules[field], field, vm._data[field] ,is('Array',rules[field]))
            ).indexOf(false) === -1
    }


}
// let Vue;
function init () {
    //配置的校验规则选项
    const rules = this.$options.vvlist

    /* istanbul ignore next */
    if (!rules) return

    this.VV = new validator(this);

    this.__proto__.constructor.util.defineReactive(this.VV.__proto__, '$errors', {})
    // Vue.util.defineReactive(this.VV.__proto__, '$errors', {})
    this.__proto__.constructor.util.defineReactive(this.VV.__proto__, 'invalid', true)
    this.__proto__.constructor.util.defineReactive(this.VV.__proto__, 'valid', false)
    //监控字段,实时校验
    Object.keys(rules).forEach(field =>
        this.$watch(
            field,
            value => {
                check.call(this, rules[field], field, value,is('Array',rules[field]));
            }
        )
    )
}

export default function (_Vue, opts) {
    // Vue = _Vue;

    //可以改成set
    validator.prototype.$rules = objectAssign({}, RULES, opts)


    // Vue.set(validator.prototype, '$errors', {});
    // Vue.set(validator.prototype, 'invalid', true);
    // Vue.set(validator.prototype, 'valid', false)

    // Vue.util.defineReactive(validator.prototype, '$errors', {})
    // Vue.util.defineReactive(validator.prototype, 'invalid', true)
    // Vue.util.defineReactive(validator.prototype, 'valid', false)
    _Vue.mixin({
        created: init,
    });


    _Vue.component('vv-input',{
        template:`<span   v-bind:class="{'vuerify-invalid' : $parent.VV.$errors[field]}">
        <input :value="value" @input="$emit('input', $event.target.value)">
        <span class="error" v-text="$parent.VV.$errors[field]"></span>
        </span>`,
        props: ['value','field']
    });
    _Vue.component('vv-textarea',{
        template:`<span v-bind:class="{'vuerify-invalid' : $parent.VV.$errors[field]}">
      <textarea :value="value" @change="$emit('input', $event.target.value)"></textarea>
    </span>`,
        props: ['value','field']

    });
}