<?php
$data = json_decode(file_get_contents("php://input"));
$results = (object) [];
if (!is_object($data)) {
    $results->result = 0;
    exit(json_encode($results));
}
$where = 'WHERE 1';
$params = [];

if(isset($data->category) && $data->category !== '0'){
    $where.=' and category=? ';
    $params[] = $data->category;
}
$counter_params = $params;

$query = 'SELECT a.*,b.nick,c.page as page2 FROM articles a
left join user_infos b on a.user = b.user_id 
left join writers c on b.user_id = c.id
'.$where.' order by a.created_at desc limit ?,?';

$counter = 'SELECT count(id) as count FROM articles
'.$where;

if (isset($data->start) && isset($data->limit)) {
    $params[] = $data->start;
    $params[] = $data->limit;
} else {
    $params[] = 0;
    $params[] = 3; 
}
require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();
$mysqli = $sql->connect();
$m = $sql->get($mysqli, $query, $params, $counter,$counter_params);
exit(json_encode($m));
  
?>
 