<?php

function config($name){

    static $config = null;
    if(!$config){
        $config = require 'init.php';
    }
    return isset($config[$name]) ? $config[$name] : '';

}


function dbConnect(){

    static $link = null;
    if(!$link){
        $config = array_merge(
            [
                'host'=>'',
                'user'=>'',
                'pass'=>'',
                'dbname'=>'',
                'port'=>''
            ],
            config('DB_CONNECT');
        );
    }

}
