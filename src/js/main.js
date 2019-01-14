window.onload = function(){
var z = {
    fnbar : $('.fnbar'),    // 获取功能区标签
    editor_btn : $('#editorBtn'),    // 添加文章按钮
    create_mod : new CreateMod($('.fnbar')),    // 生成页面对象实例
    route : new Route(),    // 路由对象实例
    init : null,
    fn_routing_page : fn_routing_page,  // 挂载fn_routing_page对象到z对象上
    fn_guide_page : fn_guide_page,      // 挂载fn_guide_page对象到z对象上
    modifyHash:modifyHash
}



/**
 * inputMod方法:调用CreateMod实例下的的add方法将模块载入页面，并将add的返回值整合成一个数组返回
 * @return {[obj]} [所添加模块中所有拥有id属性的标签]
 */
z.inputMod = function(){
    var tmp = {};
    // 主页静态内容
    tmp.showcase = z.create_mod.add({
        html:'<section id="showcase" class="fnbar-bar clearfix"><h2 class="contentTitle">文章</h2></section>'
    });
    // 编辑页静态内容
    tmp.editor_con = z.create_mod.add({
    html:'<section id="editorCon" class="fnbar-bar">\
                <h2 class="contentTitle">\
                    <input type="text" id="ediTit" autocomplete="off" placeholder="点击此处修改标题" />\
                </h2>\
                <div class="editorCon-btns clearfix">\
                    <a href="javascript:;" id="saveChange">保存草稿</a>\
                    <a href="javascript:;" id="resetChange">重置</a>\
                    <a href="javascript:;" id="saveAndClose">发布</a>\
                </div>\
                <div id="ediPop">\
                    <h3 class="ediPop_tit"><span>提示</span><i></i></h3>\
                    <p class="ediPop_tip">您的内容尚未保存，是否保存为草稿？</p>\
                    <div class="ediPop_confirm">\
                        <a href="javascript:;" id="ediPopTrue"><i class="fas fa-check" title="保存"></i></a>\
                        <a href="javascript:;" id="ediPopFalse"><i class="fas fa-times" title="丢弃"></i></a>\
                    </div>\
                </div>\
        </section>'
    });
    // 阅读文章页静态内容
    tmp.article_detail = z.create_mod.add({
    html:'<section id="articleDetail" class="clearfix">\
        <div class="articleDetail_head clearfix">\
            <h2 id="articleDetailTit">清平调</h2>\
            <div class="articleDetail_side">\
                <a href="javascript:;" class="author_pro"><img id="authorImg" src="../src/img/profile/test.jpg"></a>\
                <div class="author_name">\
                    <strong id="authorName">蜜蜂老牛黄瓜</strong>\
                    <a href="javascript:;" id="follow" >+关注</a>\
                </div>\
                <ul class="tarticle">\
                    <li>时间<span id="tarticleTime">2018-10-10</span></li>\
                    <li>字数<span id="tarticleNum">1000</span></li>\
                    <li>阅读<span id="tarticleRead">1435</span></li>\
                    <li>评论<span id="tarticleView">18</span></li>\
                    <li>喜欢<span id="tarticleLike">41</span></li>\
                </ul>\
            </div>\
        </div>\
        <div class="articleDetail_content_wrap">\
            <div id="articleDetailContent">\
            </div>\
        </div>\
        <div class="comment_wrap">\
            <div class="comment">\
                <div class="comment_w">\
                    <div class="comment_w_user">\
                        <a href="javascript:;" class="comment_user_avatar">\
                            <img src="img/profile/test.jpg" id="avatar">\
                        </a>\
                    </div>\
                    <textarea spellcheck="false" class="comment_w_textarea"></textarea>\
                </div>\
                <div class="comment_c"></div>\
            </div>\
        </div>\
    </section>'
    });
    // console.log(articleDetail);
    // 默认所有的标签隐藏，该显示显示什么由路由函数决定
    tmp.showcase.wrap.style.display =
    tmp.editor_con.wrap.style.display =
    tmp.article_detail.wrap.style.display = 'none';

    var res = {};
    for(var attr in tmp){
        var val = tmp[attr];
        for(var key in val){
            res[key] = val[key];
        }
    }

    return res;
}();

// 增加主页路由模块

z.route.add('index',{
    fn:z.fn_routing_page.index,
    fn_argus:[z.inputMod.showcase]
});

z.route.add('editor',{
    fn:z.fn_routing_page.editor,
    fn_argus:[z.inputMod.editorCon,z.inputMod.tinymce]
});

z.route.add('articleDetail',{
    fn:z.fn_routing_page.articleDetail,
    fn_argus:[  z.inputMod.articleDetail,
                z.inputMod.articleDetailTit,
                z.inputMod.articleDetailContent
            ]
});



z.route.e(); // 载入页面时进行路由选择





z.event = function(){

    z.editor_btn.addEventListener('click',function(){
        z.modifyHash('editor');
    })

    z.inputMod.showcase.addEventListener('click',function(e){
        var e = e || event;
        var target = e.target;
        if(target.nodeName === 'A'){
            z.fn_routing_page.articlesEventFn(target);
        }

    })

}();






}







