/**
 * Route对象
 * add方法:用来像Route实例对象添加一条路由记录,记录存储在hashFnList对象里
 *     ：参数1——hash名称，这个名称非常重要，路由函数就根据这个名称找到函数
 *     ：参数2——为一个对象，包含hash要执行的函数以及该函数的参数，和回调函数
 * hashFnList:是一个对象，键名是hash名即模块名，键值是一个函数
 * e:为monitor的一个子方法，功能是根据hashSplit函数返回的hash值从hashFnList里找对应的函数执行，可独立调用执行
 * monitor:用与监控hash的变换
 *
 */
function Route(){
    this.monitor();
}
Route.prototype = {

    hashFnList:{},
    hashSplit:function(){
        var hash_arr = document.location.hash.slice(1).split('/');
        /*-------特殊对待，如果此时的hash_arr[0]为空的话表示首页-------*/
        hash_arr[0] = (hash_arr[0] === '') ? 'index' : hash_arr;
        /*----------------------------------------------------------*/
        var obj = {
            mod:hash_arr[0] || null,
            path:hash_arr[1] || null
        };
        if(!obj.mod){
            return false;
        }
        return obj;
    },
    e:function(){
        var obj = this.hashSplit();
        if(!obj) return false;
        var mod = obj.mod;
        this.hashFnList[mod] && this.hashFnList[mod]();
    },
    monitor:function(){
        var _this = this;
        window.addEventListener('hashchange',function(){
            _this.e();
        });
    },
    add:function(hash,obj){
        var fn = obj.fn;
        var argu = obj.fnArgus;
        this.hashFnList[hash] = fn(argu);
    }

};

