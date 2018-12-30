<?php
date_default_timezone_set('Asia/Shanghai');
header('content-type:text/html;charset=utf-8');

session_start();

require('init.php');
require('function.php');
$link = dbConnect();

if( getallheaders()['content-type'] === 'application/json' ){

    edi_save($link);

}else{

	$actions = $_POST;
	if( $actions['action'] == 'saveAndClose' ){
		edi_saveAndclose($link);
	}else if( $actions['action'] == 'resetChange' ){
		edi_reset();
	}
	

}
