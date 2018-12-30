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
        z.event();
    },
    event : function(){

        z.editorBtn.onclick = function(){

            contentTitle.innerHTML = this.innerHTML;
            showcase.style.display = 'none';
            editorCon.style.display = 'block';

            z.tinymce = initTinymce();
            location.hash = 'editor';

        }

        // 保存按钮
        z.saveChange.onclick = send_saveRequest
        
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
            send_saveRequest();
            ajax({
                method:'post',
                url:'php/index.php',
                data:'action=saveAndClose',
                success:function(data){
                    console.log(data);
                }
            });
        };

    },

}


z.init();



function send_saveRequest(){

    tinymce.activeEditor.save();
    var con = tinymce.activeEditor.getContent();
    // 把数据用URI编码一下再做成json格式的字符
    var conEncode = encodeURI(con);
    var conJsonStr = '{"data":"'+ conEncode +'"}';

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


        }

    });

}

}







