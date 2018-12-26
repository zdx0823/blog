window.onload = function(){
var zdx = {};
zdx.tevent = function(){

    var addArticle = $('#addArticle');
    var articles = $('#articles');
    var oContent = $('#content');

    addArticle.onclick = function(){

        articles.remove();
        ajax({

            method:'get',
            url:'php/index.php',
            success: function(data){
                var html = decodeURI(JSON.parse(data).addArticle);
                console.log(html);
                oContent.innerHTML = html;
                initTinymce();
                // console.log();
            }

        },'json');

    };


}
function init(){

    zdx.tevent();

}

init();








/**
 * ==========
 * 添加文章
 * ==========
 */
function initTinymce(){

    var obj = $('#editorTinymce');
    var height = 400;

    tinymce.init({

        target: obj,
        language:'zh_CN',
        plugins: [
            'advlist autolink lists link image preview textcolor autosave autoresize table'
        ],
        elementpath: false,
        image_advtab: true,
        autoresize_min_height: height,
        toolbar: ' bold italic strikethrough forecolor backcolor | link | formatselect | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | restoredraft',
        table_toolbar: "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
        branding: false,
        init_instance_callback: function(){

            var save = '<a href="javascript:;" id="editorSave">保存</a>';
            var saveBtn = createNode('a'),
                saveTxt = createTextNode('保存');
            saveBtn.appendChild(saveTxt);
            saveBtn.setAttribute('href','javascript:;');
            saveBtn.setAttribute('id','editorSave');

            var mceu_37 = $('#mceu_37');
            mceu_37.appendChild(saveBtn);

        }

    });

}


}







