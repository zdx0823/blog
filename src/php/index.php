<?php
date_default_timezone_set('Asia/Shanghai');
header('content-type:text/html;charset=utf-8');
require('init.php');
require('function.php');
$link = dbConnect();

if( getallheaders()['content-type'] === 'application/json' ){

    responseAddEvent($link);

}


