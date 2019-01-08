// createPage只用来载入静态部分的页面
function CreatePage(parent){
    this.parent = parent;
}
CreatePage.prototype = {

    // add方法接收一个对象，对象应该包含一个html属性和一个selector标识符
    // 限于自己技术问题，目前add只能返回有id的节点，且id的格式为id="id"
    add:function(obj){
        if( !obj.html ) return null;
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
        arr2.forEach(function(item){
            nodes[item] = document.getElementById(item);
        });

        selector.forEach(function(item){
            nodes['class_'+item.slice(1)] = res.querySelector(item);
        });
        return nodes;
    }

};



// var html =  '<section id="editorCon" class="fnbar-bar">\
//                 <div id="tinymce"></div>\
//                 <div class="editorCon-btns clearfix">\
//                     <a href="javascript:;" id="saveChange">保存草稿</a>\
//                     <a href="javascript:;" id="resetChange">重置</a>\
//                     <a href="javascript:;" id="saveAndClose">发布</a>\
//                 </div>\
//                 <div id="ediPop">\
//                     <h3 class="ediPop_tit"><span>提示</span><i></i></h3>\
//                     <p class="ediPop_tip">您的内容尚未保存，是否保存为草稿？</p>\
//                     <div class="ediPop_confirm">\
//                         <a href="javascript:;" id="ediPopTrue"><i class="fas fa-check" title="保存"></i></a>\
//                         <a href="javascript:;" id="ediPopFalse"><i class="fas fa-times" title="丢弃"></i></a>\
//                     </div>\
//                 </div>\
//             </section>';





// var blogPage = new CreatePage(document.querySelector('.fnbar')[0]);


// blogPage.add({

//     html:html

// });



/*

<section id="editorCon" class="fnbar-bar">
                    <div id="tinymce"></div>
                    <div class="editorCon-btns clearfix">
                        <a href="javascript:;" id="saveChange">保存草稿</a>
                        <a href="javascript:;" id="resetChange">重置</a>
                        <a href="javascript:;" id="saveAndClose">发布</a>
                    </div>
                    <div id="ediPop">
                        <h3 class="ediPop_tit"><span>提示</span><i></i></h3>
                        <p class="ediPop_tip">您的内容尚未保存，是否保存为草稿？</p>
                        <div class="ediPop_confirm">
                            <a href="javascript:;" id="ediPopTrue"><i class="fas fa-check" title="保存"></i></a>
                            <a href="javascript:;" id="ediPopFalse"><i class="fas fa-times" title="丢弃"></i></a>
                        </div>
                    </div>
                </section>

                <section id="reading" class="clearfix">
                    <div class="reading_head clearfix">
                        <h2 id="readingTit">清平调</h2>
                        <div class="reading_side">
                            <a href="javascript:;" class="author_pro"><img id="authorImg" src="../src/img/profile/test.jpg"></a>
                            <div class="author_name">
                                <strong id="authorName">蜜蜂老牛黄瓜</strong>
                                <a href="javascript:;" id="follow" >+关注</a>
                            </div>
                            <ul class="tarticle">
                                <li>时间<span id="tarticleTime">2018-10-10</span></li>
                                <li>字数<span id="tarticleNum">1000</span></li>
                                <li>阅读<span id="tarticleRead">1435</span></li>
                                <li>评论<span id="tarticleView">18</span></li>
                                <li>喜欢<span id="tarticleLike">41</span></li>
                            </ul>
                        </div>
                    </div>
                    <div class="reading_content_wrap">
                        <div id="readingContent">

                        </div>
                    </div>
                    <div class="comment">
                        <div class="comment_w">
                            <div class="comment_w_user">
                                <a href="javascript:;" class="comment_user_avatar">
                                    <img src="img/profile/test.jpg" id="avatar">
                                </a>
                            </div>
                            <textarea spellcheck="false" class="comment_w_textarea"></textarea>
                        </div>
                        <div class="comment_c"></div>
                    </div>
                </section>*/
