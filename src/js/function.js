/**
 * Route对象
 * add方法:用来像Route实例对象添加一条路由记录,记录存储在hash_fn_list对象里
 *     ：参数1——hash名称，这个名称非常重要，路由函数就根据这个名称找到函数
 *     ：参数2——为一个对象，包含hash要执行的函数以及该函数的参数，和回调函数
 * hash_fn_list:是一个对象，键名是hash名即模块名，键值是一个函数
 * e:为monitor的一个子方法，功能是根据hashSplit函数返回的hash值从hash_fn_list里找对应的函数执行，可独立调用执行
 * monitor:用与监控hash的变换
 *
 */
function Route(){
    this.monitor();
}
Route.prototype = {

    hash_fn_list:{},
    /**
     * 分割处理hash值，并把模块名和路径名存进对象返回出去
     * @return {[对象]} [包含模块名和路径的对象]
     */
    hashSplit:function(){
        var hash_arr = document.location.hash.slice(1).split('/');
        /*-------特殊对待，如果此时的hash_arr[0]为空的话表示首页-------*/
        hash_arr[0] = (hash_arr[0] === '') ? 'index' : hash_arr[0];
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
    /**
     * 用于调用与此hash对应的函数
     * @return {[无]} [无]
     */
    e:function(){
        var obj = this.hashSplit();
        if(!obj) return false;
        var mod = obj.mod;
        // 如果hash_fn_list对象里存在一条对应该模块的记录，就调用它
        if(this.hash_fn_list[mod] && this.hash_fn_list[mod].fn){
            this.hash_fn_list[mod].fn(this.hash_fn_list[mod].fn_argus);
        }
    },
    /**
     * 监视hash的变换并调用e方法
     * @return {[无]} [无]
     */
    monitor:function(){
        var _this = this;
        window.addEventListener('hashchange',function(){
            _this.e();
        });
    },
    /**
     * 添加路由记录到hash_fn_list对象里，注：hash只能是小写
     * @param {[字符串]} hash [模块名]
     * @param {[对象]} obj  [该对象包含fn属性和fn_argus属性]
     */
    add:function(hash,obj){
        hash = hash.toLowerCase();  // 将hash值转换成小写
        this.hash_fn_list[hash] = obj;    // obj包含fn属性和fn_argus属性
    }

};





/**
 * CreateMod对象:用来向参数指定的父节点插入子模块,只用来载入静态部分的页面
 * @param {[节点]} parent [父节点]
 *
 *  add方法:接收一个对象该对象应该包含一个html属性和一个可选的selector字符串
 *      ：html属性——html代码字符串
 *      :selector字符串——用逗号分割的class名
 *      ：add方法返回所插入节点拥有id值的标签,限于自己技术问题，目前add只能返回有id的节点，且id的格式为id="id"
 *
 */
function CreateMod(parent){
    this.parent = parent;
}
CreateMod.prototype = {

    add:function(obj){
        if( !obj.html ) return false;
        var html = obj.html;

        var tmp = document.createElement('div');
            tmp.innerHTML = html;

        var re = /id="[a-z0-9A-Z]*"/g;
        var arr1 = html.match(re);
        var nodes = {};
        nodes.wrap = tmp.firstChild;

        // 如果arr1不为空则进行下一步————分割出id值找到对应的对象并存进nodes对象里
        if(arr1){
            var arr2 = [];
            arr1.forEach(function(item){
                var re = /"[a-z0-9A-Z]*"/;
                var str = item.match(re)[0];
                var res = str.slice(1,str.length-1);
                arr2.push(res);
            });

            arr2.forEach(function(item){
                nodes[item] = tmp.querySelector('#'+item);
            });
        }


        var selector = null;
        if(obj.selector){
            selector = obj.selector.split(',');
        }else{
            selector = [];
        }

        selector.forEach(function(item){
            nodes['class_'+item.slice(1)] = tmp.querySelector('.'+item);
        });

        if(this.parent){
            this.parent.appendChild(nodes.wrap);
        }
        return nodes;
    }

};












/*===============工具方法===================*/
/**
 * 返回时间戳距离当前时间有多久
 * @param  {[混合]} timestamp [字符串或数字]
 * @return {[字符串]}           [距离当前有多久]
 */
function howLong(timestamp){
    var res = false;
    var timestamp = parseInt(timestamp),
        now = +new Date(),
        diff = parseInt( (now - timestamp)/1000 );

    if( diff<0 ) return res;

    var s = 1,
        m = s*60,
        h = m*60,
        D = h*24,
        M = D*30,
        Y = D*365;

    if( diff >=0 && diff < D ){

        switch(true){
            case ( diff < 5*m ):
                res = '刚刚';
                break;
            case ( diff >= 5*m && diff<10*m ):
                res = '5分钟前';
                break;
            case ( diff >= 10*m && diff < 15*m ):
                res = '10分钟前';
                break;
            case ( diff >= 15*m && diff < 20*m ):
                res = '15分钟前';
                break;
            case ( diff >= 20*m && diff < 30*m ):
                res = '20分钟前';
                break;
            case ( diff >= 30*m && diff < 1*h ):
                res = '30分钟前';
                break;
            case ( diff >= 1*h && diff < 2*h ):
                res = '1小时前';
                break;
            default:
                res = parseInt( diff/h ) + '小时前';
                break;
        }

    }else if( diff >= D && diff < M ){
        res = parseInt( diff / D ) + '天前';
    }else if( diff >= M && diff < Y ){
        res = parseInt( diff / M ) + '月前';
        ( res == 12 ) && (res = '1年前');
    }else if( diff >= Y ){
        res = fTime(timestamp,'Y-M-D');
    }

    return res;
}
