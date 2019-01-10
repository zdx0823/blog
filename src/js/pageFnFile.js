var fn_routing_page = {};


/**
 * 用于检测主模块节点的父节点是否为fnbar如果不是抛出一条错误并返回false
 * @param  {[元素]} ele [主模块节点]
 * @return {[混合]}     [返回父节点或抛出错误返回false]
 */
fn_routing_page.deError = function(ele){

    var parent = ele.parentNode;
    if(/fnbar/.test(parent.className)){
        return parent;
    }else{
        throw new Error('此元素的父级不是fnbar');
        return false;
    }

};
/**
 * 隐藏所传入的节点的兄弟节点
 * @param  {[type]} ele [description]
 * @return {[type]}     [description]
 */
fn_routing_page.hideOtherEle = function(ele){
    var parent = fn_routing_page.deError(ele);
    if(!parent) return;
    Array.prototype.slice.call(parent.children).forEach(function(item){
        item.style.display = 'none';
    });
}
/**
 * 主页执行函数
 * @param  {[数组]} arguArr [包含需要的参数]
 * @return {[无]}         [无]
 */
fn_routing_page.index = function(arguArr){
    var showcase = arguArr[0];

    fn_routing_page.hideOtherEle(showcase);
    showcase.style.display = 'block';
    var createpage_bar = new CreateMod(showcase);

    ajax({
        method:'post',
        data:'',
        url:'index_data.txt',
        success:function(data){
        }
    });

};
/**
 * 编辑页函数
 * @param  {[数组]} arguArr [包含需要的参数]
 * @return {[无]}         [无]
 */
fn_routing_page.editor = function(arguArr){
    var editor_con = arguArr[0];

    fn_routing_page.hideOtherEle(editor_con);
    editor_con.style.display = 'block';
}



fn_routing_page.articleDetail = function(arguArr){
    var article_detail = arguArr[0];

    fn_routing_page.hideOtherEle(article_detail);
    article_detail.style.display = 'block';
}
