<?php
date_default_timezone_set('Asia/Shanghai');
header('content-type:text/html;charset=utf-8');
require('init.php');
require('function.php');

session_start();
$link = dbConnect();
$res = null;
/*
$TIPS = [
	0 => '用户未登录',
    1 => '操作成功'
];


if( getallheaders()['content-type'] === 'application/json' ){

	$val = edi_save($link);

}else{

	$actions = $_POST;
	switch( $actions['action'] ){

		case 'saveAndClose':
			$val = edi_saveAndclose($link);
			break;
		case 'resetChange':
			$val = edi_reset($link);
			break;

	}

}

echo $TIPS[$val];

*/

var_dump( readUserData($link) );
