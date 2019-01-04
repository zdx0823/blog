// reading/userID/articleID
// reading/100/48ab184901f1aa6a0242466a1eb9aa29

function Route(z){
    this.z = z;
    this.init();
}
Route.prototype = {

    init:function(){

        this.hashchange();
        this.setting();

    },

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

    hashchange:function(){
        var z = this.z;
        var _this = this;
        window.addEventListener('hashchange',function(){
            // console.log(_this);
            _this.setting();
        });
    },

    setting:function(){
        var hash = this.hash();
        var z = this.z;
        console.log(hash);
        if( !hash[0] ){
            this.page_index();
        }else if( hash[0] == 'editor' ){
            this.page_editor();
            if( tinymce.activeEditor.isDirty() ){
                this.ediPopReside();
            }
        }
    },

    ediPopReside:function(){

        var z = this.z;
        document.documentElement.style.overflowY = 'hidden';

        z.appShade.style.display = 'block';
        z.ediPop.style.display = 'block';
        z.ediPop.style.top = (client(window).h - getStyle(z.ediPop,'height').val)/4 + 'px';
        z.ediPop.style.left = (client(window).w - getStyle(z.ediPop,'width').val)/2  - 320 + 'px';

        z.ediPopTrue.onclick = function(){
            z.edi.doSave();
        };
        z.ediPopFalse.onclick = function(){
            z.edi.reset();
        };

    },

    page_index:function(){
        var z = this.z;
        z.showcase.style.display = 'block';
        z.editorCon.style.display = 'none';
        z.ediTit.style.display = 'none';
        z.indexTit.style.display = 'block';
    },

    page_editor:function(){
        var z = this.z;
        z.showcase.style.display = 'none';
        z.editorCon.style.display = 'block';
        z.indexTit.style.display = 'none';
        z.ediTit.style.display = 'block';
        console.log(z);
        z.tinymce = z.initTinymce();
    }



}
