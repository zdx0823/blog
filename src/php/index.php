<?php


if( getallheaders()['content-type'] === 'application/json' ){

    // 生成唯一的文件名
    $uuid = md5( uniqid( microtime().mt_rand() ) );
    $fileName = '../data/articles/' . $uuid;
    // 将json数据写入文件
    $data = file_get_contents('php://input')
    file_put_contents($fileName,);



}

