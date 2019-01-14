<?php
/**
 * 返回数据内容类型
 * @return [字符串] [标识着某种数据类型,目前只有两种:application/x-www-form-urlencoded表单类型和json类型application/json]
 */
function get_content_type(){
    $res = isset( apache_request_headers()['Content-Type'] ) ? apache_request_headers()['Content-Type'] : null;
    $tip = [
        'application/x-www-form-urlencoded' => 'form',
        'application/json' => 'json'
    ];
    return  $tip[$res];
}


function guide(){

    $request_type = get_content_type();
    if($request_type === 'form'){
        deal_form_request();
    }else if($request_type === 'json'){
        // deal_json_request();
    }

}
