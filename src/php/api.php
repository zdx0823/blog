<?php

$tmp = new stdClass();

$tmp->config = require_once $_SERVER['DOCUMENT_ROOT'].'/blog/src/php/config.php';
// $tmp->



// guide();




/**
 *
 */
class route{

    /**
     * 用于初始化的方法
     * @return [无] [无]
     */
    public function init(){
        $this->guide();
    }


    /**
     * 获取ajax请求设置的Content-Type类型，目前只有两种form或json
     * @return [字符串] [form或json]
     */
    public function get_content_type(){
        $res = isset( apache_request_headers()['Content-Type'] ) ? apache_request_headers()['Content-Type'] : null;
        $tip = [
            'application/x-www-form-urlencoded' => 'form',
            'application/json' => 'json'
        ];
        return  $tip[$res];
    }


    /**
     * 导向方法，根据Content-Type觉得执行哪个处理函数
     * @return [type] [description]
     */
    public function guide(){

        $request_type = get_content_type();
        if($request_type === 'form'){
            deal_form_request();
        }else if($request_type === 'json'){
            deal_json_request();
        }

    }


    public function deal_form_request(){
        return 2333;
        // $mod = isset($_REQUEST['mod']) ? $_REQUEST['mod'] : null;
        // $q = isset($_REQUEST['q']) ? $_REQUEST['q'] : null;
        // $start = isset($_REQUEST['start']) ? $_REQUEST['start'] : null;
        // $count = isset($_REQUEST['count']) ? $_REQUEST['count'] : null;


        // $obj = testData();
        // echo json_encode($obj);

    }


    public function deal_json_request(){

    }

}





$instance = new route();






/**
 * 用于测试
 * @return [对象] [返回测试数据对象]
 */
function testData(){

    $item = new stdClass();

    $item -> alt = 'http://localhost/blog/src/index.html#articledetail/b3ce43bee6e76092a0236a36a57da60a';
    $item -> alt_title = '';
    $item -> author = '蜜蜂老牛黄瓜';
    $item -> author_intro = '个性签名个性签名个性签名个性签名';
    $item -> author_profile = 'http://localhost/blog/src/img/profile/test.jpg';
    $item -> id = 'b3ce43bee6e76092a0236a36a57da60a';
    $item -> image = 'http://localhost/blog/src/img/thumb/test.jpg';
    $item -> images = new stdClass();
    $item -> images -> small = 'http://localhost/blog/src/img/thumb/test.jpg';
    $item -> images -> medium = 'http://localhost/blog/src/img/thumb/test.jpg';
    $item -> images -> large = 'http://localhost/blog/src/img/thumb/test.jpg';
    $item -> pubdate = '1546863883000';
    $item -> mdate = '1546863883000';
    $item -> title = '测试标题';
    $item -> like = '1000';


    $obj = new stdClass();
    $obj -> count = 5;
    $obj -> start = 0;
    $obj -> total = 5;
    $obj -> articles = [$item,$item,$item,$item,$item];

    return $obj;
}







