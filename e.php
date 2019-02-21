<?php

$db = require_once('src/php/connectDb.php');

var_dump($db->table('user_extend_info')->item()['profile_path']);
