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
        event();
    },


}


z.init();



function drawing(){



}



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
    html2canvas(

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
            console.log(data)
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
        url:'php/index.php'
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







