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
    resetChange : $('#resetChange'),

    userStatus : null,

    init : function(){
        showcase.style.display = 'block';
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
        send_saveRequest();
    };
    
    // 重置按钮
    z.resetChange.onclick = function(){
        var tinymceBody = tinymce.activeEditor.getBody();
        tinymceBody.innerHTML = '';
        ajax({
            method:'post',
            url:'php/index.php',
            data:'action=resetChange',
            success:function(data){
                console.log(data);
            }
        });
    };

    // 保存并关闭按钮
    z.saveAndClose.onclick = function(){
        send_saveRequest('saveAndClose');
        ajax({
            method:'post',
            url:'php/index.php',
            data:'action=saveAndClose',
            success:function(data){
                console.log(data);
            }
        });

    };

}




/**
 * 使用html2canvas插件生成编辑器的截图，转换成base64编码，再发起请求发送给index.php保存截图
 * @return {[type]} [description]
 */
function saveSnapshoot(){

    var res = function(str){
        return str;
    };
    html2canvas($('#mceu_39')).then(function(canvas) {
        // 使用canvasAPI的toDataURL将canvas画布内的图像转换成base64编码
        var snapshootBase64 = canvas.toDataURL();

        // 由于toDataURL函数生成的编码会带一个base64的头，需要去掉才能给php的base64_decode函数解析
        snapshootBase64 = snapshootBase64.split(',')[1];
        res(snapshootBase64);

    });


    return res;

}



/**
 * 用于发送ajax请求去保存数据
 * @return {[无]} [无]
 */
function send_saveRequest(action){

    var action = action || 'save';

    tinymce.activeEditor.save();
    var con = tinymce.activeEditor.getContent();
    // 把数据用URI编码一下再做成json格式的字符
    var conEncode = encodeURI(con);
    var saveSnapshootStr = saveSnapshoot();
    console.log( saveSnapshootStr );
    var conJsonStr = '{"tinymce":"'+ conEncode +'","title":"'+ z.ediTit.value +'"}';

    if( action == 'saveAndClose' ){
        conJsonStr = '{ "tinymce":"'+ conEncode +'","title":"'+ z.ediTit.value +'","snapshootBase64":"'+ saveSnapshootStr +'" }';
    }


    ajax({
        method:'post',
        data:conJsonStr,
        // 注意这里的路径问题，main.js是在index.html里执行的，所以要以index.html的视角去写路径
        url:'php/index.php',
        success:function(data){
            console.log(data);
        }
    },'json');

}


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







