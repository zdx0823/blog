function route(){}
route.prototype = {

    // hashchange
    execute:function(){
        window.addEventListener('hashchange',function(){
            var hash = document.location.hash;
        });
    },



};
