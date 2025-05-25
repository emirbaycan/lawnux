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
$m = $sql->get($mysqli, 'SELECT * FROM languages WHERE id=?',[$data->id]);
exit(json_encode($m));
 
?>