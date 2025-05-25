<?php
$data = json_decode(file_get_contents("php://input"));
$results = (object) [];
$query = 'SELECT * FROM services 
WHERE visibility=1 order by created_at desc limit ?,?';
$params = [];
$counter = 'SELECT count(id) as count FROM services 
WHERE visibility=1 ';
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
$m = $sql->get($mysqli, $query, $params, $counter);
exit(json_encode($m));
 
?>
