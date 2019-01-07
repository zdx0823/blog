// reading/userID/articleID
// reading/100/48ab184901f1aa6a0242466a1eb9aa29

function Route(z){
    this.z = z;
    this.init();
}
Route.prototype = {

    /**
     * 初始化操作
     * @return {[type]} [description]
     */
    init:function(){

        this.hashchange();
        this.setting();
        this.z.page.status = 1;
    },


    /**
     * 获取hash值
     * @return {[数组]} [返回hash数组]
     */
    hash:function(){
        var hash = document.location.hash;
        hash = hash.substr(1,hash.length-1);
        if( hash.indexOf('/') != -1 ){
            hash = hash.split(hash,'/')
        }else{
            hash = [hash];
        }
        return hash;
    },

    /**
     * 监控hash值变化，默认执行setting函数，如果编辑区有内容执行setEdiPop函数
     * @return {[无]} [无]
     */
    hashchange:function(){
        var z = this.z;
        var _this = this;
        window.addEventListener('hashchange',function(){
            if( z.ediIsDirty === true ){
                // z.ediIsDirty = false;
                _this.setEdiPop();
            }else{
                _this.setting();
            }

        });
    },

    /**
     * 设置页面，根据hash数组的第一个值调用不同的方法来设置页面显示内容
     * @return {[type]} [description]
     */
    setting:function(){
        var hash = this.hash();
        var z = this.z;

        if( !hash[0] ){
            console.log(7654);
            this.page_index();
        }else if( hash[0] == 'editor' ){
            this.page_editor();
        }
    },

    /**
     * 在编辑区有内容的时候执行此方法
     */
    setEdiPop:function(){
        var z = this.z;
        var _this = this;
        var res = null;
        document.documentElement.style.overflowY = 'hidden';

        z.appShade.style.display = 'block';
        z.ediPop.style.display = 'block';
        z.ediPop.style.top = (client(window).h - getStyle(z.ediPop,'height').val)/4 + 'px';
        z.ediPop.style.left = (client(window).w - getStyle(z.ediPop,'width').val)/2  - 320 + 'px';

        z.ediPopTrue.onclick = function(){
            z.edi.doSave();
            tinymce.activeEditor.setContent('');
            z.ediTit.value = '';
            res = 'save';
        };
        z.ediPopFalse.onclick = function(){
            z.edi.reset();
            res = 'reset';
        };

        // 不停检测用户是否做出操作
        var timer = setInterval(function(){

            if(res){
                _this.setting();
                clearInterval(timer);
                z.appShade.style.display = 'none';
                z.ediPop.style.display = 'none';
                z.ediIsDirty = false;
            }
        },200);
        return res;
    },

    /**
     * 设置主页
     * @return {[无]} [无]
     */
    page_index:function(){
        var z = this.z;
        z.showcase.style.display = 'block';
        z.editorCon.style.display = 'none';
        z.ediTit.style.display = 'none';
        z.indexTit.style.display = 'block';
        z.draw_catalog();
    },

    /**
     * 设置编辑页
     * @return {[无]} [无s]
     */
    page_editor:function(){
        var z = this.z;
        z.showcase.style.display = 'none';
        z.editorCon.style.display = 'block';
        z.indexTit.style.display = 'none';
        z.ediTit.style.display = 'block';
        z.tinymce = z.initTinymce();


    }



}
