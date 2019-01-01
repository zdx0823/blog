<?php

function uniqidFileName($len=32){
    $uuid = md5( uniqid( microtime().mt_rand() ) );
    return substr($uuid,0,$len);
}


/**
 * 从init.php文件获取配置并根据参数返回对于的配置参数
 * @param  [字符串] $name [参数名]
 * @return [混合]       [数组或字符串]
 */
function config($name){

    static $config = null;
    if(!$config){
        $config = require 'init.php';
    }
    return isset($config[$name]) ? $config[$name] : '';

}

/**
 * 连接数据库
 * @return [对象] [数据库标识符]
 */
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
    // 截取由uniqid函数生成的随机值的后6位，在分解成数组，使用array_map函数对分解出的数组每一项使用ord函数，将数组中的每一项的值转换成ascii码，在用implode合并数组，再用substr截取出8位与当前的时间做一个拼接得到一个尽可能唯一的值
    return date('Ymd').substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8);
}





/**
 * 判断用户是否登录。判断cookie中是否有userID这个字段，
 * 如果有在再用isUserExist判断数据库中有没有这个用户，如果有就返回这个userID
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
function addArticle($link,$userID,$articleID,$articleTit,$imgId){

    if( !isLogin($link) ){
        return 0;
    }
    $sql = "INSERT articles(`userID`,`articleID`,`articleTit`,`articleSnapshoot`,`updateDate`) VALUES
    (".$userID.",'".$articleID."','".$articleTit."','".$imgId."','".date('Y-m-d H:i:s')."')";
    return dbQuery($link,$sql);

}



/**
 * 响应添加文章的操作，利用session实现临时保存的功能
 * @param  [对象] $link [数据库标识符]
 * @return [无]       [无]
 */
function edi_save($link){

    if( !isLogin($link) ){
        return 0;
    }
    // 将json数据写入一个字符串内
    $data = file_get_contents('php://input');
    $json = json_decode($data);
    if( isset( $json -> tinymce_tit ) ) $_SESSION['tinymce_tit'] = $json -> tinymce_tit;
    if( isset( $json -> tinymce_txt ) ) $_SESSION['tinymce_txt'] = $json -> tinymce_txt;
    if( isset( $json -> tinymce_base64 ) ) $_SESSION['tinymce_base64'] = $json -> tinymce_base64;

    return 1;
}


/**
 * 用于重置按钮，将SESSION中ediData的数据清空
 * @return [无] [无]
 */
function edi_reset($link){

    if( !isLogin($link) ){
        return 0;
    }
    $_SESSION['tinymce_tit'] = '';
    $_SESSION['tinymce_txt'] = '';
    return 1;
}



/**
 * 将session中的数据保存成一个文件并在数据库做一条记录
 * @param  [对象] $link [数据库标识符]
 * @return [无]       [无]
 */
function edi_saveAndclose($link){

    $userID = isLogin($link);   // 判断是否登录，如果已登陆isLogin返回用户id
    if( !$userID ) return 0;    // 如果未登录直接return

    $uuid = uniqidFileName();   // 生成唯一的文件名
    $imgId = ($uuid.'.png');    // 生成截图文件名，正文文件名.png
    $fileName = ('../data/articles/'.$uuid);                // 正文内容文件路径
    $imgFileName = ('../data/snapshoot/'.$uuid.'.png');     // 生成截图的路径

    $tit = $_SESSION['tinymce_tit'];        // 标题
    $txt = $_SESSION['tinymce_txt'];        // 正文
    $base64 = $_SESSION['tinymce_base64'];  // 图片base64编码

    $dataImg = base64_decode($base64);                      // base64解编码

    file_put_contents($fileName,$_SESSION['tinymce_txt']);  // 将正文写入文件
    file_put_contents($imgFileName,$dataImg);               // 将图片写入文件

    addArticle($link,$userID,$uuid,$tit,$imgId);     // 记录数据库
    return 1;
}



function readUserData($link){

    $userID = isLogin($link);   // 判断是否登录，如果已登陆isLogin返回用户id
    if( !$userID ) return 0;    // 如果未登录直接return

    $sql = "SELECT * FROM `articles` WHERE `userID` = " . (int)$userID;
    $res = dbQuery($link,$sql);
    // return mysql_fetch_array($res);
    return $res;

}

