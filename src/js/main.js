window.onload = function(){

var z = {
    plugVessel : $('#tinymce'),
    editorBtn : $('#editorBtn'),
    contentTitle : $('#contentTitle'),
    fnbar : $('.fnbar'),
    showcase : $('#showcase'),
    editorCon : $('#editorCon'),
    saveChange : $('#saveChange'),
    resetChange : $('#resetChange'),
    saveAndClose : $('#saveAndClose'),

    userStatus : null,

    init : function(){
        showcase.style.display = 'block';
        // draw();
        event();
    },


}


z.init();




function event(){

    z.editorBtn.onclick = function(){

        var eInput = '<input type="text" id="ediTit" placeholder="点击此处修改标题" />'
        contentTitle.innerHTML = eInput;
        z.ediTit = $('#ediTit');

        showcase.style.display = 'none';
        editorCon.style.display = 'block';

        z.tinymce = initTinymce();

        location.hash = 'editor';

    }


    // 保存按钮
    z.saveChange.onclick = function(){
        console.log( save.doSave() );
    };

    // 重置按钮
    z.resetChange.onclick = function(){
        var tinymceBody = tinymce.activeEditor.getBody();
        tinymceBody.innerHTML = '';
        ajax({
            method:'post',
            url:'php/index.php',
            data:'action=resetChange'
        });
    };

    // 发布按钮
    z.saveAndClose.onclick = function(){

        console.log(save.upload());

    };

}




/**
 * 根据后台返回内容生成标签插入页面内
 * @param  {[对象]} obj [json数据]
 * @return {[无]}     [无]
 */
function draw(){

    ajax({
        method:'post',
        data:'action=draw',
        url:'php/index.php',
        success:function(data){
            // document.body.innerHTML = data;
            var json = JSON.parse(data);
            draw.success(json);
        }
    });

}
draw.success = function(obj){

    var html = '';
    var showcase = $('#showcase');


    for(var attr in obj){
        var json = JSON.parse( obj[attr] );
        var thumb = json['articleSnapshoot'];
        var thumbPath = 'data/snapshoot/'+thumb;
        var tit = json['articleTit'];
        var data = howLong( json['updateDate'] );

        var str = ''+
        '<div class="bar">'+
            '<div class="bar-img">'+
                '<a href="#"></a><img src="'+ thumbPath +'">'+
            '</div>'+
            '<div class="bar-info">'+
                '<div class="bar-info-l">'+
                    '<a href="javascript:;" class="bar-info-l-profile"></a>'+
                    '<a href="#" class="bar-info-l-tit">'+ tit +'</a>'+
                '</div>'+
                '<div class="bar-info-r">'+
                    '<a href="javascript:;" class="bar-info-r-thumb">'+
                        '<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>'+
                        '<span class="c">1000</span>'+
                    '</a>'+
                    '<span class="d">'+ data +'</span>'+
                '</div>'+
            '</div>'+
        '</div>';

        html += str;
    }

    showcase.innerHTML = html;
}



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
        console.log(diff);

    if( diff<0 ) return res;

    var s = 1,
        m = s*60,
        h = m*60,
        D = h*24,
        M = D*30,
        Y = D*365;

        // console.log(D);
    if( diff >=0 && diff < D ){

        console.log(432343);
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



/**
 * 改函数下有四个方法，用于响应保存，发布功能，在php里，都将数据先存储到SESSION里
 * 当按保存的时候其实只是将页面的内容暂时保存在SESSION里，此时发送一个content-type为json的请求，内容为标题和正文的内容
 * 当按发布的时候，先调用按保存时的函数，若返回值正常则调用save.html2canvas函数执行截图，共发送两次请求，保存标题和正文一次，保存截图的base64编码一次
 * @return {[无]} [无]
 */
function save(){}
// 提示
save.tips = {
    ok:'ok',
    no_tit:'请输入标题',
    no_txt:'正文不能为空'
};
// 用于获取编辑器正文内容和标题
save.getTinymceData = function(){
    var con = tinymce.activeEditor.getContent();
    var conEncode = encodeURI(con); // 把数据用URI编码一下再做成json格式的字符
    return {
        tit:z.ediTit.value,
        txt:conEncode
    }
}
// 将格式好的JSON对象转换成字符串形式
save.toJsonStr = function(obj){
    var jsonStr = JSON.stringify(obj);
    return jsonStr;
};
// 截屏并保存
save.html2canvas = function(){

    // 使用html2canvas插件实现网页截图功能
    // 使用canvasAPI的toDataURL将canvas画布内的图像转换成base64编码
    // 由于toDataURL函数生成的编码会带一个base64的头，需要去掉才能给php的base64_decode函数解析
/*    html2canvas(

        $('#mceu_39'),
        {logging:false,width:500,height:500}

    ).then(function(canvas) {
        document.body.appendChild(canvas);
        var snapshootBase64 = canvas.toDataURL();
        snapshootBase64 = snapshootBase64.split(',')[1];
        var obj = {
            "tinymce_base64":snapshootBase64
        };
        var jsonStr = save.toJsonStr(obj);
        save.send(jsonStr);

    });*/

    html2canvas($('#mceu_39')).then(function(canvas){
        document.body.appendChild(canvas);
    });

};
// 发送ajax请求
save.send = function(conJsonStr){
    var tips = save.tips;
    var res = ajax({
        method:'post',
        data:conJsonStr,
        url:'php/index.php',
        success:function(data){
            console.log(data);
        }
    },'json');

};
// 保存
save.doSave = function(){

    var tips = save.tips;
    tinymce.activeEditor.save();
    var data = save.getTinymceData();

    if(!data.tit) return tips.no_tit;
    if(!data.txt) return tips.no_txt;

    var obj = {
        "tinymce_tit":data.tit,
        "tinymce_txt":data.txt
    };
    var jsonStr = save.toJsonStr(obj);
    save.send(jsonStr);

    return tips.ok;
};
// 发布
save.upload = function(){

    var val = save.doSave();
    var res = val;
    if( val == 'ok' ){
        save.html2canvas();
        res = val;
    }
    ajax({
        method:'post',
        data:'action=saveAndClose',
        url:'php/index.php',
        success:function(data){
            // document.body.innerHTML = data;
        }
    });
    return res;
};




/**
 * 初始化编辑器
 * @return {[无]} [无]
 */
function initTinymce(){

    var obj = z.plugVessel;
    var vi = 72 + 38 + 52 + 60;
    var height = client(window).h - vi;

    return tinymce.init({

        target: obj,
        language:'zh_CN',
        min_height : height,
        plugins: [
            'advlist autolink lists link image preview autosave textcolor table codesample'
        ],
        toolbar:
            /*工具栏显示*/
            // 预览
            'preview |' +
            // 粗体 斜体 删除线 下划线
            ' bold italic strikethrough underline |'+
            // 字体颜色  字体背景色
            ' forecolor backcolor |'+
            // 下标  上标  字体大小  预览
            ' subscript | superscript | fontsizeselect |'+
            // 链接  代码高亮
            ' link | codesample |'+
            // 左对齐  居中对齐  右对齐  两端对齐
            ' alignleft aligncenter alignright alignjustify |'+
            // 有序列表  符号列表
            ' numlist bullist |'+
            // 减少缩进  增加缩进
            ' outdent indent |'+
            // 表格
            ' table |'+
            // 清除格式
            ' removeformat',
        branding: false,    // 隐藏tinymce商标
        elementpath: false, // 隐藏编辑路径
        image_advtab: true,
        menubar: false,

        fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt 72pt',  // 设置可选字体大小


        // 定义tinymce渲染完成的回调函数，用于修改部分样式
        init_instance_callback: function(){

            document.body.onresize = function(){
                var vi = 72 + 38 + 52 + 60 +　20;
                var height = client(window).h - vi;

                if( height > 200 ){
                    z.tinymce_ifr.style.height = height + 'px';
                }

            }


            // 获取iframe标签
            z.tinymce_ifr = $('#tinymce_ifr');

        }

    });

}

}







