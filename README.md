#vv-validator
Validator component for Vue.js

#Installation
```
npm install vv-jsdt
```
#Usage
```
import Vue from 'vue'
import VV from 'vv-jsdt'

Vue.use(VV);

```
#Features
rules are supported
* custome 
* function 
* Asynchronous 

#demo
```
new Vue({
  el: '#VV',

  data () {
    return {
      username: '',
      fn:'',
      remote:'',
    }
  },

  vvlist: {
    username: 'required',
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
  }
})
```
![vv-jsdt-demo](//img.wuage.com/14922235097878vvjsdt.gif)


## License

MIT © [gcy](https://segmentfault.com/blog/gcystar)