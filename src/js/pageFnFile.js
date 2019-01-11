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

    fn_routing_page.hideOtherEle(showcase);     // 隐藏其他标签
    showcase.style.display = 'block';           // 显示本标签

    var createMod_for_bar_wrap = new CreateMod(showcase);   // 新建一个实例用于创建bar的包裹节点
    // 创建bar的包裹节点
    var res = createMod_for_bar_wrap.add({
        html:'<div class="showcase_bar_wrap clearfix"></div>',
        selector:'showcase_bar_wrap'
    });
    var bar_wrap = res.class_howcase_bar_wrap;
    // 查询信息
    ajax({
        method:'post',
        data:'',    // 暂时留空
        url:'index_data.txt',
        success:function(data){
            fn_routing_page.index_ajax_callback(bar_wrap,data);
        }
    });

};

/**
 * 主页函数内的ajax执行回调，此函数功能，根据返回内容生成bar块，如果data为空对象则返回null，如果parent或data不存在则返回false
 * @param  {[元素]} parent [bar块的父节点]
 * @param  {[字符串]} data   [字符串格式的json]
 * @return {[混合]}        [参数不正确时返回false，data为空时返回null]
 */
fn_routing_page.index_ajax_callback = function(parent,data){

    if(parent === undefined) return false;
    if(data === undefined) return false;
    if(data == '{}') return null;

    var json = JSON.parse(data);
    var createMod_for_bar = new CreateMod(parent);

    var json_arr = [];
    for(var attr in json){
        json_arr.push(json[attr]);
    }

    json_arr.forEach(function(item){

        var article_id         = item.article_id,
            article_user_id    = item.article_user_id,
            article_user_name  = item.article_user_name,
            article_thumb_path = 'data/snapshoot/'+item.article_thumb_id,
            article_tit        = item.article_tit,
            article_like_num   = item.article_like_num,
            article_m_time     = howLong(item.article_m_time);

        createMod_for_bar.add({
            html:'<div class="bar">\
                    <div class="bar-img">\
                        <a href="javascript:;" articleid="'+article_id+'"></a><img src="'+article_thumb_path+'" />\
                    </div>\
                    <div class="bar-info">\
                        <div class="bar-info-l">\
                            <a href="javascript:;" class="bar-info-l-profile" user_id='+article_user_id+' title='+article_user_name+'></a>\
                            <a href="javascript:;" class="bar-info-l-tit">'+article_tit+'</a>\
                        </div>\
                        <div class="bar-info-r">\
                            <a href="javascript:;" class="bar-info-r-thumb">\
                                <i class="far fa-thumbs-up"></i>\
                                <span class="c">'+article_like_num+'</span>\
                            </a>\
                            <span class="d">'+article_m_time+'</span>\
                        </div>\
                    </div>\
            </div>'
        });

    });

}



/**
 * 编辑页函数
 * @param  {[数组]} arguArr [包含需要的参数]
 * @return {[无]}         [无]
 */
fn_routing_page.editor = function(arguArr){
    var editor_con = arguArr[0];

    fn_routing_page.hideOtherEle(editor_con);
    editor_con.style.display = 'block';

    var res = fn_routing_page.editor_tinymce_callback(editor_con);
    res.timer = setInterval(function(){
        if(res.stringify != '{}') clearInterval(res.timer);
    },100);
    console.log();
};



/**
 * 编辑页函数的回调函数，用于加载出tinymce富文本插件
 * @param  {[type]} vessel [description]
 * @return {[type]}        [description]
 */
fn_routing_page.editor_tinymce_callback = function(vessel){

    if(!vessel) return false;
    var tinymce_instance = new CreateMod().add({html:'<div id="tinymce"></div>'}).tinymce;
    var content_h2 = vessel.querySelector('.contentTitle');
    var editor_btns = vessel.querySelector('.editorCon-btns');
    insertAfter(tinymce_instance,content_h2);

    var obj = tinymce_instance;
    var res = {};
    var end = false;
    tinymce.init({

        target: obj,
        language:'zh_CN',
        plugins: [
            'advlist autolink lists link image preview autosave textcolor table codesample'
        ],
        toolbar: 'preview | bold italic strikethrough underline | forecolor backcolor | subscript | superscript | fontsizeselect | link | codesample | alignleft aligncenter alignright alignjustify | numlist bullist | outdent indent | table | removeformat',
        branding: false,    // 隐藏tinymce商标
        elementpath: false, // 隐藏编辑路径
        image_advtab: true,
        menubar: false,
        fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt 72pt',  // 设置可选字体大小
        // 定义tinymce渲染完成的回调函数，用于修改部分样式
        init_instance_callback: function(){

            res.mceu_39 = $('#mceu_39');    // 当前实例的编辑区
            res.mceu_23 = $('#mceu_23');    // 当前实例的菜单栏
            res.mceu_40 = $('#mceu_40');    // 当前实例的底栏

            // 根据窗口大小调整编辑区高度
            var agio = 2;   // 误差
            var vi = offset(content_h2).h  +
                     offset(res.mceu_23).h +
                     offset(res.mceu_40).h +
                     offset(editor_btns).h +
                     agio;

            var client_height = client(window).h,
                height = client_height - vi;

            res.mceu_39.style.height = height + 'px';   // 先设置一次

            // 窗口变化时候再调整编辑区高度
            document.body.onresize = function(){
                client_height = client(window).h;
                height = client_height - vi;
                if( height > 200 ){
                    res.mceu_39.style.height = height + 'px';
                }
            }
            end = true;
        },

        // init_instance_callback: function (editor) {
        //     // editor.on('Dirty', function (e) {
        //     //     z.ediIsDirty = true;
        //     // });
        // }
    });

    return res;
};


fn_routing_page.articleDetail = function(arguArr){
    var article_detail = arguArr[0];

    fn_routing_page.hideOtherEle(article_detail);
    article_detail.style.display = 'block';
}



