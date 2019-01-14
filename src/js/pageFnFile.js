var fn_routing_page = {};

/**************工具方法*****************/
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
 * 根据参数对象返回静态参数
 * @param  {[对象]} arguObj [参数对象]
 * @return {[数组]}         [静态参数数组]
 */
fn_routing_page.getStaticArgu = function(arguObj){
    return arguObj.static_argu;
}

/**
 * 根据参数对象返回动态参数
 * @param  {[对象]} arguObj [参数对象]
 * @return {[数组]}         [动态参数数组]
 */
fn_routing_page.getDynamicArgu = function(arguObj){
    return arguObj.dynamic_argu;
}

/**************工具方法*****************/




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
 * @param  {[数组]} arguObj [包含需要的参数]
 * @return {[无]}         [无]
 */
fn_routing_page.index = function(arguObj){
    var showcase = fn_routing_page.getStaticArgu(arguObj)[0];

    fn_routing_page.hideOtherEle(showcase);     // 隐藏其他标签
    showcase.style.display = 'block';           // 显示本标签

    var createMod_for_bar_wrap = new CreateMod(showcase);   // 新建一个实例用于创建bar的包裹节点
    // 创建bar的包裹节点
    var res = createMod_for_bar_wrap.add({
        html:'<div class="showcase_bar_wrap clearfix"></div>',
        selector:'showcase_bar_wrap'
    });
    var bar_wrap = res.class_showcase_bar_wrap;
    fn_routing_page.indexAjaxCallback(bar_wrap);

};

/**
 * 主页路由函数的回调函数，ajax请求动态内容并生成节点载入页面，【暂时】现在只是追加，未做分页或瀑布流效果，也未做其他判断
 * @param  {[元素]} parent [bar块的父节点]
 * @param  {[字符串]} data   [字符串格式的json]
 * @return {[混合]}        [参数不正确时返回false，data为空时返回null]
 */
fn_routing_page.indexAjaxCallback = function(parent){

    var head = config.host;
    // 查询信息
    ajax({
        method:'post',
        data:'mod=article',    // 暂时留空
        url:head+'php/index.php',
        success:function(data){
            successFn(parent,data);
        }
    });


    function successFn(parent,data){

        if(parent === undefined) return false;
        if(data === undefined) return false;
        if(data == '{}') return null;

        var json = JSON.parse(data);
        var createMod_for_bar = new CreateMod(parent);

        var article_items = json.articles;

        article_items.forEach(function(item){

            var alt             = item.alt,
                author          = item.author,
                author_intro    = item.author_intro,
                author_profile  = item.author_profile,
                id              = item.id,
                image           = item.image,
                mdate           = howLong(item.mdate),
                title           = item.title,
                like           = item.like;

            createMod_for_bar.add({
                html:'<div class="bar">\
                        <div class="bar-img">\
                            <a href="javascript:;" alt="'+alt+'"></a><img src="'+image+'" />\
                        </div>\
                        <div class="bar-info">\
                            <div class="bar-info-l">\
                                <a href="javascript:;" class="bar-info-l-profile" title='+author+'></a>\
                                <a href="javascript:;" class="bar-info-l-tit" alt="'+alt+'">'+title+'</a>\
                            </div>\
                            <div class="bar-info-r">\
                                <a href="javascript:;" class="bar-info-r-thumb">\
                                    <i class="far fa-thumbs-up"></i>\
                                    <span class="c">'+like+'</span>\
                                </a>\
                                <span class="d">'+mdate+'</span>\
                            </div>\
                        </div>\
                </div>'
            });

        });

    }
};
/**
 * 主页下的文章条目点击事件函数
 * @param  {[元素]} target [a节点]
 * @return {[无]}        [无]
 */
fn_routing_page.articlesEventFn = function(target){

    var target = target;

    if(!target) return;
    if(!target.getAttribute('alt')) return;

    var alt = target.getAttribute('alt');
    location.href = alt;

};



/**
 * 编辑页函数
 * @param  {[数组]} arguObj [包含需要的参数]
 * @return {[无]}         [无]
 */
fn_routing_page.editor = function(arguObj){
    var editor_con = fn_routing_page.getStaticArgu(arguObj)[0];

    fn_routing_page.hideOtherEle(editor_con);
    editor_con.style.display = 'block';

    fn_routing_page.editorTinymceCallback(editor_con);

};



/**
 * 编辑页函数的回调函数，用于加载出tinymce富文本插件
 * @param  {[type]} vessel [description]
 * @return {[type]}        [description]
 */
fn_routing_page.editorTinymceCallback = function(vessel){

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

            res.mceu_23 = $('#mceu_23');    // 当前实例的菜单栏
            res.mceu_40 = $('#mceu_40');    // 当前实例的底栏
            res.tinymce_ifr = $('#tinymce_ifr');    // 当前实例的iframe标签

            // 根据窗口大小调整编辑区高度
            var agio = 2;   // 误差
            var vi = offset(content_h2).h  +
                     offset(res.mceu_23).h +
                     offset(res.mceu_40).h +
                     offset(editor_btns).h +
                     agio;

            var client_height = client(window).h,
                height = client_height - vi;

            res.tinymce_ifr.style.height = height + 'px';   // 先设置一次

            // 窗口变化时候再调整编辑区高度
            document.body.onresize = function(){
                client_height = client(window).h;
                height = client_height - vi;
                if( height > 200 ){
                    res.tinymce_ifr.style.height = height + 'px';
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


/**
 * 文章详情的路由函数，主要就是显示相关页面隐藏其他页面
 * @param  {[对象]} arguObj [该对象包括两个数组，一个包含静态参数，一个包含动态获取到的参数]
 * @return {[无]}         [无]
 */
fn_routing_page.articleDetail = function(arguObj){

    var static_argu = fn_routing_page.getStaticArgu(arguObj);

    var article_detail = static_argu[0],
        article_detail_tit = static_argu[1],
        article_detail_content = static_argu[2];

    fn_routing_page.hideOtherEle(article_detail);
    article_detail.style.display = 'block';
    fn_routing_page.articleDetailCallback(article_detail_tit,article_detail_content);
};
/**
 * 文章详情路由函数的回调函数，用于在静态页面部分加载完成后，ajax请求内容加载动态的内容
 * @param  {[元素]} tit [标题节点]
 * @param  {[元素]} con [内容节点]
 * @return {[无]}     [无]
 */
fn_routing_page.articleDetailCallback = function(tit,con){

    var tit_node = tit,
        con_node = con;

    var hash_obj    = hashSplit(),
        header      = config.path_header,
        mod         = hash_obj.mod,
        path        = hash_obj.path,
        url         = header+mod+'/'+path;

    ajax({
        method:'post',
        data:'',    // 暂时留空
        url:'data/articles/b3ce43bee6e76092a0236a36a57da60a',   // 测试地址
        success:function(data){
            var data = decodeURI(JSON.parse(data).data);
            con_node.innerHTML = data;
        }
    });

};









var fn_guide_page = {};




