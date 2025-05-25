<?php
$data = json_decode(file_get_contents("php://input"));
$results = (object) [];
if (!is_object($data)) {
    $results->result = 0;
    exit(json_encode($results));
}

$id = $data->id;

$where = 'WHERE user=?';
$params = [$id];

if(isset($data->category)){
    $where.=' and category=?';
    $params[] = $data->category;
} 

$query = 'SELECT a.*,b.nick,c.page as page2 FROM articles a
inner join user_infos b on a.user = b.user_id 
inner join writers c on b.user_id = c.id
'.$where.' order by a.created_at desc limit ?,?';

$counter = 'SELECT count(id) as count FROM articles '.$where;
$counter_params = $params;

if (isset($data->start) && isset($data->limit)) {
    $params[] = $data->start;
    $params[] = $data->limit;
} else {
    $params[] = 0;
    $params[] = 20;
}
require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();
$mysqli = $sql->connect();
$m = $sql->get($mysqli, $query, $params,$counter,$counter_params);
exit(json_encode($m));
 
?>
 