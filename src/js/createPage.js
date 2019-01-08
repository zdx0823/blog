function createPage(){

}

createPage.editor_static = function(){



}


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
