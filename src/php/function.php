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
            config('DB_CONNECT')
        );
        if(!$link = call_user_func_array('mysqli_connect',$config)){
            exit('数据库连接失败:'.mysqli_connect_error());
        }
    }
    return $link;
}

function dbQuery($link,$sql){

    $res = mysqli_query($link,$sql);
    if(!$res){
        exit('执行失败:'.mysqli_error($link));
    }

    return $res;
}


/**
 * 生成唯一的编号
 * @return [数字] [description]
 */
function build_order_no(){
    return date('Ymd').substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8);
}





/**
 * 判断用户是否登录
 * @param  [对象]  $link [数据库标识符]
 * @return boolean       [用户未登录返回字符串提示，用户不存在返回false，用户存在返回true]
 */
function isLogin($link){

    $userID = isset($_COOKIE['userID']) ? $_COOKIE['userID'] : null;
    $res = false;
    if( isset($userID) && isUserExist($link,$userID) ){
        $res = $userID;
    }
    return $res;
}


/**
 * 判断用户是否存在，根据查询结果返回的行数判断
 * @param  [对象]  $link   [数据库标识符]
 * @param  [字符串]  $userID [用户ID]
 * @return boolean         [不存在返回0]
 */
function isUserExist($link,$userID){

    $sql = "SELECT * FROM users WHERE userID = ".$userID;
    $res = dbQuery($link,$sql);
    return mysqli_num_rows( $res );

}



/**
 * 添加文章记录
 * @param [type] $link      [description]
 * @param [type] $userID    [description]
 * @param [type] $articleID [description]
 */
function addArticle($link,$userID,$articleID){

    $sql = "INSERT articles(`userID`,`articleID`,`updateDate`) VALUES
    (".$userID.",'".$articleID."','".date('Y-m-d H:i:s')."')";
    return dbQuery($link,$sql);

}


/**
 * 响应添加文章的操作
 * @param  [对象] $link [数据库标识符]
 * @return [无]       [无]
 */
function responseAddEvent($link){

    $userID = isLogin($link);
    if(!$userID) return;
    // 生成唯一的文件名
    $uuid = md5( uniqid( microtime().mt_rand() ) );
    $fileName = '../data/articles/' . $uuid;
    // 将json数据写入文件
    $data = file_get_contents('php://input');
    file_put_contents($fileName,$data);
    addArticle($link,$userID,$uuid);

}
