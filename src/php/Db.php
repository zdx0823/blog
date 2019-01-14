<?php

/**
 *
 */
class Db{

    public function table($table){
        $this->table = $table;
        $this->where = [];
        return $this;
    }

    public function where($where){
        $this->where = $where;
        return $this;
    }

    public function item(){

        $where = '';
        if(is_array($this->where)){
            foreach($this->where as $key => $value){
                $value = is_string($value) ? "'".$value."'" : $value;
                $where .= "`{$key}`={$value} and ";
            }
        }else{
            $where = $this->where;
        }

        $where = rtrim($where,' and');
        $where = $where == '' ? '' : "where {$where}";

        $sql = "SELECT * FROM `{$this->table}` {$where} limit 1";
        $pdo = new PDO('mysql:host=127.0.0.1;dbname=blog','root','root');
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return isset($res[0]) ? $res[0] : false;
    }

}




//测试
//
//
//
//

$Db = new Db();

$res = $Db->table('articles')->item();
echo '<pre>';
print_r($res);
