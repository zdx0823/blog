<?php
$config = array(
	"config" => "f:\phpStudy\PHPTutorial\Apache\conf\openssl.cnf",
    "digest_alg" => "sha512",
    "private_key_bits" => 1024,
    "private_key_type" => OPENSSL_KEYTYPE_RSA,
);

// // 生成密钥对
// $res=openssl_pkey_new($config);

// // 取得私钥保存在$privkey，第三个参数表示使用口令保护，我也不懂
// $privkey;
// openssl_pkey_export($res, $privkey,"zdx",$config );

// // 取得公钥,openssl_pkey_get_details取得的是一个很详细的数组，其中包括了计算欧拉函数用到的随机码，其中key键对应的字符串就是公钥的字符串形式
// $pubkey=openssl_pkey_get_details($res);
// $pubkey=$pubkey["key"];

// $data = "云想月赏花想容";
// $seal_data;
// // 使用$pubkey(公钥)加密，加密后的数据存放在$seal_data(seal:密封)中。注：加密后的数据直接打印可能是乱码
// openssl_seal($data, $seal_data, $ekeys, array($pubkey));

// // 解密
// $privkey = openssl_pkey_get_private($privkey,'zdx');
// openssl_open($seal_data, $open_data, $ekeys[0], $privkey );

// var_dump($open_data);


// openssl_pkey_get_public


$reso = openssl_pkey_new($config);
openssl_pkey_export($reso,$prikey,null,$config);
$pubkey = openssl_pkey_get_details($reso)['key'];


/*
openssl_private_decrypt — 使用私钥解密数据
openssl_private_encrypt — 使用私钥加密数据
openssl_public_decrypt — 使用公钥解密数据
openssl_public_encrypt — 使用公钥加密数据
 */

// openssl_public_encrypt('abc',$seal_data,$pubkey);
// openssl_private_decrypt($seal_data,$ress,$prikey);

// openssl_private_encrypt('测试测试',$seal_data,$prikey);
// openssl_public_decrypt($seal_data,$ress,$pubkey);

$pub = openssl_pkey_get_public($res_key_arr[0]);

openssl_seal('abc',$res,$res_key_arr,[$pubkey]);
openssl_seal($res,$ori,$pub,[$prikey]);

var_dump($res);
