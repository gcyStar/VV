import Vue from 'vue'
import VV from '../src/index.js'

Vue.use(VV);

window.vm=new Vue({
  el: '#VV',

  data () {
    return {
      username: '',
      birthday: '',
      email: '',
      block: '',
      fn:'',
      remote:'',
      a:{}
    }
  },

  vvlist: {
    username: 'required',
    birthday: {
      test (val) {
        return /\d{4}-\d{1,2}-\d{1,2}/.test(val) && Date.parse(val)
      },
      message: '日期格式不正确 yyyy-mm-dd'
    },
    email: ['required','email'],
    block: {
      test: /\w{4,}/,
      message: '至少四位'
    },
    fn:{
      test:function(val){
        return val==1?true:false;
      },
      message:"只能是1"
    },
    remote:{
      remote:function (val,cb) {
        setTimeout(function () {
          if(val==2){
            cb(true);
          }else{
            cb(false);
          }
        
        }, 1500);
      },
      message:"只能是2"
    }
  },
  computed: {
    errors () {
      return this.VV.$errors
    }
  },

  methods: {
    handleSubmit () {
      if (this.VV.check()) {
        alert(`welcome ${this.username}`) // eslint-disable-line
      }
      var errors="";
      var _self=this.VV;
      Object.keys(_self.$errors).forEach((key)=>{
        errors+=key+": "+_self.$errors[""+key]+"     ;";
      });
      
      
      document.querySelector("#errors").innerText=errors;
      console.log(this.VV);
    }
  }
})
