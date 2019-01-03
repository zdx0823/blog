<?php
date_default_timezone_set('Asia/Shanghai');
header('content-type:text/html;charset=utf-8');
require('init.php');
require('function.php');

session_start();
$link = dbConnect();
$res = null;



if( apache_request_headers()['Content-Type'] == 'application/json' ){

    $str = file_get_contents('php://input');
    $json = json_decode($str);
    $action = $json -> extra;

    if( $action == 'save' ){
        edi_save($link,$json);
    }else if( $action == 'upload' ){
        edi_upload($link,$json);
    }else if( $action == 'reset' ){
        edi_reset($link);
    }


}else if( apache_request_headers() == 'application/x-www-form-urlencoded' ){
}


