<?php
date_default_timezone_set('Asia/Shanghai');
header('content-type:text/html;charset=utf-8');

session_start();

require('init.php');
require('function.php');
$link = dbConnect();
$res = null;

$TIPS = [
	0 => '用户未登录'
];


if( getallheaders()['content-type'] === 'application/json' ){

	edi_save($link);

}else{

	$actions = $_POST;
	switch( $actions['action'] ){

		case 'saveAndClose':
			$res = edi_saveAndclose($link);
			break;
		case 'resetChange':
			$res = edi_reset($link);
			break;

	}
		
	$res = $TIPS[$res];
	echo $res;

}


