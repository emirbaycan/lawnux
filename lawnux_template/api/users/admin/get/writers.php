<?php
/*
    0:user_id
    1:customer
    2:booster
    3:admin
    4:account_seller
    5:mod
*/
require '../auth.php';
 
$data = json_decode(file_get_contents("php://input"));
 
$user_id=$_SESSION['user_id'];
$where = 'WHERE 1';
$params = []; 
 
if (isset($data->search)) {
    $m = array('name','page','email','instagram','linkedin','youtube');
    $m4 = $data->search;
    foreach ($m as $m2) {
        $m3[] = $m2.' LIKE CONCAT("%",?,"%")';
        $params[] = $m4;
    }
    $where .= ' and ('.implode(' or ', $m3).' )';
}

if (isset($data->date)) {
    $m = explode(' | ', $data->date);
    if (count($m)==2) {
        $where.=' and DATE(created_at) >= DATE(?) and DATE(created_at) <= DATE(?)';
        $params[] = $m[0];
        $params[] = $m[1];
    } else {
        $where.=' and DATE(created_at) = DATE(?)';
        $params[] = $m[0];
    }
}
$counter_params = $params;
if (isset($data->order)) {
    $m = array('b.email','b.username','c.nick','a.instagram','a.linkedin','a.youtube','b.created_at','id');
    $m2 = array('asc','desc');
    $m3 = $data->order;
    $m5 = [];
    foreach ($m3 as $m4=>$m6) {
        $m5[]=$m[$m4].' '.$m2[$m6];
    }
    $order = ' ORDER BY '.implode(',', $m5);
} else {
    $order = ' ORDER BY created_at DESC';
}
  
if (isset($data->start) && isset($data->limit)) {
    $params[] = $data->start;
    $params[] = $data->limit;
} else {
    $params[] = 0;
    $params[] = 5;
}
$query = 'SELECT 
a.id,a.page,a.instagram,a.linkedin,a.youtube,b.email,b.username,b.created_at,c.nick,c.image
FROM writers a inner join users b on a.id = b.id inner join user_infos c on a.id = c.user_id
'.$where.$order.' LIMIT ?,?';
$counter = 'SELECT

count(a.id) as count

FROM writers a
'.$where;
require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
 
$sql = new Sql();
$mysqli = $sql->connect();
$m = $sql->get($mysqli, $query, $params, $counter, $counter_params);
if ($m->result===0) {
    $m->result = -1;
}
exit(json_encode($m));
