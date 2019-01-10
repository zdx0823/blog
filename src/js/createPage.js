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
        if( !this.parent ) return false;
        if( !obj.html ) return false;
        var html = obj.html;
        var selector = null;

        if(obj.selector){
            selector = obj.selector.split(',');
        }else{
            selector = [];
        }


        var tmp = document.createElement('div');
            tmp.innerHTML = html;

        var res = tmp.firstChild;
        this.parent.appendChild(res);

        var re = /id="[a-z0-9A-Z]*"/g;
        var arr1 = html.match(re);
        var arr2 = [];
        arr1.forEach(function(item){
            var re = /"[a-z0-9A-Z]*"/;
            var str = item.match(re)[0];
            var res = str.slice(1,str.length-1);
            arr2.push(res);
        });

        var nodes = {};
        nodes.wrap = res;
        arr2.forEach(function(item){
            nodes[item] = document.getElementById(item);
        });

        selector.forEach(function(item){
            nodes['class_'+item.slice(1)] = res.querySelector(item);
        });
        return nodes;
    }

};
