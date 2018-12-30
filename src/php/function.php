<?php
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
function addArticle($link,$userID,$articleID){

    $sql = "INSERT articles(`userID`,`articleID`,`updateDate`) VALUES
    (".$userID.",'".$articleID."','".date('Y-m-d H:i:s')."')";
    return dbQuery($link,$sql);

}


/**
 * 覆盖已有文件的内容
 * @param  [字符串] $fileName [文件名]
 * @param  [字符串] $data     [json数据]
 * @return [无]           [无]
 */
function ediFile($fileName,$data){

    // 写入方式打开，并将文件清空为零
    $handle = fopen($fileName,'wb');
    fwrite($handle, $data);
    fclose($handle);

}


/**
 * 响应添加文章的操作
 * @param  [对象] $link [数据库标识符]
 * @return [无]       [无]
 */
/*function responseAddEvent($link){

    $userID = isLogin($link);
    if(!$userID) return;

    // 将json数据写入一个字符串内
    $data = file_get_contents('php://input');

    static $fileName = null;

    if( !isset($fileName) ){

        // 生成唯一的文件名
        $uuid = md5( uniqid( microtime().mt_rand() ) );
        $fileName = ('../data/articles/'.$uuid);
        // 调用函数
        file_put_contents($fileName,$data);
        addArticle($link,$userID,$uuid);

    }

}*/



/**
 * 响应添加文章的操作，利用session实现临时保存的功能
 * @param  [对象] $link [数据库标识符]
 * @return [无]       [无]
 */
function edi_save($link){

    // 将json数据写入一个字符串内
    $data = file_get_contents('php://input');

    $_SESSION['ediData'] = $data;

}


/**
 * 用于重置按钮，将SESSION中ediData的数据清空
 * @return [无] [无]
 */
function edi_reset(){

    $_SESSION['ediData'] = '';

}



/**
 * 将session中的数据保存成一个文件并在数据库做一条记录
 * @param  [对象] $link [数据库标识符]
 * @return [无]       [无]
 */
function edi_saveAndclose($link){

    $userID = isLogin($link);
    // 生成唯一的文件名
    $uuid = md5( uniqid( microtime().mt_rand() ) );
    $fileName = ('../data/articles/'.$uuid);
    // 调用函数
    file_put_contents($fileName,$_SESSION['ediData']);
    addArticle($link,$userID,$uuid);

}



