<?php
$data = json_decode(file_get_contents("php://input"));
$results = (object) [];
if (!is_object($data)) {
    $results->result = 0;
    exit(json_encode($results));
}
$query = 'SELECT a.page,b.nick FROM writers a inner join user_infos b on a.id = b.user_id
 order by a.created_at asc limit 1';
$params = [];
$counter = 'SELECT count(id) as count FROM writers
';

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();
$mysqli = $sql->connect();
$m = $sql->get($mysqli, $query, $params, $counter);
exit(json_encode($m));
 
?>
 