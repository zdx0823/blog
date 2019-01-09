function Route(){}
route.prototype = {

    // hashchange
    hashFnList:{},
    hashSplit:function(){
        var hash_arr = document.location.hash.slice(1).split('/');
        var obj = {
            mod:hash_arr[0] || null,
            path:hash_arr[1] || null
        };
        if(!obj.module[0]){
            return false;
        }
        return obj;
    }
    execute:function(){
        var _this = this;
        window.addEventListener('hashchange',function(){
            var obj = _this.hashSplit();
            if(!obj) return false;
            var mod = obj.mod;
            _this.hashFnList(mod)();
        });
    },
    add:function(hash,fn){
        this.hashFnList[hash] = fn;
    }

};
