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
if (isset($data->users)) {
    if ($data->users ===6) {
        $where .= ' and user_type="0"';
    } else {
        $where .= ' and user_type LIKE CONCAT("%",?,"%")';
        $params[] = $data->users;
    }
}
if (isset($data->seen)) {
    $where.=' and seen=?';
    $params[] = $data->seen;
}
 
if (isset($data->date)) {
    $m = explode(' | ', $data->date);
    if (count($m)==2) {
        $where.=' and DATE(time) >= DATE(?) and DATE(time) <= DATE(?)';
        $params[] = $m[0];
        $params[] = $m[1];
    } else {
        $where.=' and DATE(time) = DATE(?)';
        $params[] = $m[0];
    }
}
$counter_params = $params;
if (isset($data->order)) {
    $m = array('type','type','time');
    $m2 = array('asc','desc');
    $m3 = explode(',', $data->order);
    $m5 = [];
    foreach ($m3 as $m4) {
        $m4 = explode(' ', $m4);
        $m5[]=$m[$m4[0]].' '.$m2[$m4[1]];
    }
    $order = ' ORDER BY '.implode(',', $m5);
} else {
    $order = ' ORDER BY time DESC';
}
  
if (isset($data->start) && isset($data->limit)) {
    $params[] = $data->start;
    $params[] = $data->limit;
} else {
    $params[] = 0;
    $params[] = 5;
}
$query = 'SELECT 
id, type, time 
FROM notifications
'.$where.$order.' LIMIT ?,?';
$counter = 'SELECT

count(id) as count

FROM notifications 
'.$where;
require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
 
$sql = new Sql();
$mysqli = $sql->connect();
$m = $sql->get($mysqli, $query, $params, $counter, $counter_params);
if ($m->result===0) {
    $m->result = -1;
}
exit(json_encode($m));
