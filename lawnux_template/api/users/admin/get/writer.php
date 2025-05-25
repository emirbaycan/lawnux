<?php
require '../auth.php';

$data = json_decode(file_get_contents("php://input"));
$results = (object) [];
if (!is_object($data) ||!isset($data->id)) {
    $results->result = 0;
    exit(json_encode($results));
}  

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();
$mysqli = $sql->connect();
$m = $sql->get($mysqli, 'SELECT a.*,b.email,b.username,b.password,c.nick,c.image FROM writers a
inner join users b on a.id = b.id
inner join user_infos c on a.id = c.user_id WHERE a.id=?',[$data->id]);
exit(json_encode($m));

?>