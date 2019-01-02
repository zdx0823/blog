<?php
date_default_timezone_set('Asia/Shanghai');
header('content-type:text/html;charset=utf-8');
require('init.php');
require('function.php');

session_start();
$link = dbConnect();
$res = null;

$TIPS = [
    0 => '用户未登录',
    1 => '操作成功'
];


if( getallheaders()['Content-Type'] ){

    $val = edi_save($link);

}else{

    switch( $_POST['action'] ){

        case 'saveAndClose':
            edi_saveAndclose($link);
            $val = 233;
            break;
        case 'resetChange':
            $val = edi_reset($link);
            break;
        case 'draw':
            $val = readUserData($link);
            break;

    }

}



// echo readUserData($link);

// print_r( $TIPS[$val] );
print_r( $val );


