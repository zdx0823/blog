<?php
$db = require_once('connectDb.php');


/**
 * RSA密钥类
 */
class BuildRSA{

	// 用于生成公私钥
	public function build_key(){
		// 用于微调的配置参数
		$config = array(
			"config" => "f:\phpStudy\PHPTutorial\Apache\conf\openssl.cnf",
		    "digest_alg" => "sha512",
		    "private_key_bits" => 1024,
		    "private_key_type" => OPENSSL_KEYTYPE_RSA,
		);
		// 生成密钥对
		$res=openssl_pkey_new($config);
		// 取得私钥
		$privkey;
		openssl_pkey_export($res, $privkey,null,$config );
		// 私钥存入SESSION
		$_SESSION['privkey'] = $privkey;
		// 取得公钥
		$pubkey=openssl_pkey_get_details($res);
		$pubkey=$pubkey["key"];
		// 公钥存入SESSION
		$_SESSION['pubkey'] = $pubkey;
		// 存进对象的私有变量里
		$this->privkey = $privkey;
		$this->pubkey = $pubkey;
		return $this;
	}

	// 获取公钥
	public function getPubkey(){
		return $_SESSION['pubkey'];
	}

	// 获取私钥
	public function getPrikey(){
		return $_SESSION['privkey'];
	}

	// 用私钥解密
	public function decrypt_by_pri($data){
		if(ctype_xdigit($data)){
			$data2 = pack('H*',$data);
		}

		$privkey = $this->getPrikey();
		openssl_private_decrypt($data2, $res, $privkey);
		return $res;
	}


	// 用私钥加密
	public function encrypt_by_pri($data){
		$privkey = $_SESSION['privkey'];
		openssl_private_encrypt($data, $res, $privkey);
		return $res;
	}

	// 用公钥解密
	public function decrypt_by_pub($data){
		$pubkey = $_SESSION['pubkey'];
		openssl_public_decrypt($data, $res, $pubkey);
		return $res;
	}

	// 用公钥加密
	public function encrypt_by_pub($data){
		$pubkey = $_SESSION['pubkey'];
		openssl_public_encrypt($data, $res, $pubkey);
		return $res;
	}

	// 生成数据的数字签名
	public function bulid_digital_sign($data){
		$digest = md5($data);
		return $this->encrypt_by_pri($digest);
	}

}


class TheKey extends BuildRSA{

	function __construct(){
		session_start();

		// 设置每10分钟创建一对新的密钥
		// 判断密钥是否存在且存在时间超过10分钟
		$on_off = isset($_SESSION['c_key']) && !(($_SESSION['c_key']-time())>600);

		if(!$on_off){
			$this->ins_RSA = new BuildRSA;
			$this->ins_RSA->build_key();
			$this->c_key = $_SESSION['c_key'] = time();
		}
		$this->pri_key = $_SESSION['privkey'];
		$this->pub_key = $_SESSION['pubkey'];
	}

}

/*
	已登录的类
 */
class Logged{
	/**
	 * 拉取数据
	 * @return [type] [description]
	 */
	function pullUserInfo(){
		$tmp = new stdClass;
		$tmp->username = $_SESSION['username'];
		$tmp->profile_path = $_SESSION['profile_path'];
		$tmp = json_encode($tmp);
		$this->return_value = $tmp;
	}
}

class Register extends TheKey{


	/**
	 * 获取公钥并存入$this->return_value属性里
	 * @return [type] [description]
	 */
	function getPublickey(){
		$this->return_value = $this->pub_key;
	}
	/**
	 * 解密和分离数据
	 * @return [无] [无]
	 */
	private function decryptAndSplit(){
		$this->return_value = false;
		$info = $_POST['user_info'];	// 接收无间隔的十六进制字符串
		// 解密得到以分号分隔的字符串，第一段是账号id和密码，前32位是账号id后32位是密码，
		// 第二段是邮箱，明文
		// 第三段是用户名
		// 第四段是邮箱验证码，明文
		$res_str = $this->decrypt_by_pri($info);
		// 将解密后的信息以分号分开
		$res_arr = explode(';',$res_str);
		// 分离账号id和密码的md5值，如果只有一个则为账号
		$res_user_pass = str_split($res_arr[0],32);
		// 存储账号id、密码、邮箱在对象属性里
		$this->user_id = isset($res_user_pass[0]) ? $res_user_pass[0] : null;
		$this->user_pass = isset($res_user_pass[1]) ? $res_user_pass[1] : null;
		$this->user_email = isset($res_arr[1]) ? $res_arr[1] : null;
		$this->username = isset($res_arr[2]) ? $res_arr[2] : null;
		$this->user_email_code = isset($res_arr[3]) ? $res_arr[3] : null;

		return $this->return_value = true;
	}

	/**
	 * 判断邮箱是否存在
	 * @return 无 [无]
	 */
	function isEmailExist(){
		global $db;
		if($this->decryptAndSplit()){
			$res = $db->table('user_basic_info')->where(['email'=>$this->user_email])->item();
			return $this->return_value = $res ? 'exist' : 'unexist';
		}
	}

	/**
	 * 判断账号是否存在
	 * @return 无 [无]
	 */
	function isAccountExist(){
		global $db;
		if($this->decryptAndSplit()){
			$res = $db->table('user_basic_info')->where(['user_id'=>$this->user_id])->item();
			return $this->return_value = $res ? 'exist' : 'unexist';
		}
	}


	/**
	 * 判断验证码是否正确
	 * @return 无 [无]
	 */
	function isEmailCodeExist(){
		global $db;
		if($this->decryptAndSplit()){
			$pass1 = $this->user_email_code == $_SESSION['user_email_code'];
			$pass2 = (time()-$_SESSION['user_email_code_timeout']) < 60;
			$this->return_value = ($pass1&&$pass2) ? true : '验证码错误';
		}
	}


	/**
	 * 向数据库写入注册数据
	 * @return [无] [无]
	 */
	function enroll(){

		global $db;
		$this->return_value = $this->decryptAndSplit();
		$pass = $this->isAccountExist() == 'exist' ? false : true;

		if( $pass ){

			if($this->return_value){
				$res = $db->table('user_basic_info')->insert([
					'user_id'=>$this->user_id,
					'password'=>$this->user_pass,
					'username'=>$this->username,
					'email'=>$this->user_email
				]);
				$this->return_value = $res ? true : false;
			}

		}else{
			$this->return_value = '账号被抢先注册，请尝试别的账号';
			return;
		}

	}

	/**
	 * 生成随机数字，调用sendMail函数发送验证码
	 * @return [type] [description]
	 */
	function sendVeriCode(){
		$this->return_value = $this->decryptAndSplit();
		$code = mt_rand(100000,999999);
		$html = "<h2>您的验证码为：<span style=\"color: red\">{$code}</span>，如非本人操作请无视</h2>";
		if($this->sendMail('验证码',$html,$this->user_email)){
			$this->return_value = true;
			$_SESSION['user_email_code'] = $code.'';
			$_SESSION['user_email_code_timeout'] = time();
		}else{
			$this->return_value = false;
		}
	}

	/**
	 * 生成并发送有邮件
	 * @param  [字符串] $subject  [邮件主体]
	 * @param  [字符串] $body     [邮件主体]
	 * @param  [字符串] $receiver [收件人]
	 * @return [布尔值]           [成功返回true否则返回false]
	 */
	private function sendMail($subject,$body,$receiver){
		// 引入PHPMailer的核心文件
		include_once("rely/Exception.php");
		include_once("rely/PHPMailer.php");
		include_once("rely/SMTP.php");

		$mail = new PHPMailer();		// 实例化PHPMailer核心类
		$mail->SMTPDebug = 0;			// 是否启用smtp的debug进行调试,0为不开启
		$mail->isSMTP();				// 使用smtp鉴权方式发送邮件
		$mail->SMTPAuth = true;			// smtp需要鉴权 这个必须是true	
		$mail->Host = 'smtp.163.com';	// 链接域名邮箱的服务器地址	
		$mail->SMTPSecure = 'ssl';		// 设置使用ssl加密方式登录鉴权	
		$mail->Port = 465;				// 设置ssl连接smtp服务器的远程服务器端口号	
		$mail->CharSet = 'UTF-8';		// 设置发送的邮件的编码	
		$mail->FromName = '蜜蜂老牛黄瓜';		// 设置发件人昵称	
		$mail->Username = '15916965182@163.com';	// smtp登录的账号	
		$mail->Password = 'b23702f1843cb13d';		// smtp登录的授权码	
		$mail->From = '15916965182@163.com';		// 设置发件人邮箱地址 同登录账号	
		$mail->isHTML(true);						// 邮件正文是否为html编码 注意此处是一个方法	
		$mail->addAddress($receiver);		// 设置收件人邮箱地址		
		$mail->Subject = $subject;					// 添加该邮件的主题	
		$mail->Body = $body;						// 添加邮件正文	
		return $mail->send();						// 发送邮件 返回状态，布尔值
	}


	// 暂时用不到
	// function getVeriCode(){
	// 	$this->return_value = $this->veriCode(6);
	// }
	// private function veriCode($num){
	// 	$str = 'abcdefghijklmnopqrstuvwxyz';
	// 	$strs = '';
	// 	for($i=0;$i<$num;$i++){
	// 		if(mt_rand(0,1)){
	// 			$strs.=((mt_rand().'')[0]);
	// 		}else{
	// 			$strs.=$str[mt_rand(0,25)];
	// 		}
	// 	}
	// 	return $strs;
	// }
}


class User_api extends Register{
	// 返回给前端的值，User_api通过判断post提交的数据是否有user_action字段来觉得是否允许执行
	// user_action字段的值即为相关方法的方法名，User_api通过这个判断该执行哪个方法
	// 每个方法的方法体最后都应该有$this->return_value来将相关值存储
	// 再通过execute方法echo给前端
	public $return_value;
	function is_post(){
		return empty($_POST['user_action']);
	}
	function exCommand(){
		$res = false;
		if($com=method_exists($this,$_POST['user_action'])){
			$tmp = $_POST['user_action'];
			$this->$tmp();
			$res = true;
		}
		return $res;
	}
	function execute(){

		if($this->is_post()) return false;
		$res = false;
		if($this->exCommand()){
			$res = $this->return_value;
		}
		echo $res;
	}

}


$user_api = new User_api;
$user_api->execute();



// var_dump(session_start());


// var_dump(time());