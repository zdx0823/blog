window.onload = function(){
var z = {
    fnbar : $('.fnbar'),    // 获取功能区标签
    editor_btn : $('#editorBtn'),    // 添加文章按钮
    create_mod : new CreateMod($('.fnbar')),
    route : new Route(),
    init : null,
    fn_routing_page : fn_routing_page,
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
                <div id="tinymce"></div>\
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
    </section>'
    });
    // console.log(articleDetail);
    // 默认所以的标签隐藏，该显示显示什么由路由函数决定
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
    fn_argus:[z.inputMod.showcase],
});

z.route.add('editor',{
    fn:z.fn_routing_page.editor,
    fn_argus:[z.inputMod.editorCon],
});

z.route.add('articleDetail',{
    fn:z.fn_routing_page.articleDetail,
    fn_argus:[z.inputMod.articleDetail],
});







// 载入页面时进行路由选择
z.route.e();










// bar
var str = '\
        <div class="bar">\
            <div class="bar-img">\
                <a href="javascript:;" articleid="articleID"></a><img src="thumbPath" />\
            </div>\
            <div class="bar-info">\
                <div class="bar-info-l">\
                    <a href="javascript:;" class="bar-info-l-profile"></a>\
                    <a href="#" class="bar-info-l-tit">tit</a>\
                </div>\
                <div class="bar-info-r">\
                    <a href="javascript:;" class="bar-info-r-thumb">\
                        <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>\
                        <span class="c">1000</span>\
                    </a>\
                    <span class="d">date</span>\
                </div>\
            </div>\
        </div>';











// var tRoute = new Route();
// console.log(tRoute);

// tRoute.add('editor',function(){
//     alert('editor');
// });

// tRoute.add('article',function(){
//     alert('article');
// });

// console.log(tRoute.hashFnList.editor);


// /**
//  * 给编辑状态的input设置包装一个方法，使它内容改变的时候z.ediIsDirty变为脏
//  * @return {[无]} [无]
//  */
// function pack_ediTit(){
//     var oInput = z.ediTit;
//     oInput.onfocus = function(){
//         oInput.val = oInput.value;
//     }

//     // compositionend事件在Opera还未实现
//     oInput.addEventListener('compositionupdate', function(){
//         console.log(87654);
//         if( oInput.value != oInput.val ){
//             z.ediIsDirty = true;
//         }

//     })
// }



// function event(){

//     z.editorBtn.onclick = function(){

//         z.route.page_editor();
//         location.hash = 'editor';

//     }

//     // // 保存按钮
//     // z.saveChange.onclick = function(){
//     //     console.log( edi.doSave() );
//     //     z.ediIsDirty = false;
//     // };

//     // // 重置按钮
//     // z.resetChange.onclick = function(){
//     //     edi.reset();
//     // };

//     // // 发布按钮
//     // z.saveAndClose.onclick = function(){

//     //     edi.upload();

//     // };

//     // z.showcase.addEventListener('click',function(e){
//     //     var e = e || event;
//     //     var target = e.target;
//     //     if(target.tagName == 'A'){
//     //         var arr = target.getAttribute('articleid').split('&');
//     //         var articleID = arr[0];
//     //         location.hash = 'article/'+articleID;
//     //         z.route.page_article(arr);
//     //     }
//     // });

// }



// function draw_article(arr){

//     ajax({
//         method:'post',
//         data:'action=draw_article&articleid='+arr[0],
//         url:'php/index.php',
//         success:function(data){

//             data = decodeURI(data);
//             // document.body.innerHTML = data;
//             if(data == ''){
//                 draw_article.state = 'empty';
//             }else{
//                 draw_article.state = 'accepted';
//             }
//             res = draw_article.callback(data,arr[1]);

//         }
//     });


// }
// draw_article.state = undefined;
// draw_article.callback = function(data,tit){

//     console.log(data);
//     z.articleDetailTit.innerHTML = tit;
//     articleDetailContent.innerHTML = data;

// }


// /**
//  * 根据后台返回内容生成标签插入页面内
//  * @param  {[对象]} obj [json数据]
//  * @return {[无]}     [无]
//  */
// function draw_catalog(){

//     var res = null;
//     var json = '';
//     ajax({
//         method:'post',
//         data:'action=draw_catalog',
//         url:'php/index.php',
//         success:function(data){
//             // document.body.innerHTML = data;
//             if(data == ''){
//                 draw_catalog.state = 'empty';
//             }else{
//                 draw_catalog.state = 'accepted';
//                 json = JSON.parse(data);
//             }
//             res = draw_catalog.callback(json);
//         }
//     });

//     var timer = setInterval(function(){

//         if(draw_catalog.state !== undefined){
//             if(draw_catalog.state == 'empty'){
//                 z.loadTips.loading.style.display = 'none';
//                 z.loadTips.empty.style.display = 'inline-block';
//             }else if( draw_catalog.state == 'accepted' ){

//             }
//             clearInterval(timer);
//         }

//     },100);

// }
// draw_catalog.state = undefined;
// draw_catalog.callback = function(obj){

//     var html = '';
//     var showcase = $('#showcase');

//     if( !obj ) return false;

//     for(var attr in obj){
//         var json = JSON.parse( obj[attr] );
//         var thumbPath = 'data/snapshoot/'+ json['articleSnapshoot'];
//         var tit = json['articleTit'];
//         var date = howLong( json['updateDate'] );
//         var articleID = json['articleID'];

//         var str = '\
//         <div class="bar">\
//             <div class="bar-img">\
//                 <a href="javascript:;" articleid="'+ articleID +';"></a><img src="'+ thumbPath +'">\
//             </div>\
//             <div class="bar-info">\
//                 <div class="bar-info-l">\
//                     <a href="javascript:;" class="bar-info-l-profile"></a>\
//                     <a href="#" class="bar-info-l-tit">'+ tit +'</a>\
//                 </div>\
//                 <div class="bar-info-r">\
//                     <a href="javascript:;" class="bar-info-r-thumb">\
//                         <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>\
//                         <span class="c">1000</span>\
//                     </a>\
//                     <span class="d">'+ date +'</span>\
//                 </div>\
//             </div>\
//         </div>';

//         html += str;
//     }

//     showcase.innerHTML = html;
//     draw_catalog.state = true;

// }



// /**
//  * 返回时间戳距离当前时间有多久
//  * @param  {[混合]} timestamp [字符串或数字]
//  * @return {[字符串]}           [距离当前有多久]
//  */
// function howLong(timestamp){
//     var res = false;
//     var timestamp = parseInt(timestamp),
//         now = +new Date(),
//         diff = parseInt( (now - timestamp)/1000 );

//     if( diff<0 ) return res;

//     var s = 1,
//         m = s*60,
//         h = m*60,
//         D = h*24,
//         M = D*30,
//         Y = D*365;

//     if( diff >=0 && diff < D ){

//         switch(true){
//             case ( diff < 5*m ):
//                 res = '刚刚';
//                 break;
//             case ( diff >= 5*m && diff<10*m ):
//                 res = '5分钟前';
//                 break;
//             case ( diff >= 10*m && diff < 15*m ):
//                 res = '10分钟前';
//                 break;
//             case ( diff >= 15*m && diff < 20*m ):
//                 res = '15分钟前';
//                 break;
//             case ( diff >= 20*m && diff < 30*m ):
//                 res = '20分钟前';
//                 break;
//             case ( diff >= 30*m && diff < 1*h ):
//                 res = '30分钟前';
//                 break;
//             case ( diff >= 1*h && diff < 2*h ):
//                 res = '1小时前';
//                 break;
//             default:
//                 res = parseInt( diff/h ) + '小时前';
//                 break;
//         }

//     }else if( diff >= D && diff < M ){
//         res = parseInt( diff / D ) + '天前';
//     }else if( diff >= M && diff < Y ){
//         res = parseInt( diff / M ) + '月前';
//         ( res == 12 ) && (res = '1年前');
//     }else if( diff >= Y ){
//         res = fTime(timestamp,'Y-M-D');
//     }

//     return res;
// }



// /**
//  * 改函数下有四个方法，用于响应保存，发布功能，在php里，都将数据先存储到SESSION里
//  * 当按保存的时候其实只是将页面的内容暂时保存在SESSION里，此时发送一个content-type为json的请求，内容为标题和正文的内容
//  * 当按发布的时候，先调用按保存时的函数，若返回值正常则调用save.html2canvas函数执行截图，共发送两次请求，保存标题和正文一次，保存截图的base64编码一次
//  * @return {[无]} [无]
//  */
// function edi(){}
// // 提示
// edi.tips = {
//     ok:'ok',
//     no_tit:'请输入标题',
//     no_txt:'正文不能为空'
// };
// // 用于获取编辑器正文内容和标题
// edi.getTinymceData = function(){
//     var con = tinymce.activeEditor.getContent();
//     var conEncode = encodeURI(con); // 把数据用URI编码一下再做成json格式的字符
//     return {
//         tit:z.ediTit.value,
//         txt:conEncode
//     }
// }
// // 将格式好的JSON对象转换成字符串形式
// edi.toJsonStr = function(obj){
//     var jsonStr = JSON.stringify(obj);
//     return jsonStr;
// };
// // 发送ajax请求
// edi.send = function(conJsonStr){
//     var tips = edi.tips;
//     console.log(conJsonStr);
//     ajax({
//         method:'post',
//         data:conJsonStr,
//         url:'php/index.php',
//         success:function(data){
//             // document.body.innerHTML = data;
//             z.ediIsSave = false;
//         }
//     },'json');

// };
// // 保存
// edi.doSave = function(){

//     var tips = edi.tips;
//     tinymce.activeEditor.save();
//     var data = edi.getTinymceData();

//     if(!data.tit && !data.txt) return '请输入内容';
//     data.tit = data.tit || ( '未命名 （'+fTime(+new Date())+'）' );
//     data.txt = data.txt || '';

//     var obj = {
//         "extra":'save',
//         "tinymce_tit":data.tit,
//         "tinymce_txt":data.txt
//     };
//     var jsonStr = edi.toJsonStr(obj);
//     edi.send(jsonStr);

// };
// // 重置
// edi.reset = function(){
//     var obj = {
//         'extra':'reset'
//     }
//     var jsonStr = edi.toJsonStr(obj);
//     edi.send(jsonStr);
//     // 清空标题和内容区
//     z.ediTit.value = '';
//     tinymce.activeEditor.setContent('');
//     // 使编辑器为干净状态(刷新的时候不会弹窗提示)
//     tinymce.activeEditor.save();
// };
// // 发布
// edi.upload = function(){

//     var tips = edi.tips;
//     tinymce.activeEditor.save();
//     var data = edi.getTinymceData();

//     if(!data.tit) return tips.no_tit;
//     if(!data.txt) return tips.no_txt;

//     var obj = {
//         "extra":'upload',
//         "tinymce_tit":data.tit,
//         "tinymce_txt":data.txt
//     };

//     html2canvas(

//         $('#mceu_39'),
//         {logging:false,width:500,height:500},

//     ).then(function(canvas) {
//         canvas.style = 'position:absolute;top:-9999px;left:-9999px;';
//         canvas.setAttribute('id','snapshoot');
//         document.body.appendChild(canvas);
//         var canvas = $('#snapshoot');
//         data.base64 = canvas.toDataURL();
//         data.base64 = data.base64.split(',')[1];
//         canvas.remove();
//     });
//     var st = +new Date();
//     var timer = setInterval(function(){

//         var now = +new Date();
//         var diff = now - st;

//         if( diff <= 1000 ){
//             if(data.base64){
//                 obj["tinymce_base64"] = data.base64;
//                 clearInterval(timer);
//                 var jsonStr = edi.toJsonStr(obj);
//                 edi.send(jsonStr);
//             }
//         }else{
//             var jsonStr = edi.toJsonStr(obj);
//             edi.send(jsonStr);
//             clearInterval(timer);
//         }

//     },100);

// };




// /**
//  * 初始化编辑器
//  * @return {[无]} [无]
//  */
// function initTinymce(){

//     var obj = z.plugVessel;
//     var vi = 72 + 38 + 52 + 60;
//     var height = client(window).h - vi;
//     z.tinymce = tinymce;
//     return tinymce.init({

//         target: obj,
//         language:'zh_CN',
//         min_height : height,
//         plugins: [
//             'advlist autolink lists link image preview autosave textcolor table codesample'
//         ],
//         toolbar:
//             /*工具栏显示*/
//             // 预览
//             'preview |' +
//             // 粗体 斜体 删除线 下划线
//             ' bold italic strikethrough underline |'+
//             // 字体颜色  字体背景色
//             ' forecolor backcolor |'+
//             // 下标  上标  字体大小  预览
//             ' subscript | superscript | fontsizeselect |'+
//             // 链接  代码高亮
//             ' link | codesample |'+
//             // 左对齐  居中对齐  右对齐  两端对齐
//             ' alignleft aligncenter alignright alignjustify |'+
//             // 有序列表  符号列表
//             ' numlist bullist |'+
//             // 减少缩进  增加缩进
//             ' outdent indent |'+
//             // 表格
//             ' table |'+
//             // 清除格式
//             ' removeformat',
//         branding: false,    // 隐藏tinymce商标
//         elementpath: false, // 隐藏编辑路径
//         image_advtab: true,
//         menubar: false,

//         fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt 72pt',  // 设置可选字体大小


//         // 定义tinymce渲染完成的回调函数，用于修改部分样式
//         init_instance_callback: function(){
//             z.mceu_39 = $('#mceu_39');
//             document.body.onresize = function(){
//                 var vi = 72 + 38 + 52 + 60 +　20;
//                 var height = client(window).h - vi;

//                 if( height > 200 ){
//                     z.tinymce_ifr.style.height = height + 'px';
//                 }

//             }

//             // 获取iframe标签
//             z.tinymce_ifr = $('#tinymce_ifr');

//         },


//         init_instance_callback: function (editor) {
//             editor.on('Dirty', function (e) {
//                 z.ediIsDirty = true;
//             });
//         }


//     });

// }








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





// var blogPage = new Create_mod(document.querySelector('.fnbar'));


// var ressss = blogPage.add({

//     html:html

// });
// console.log( ressss );







}







