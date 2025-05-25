<?php

require '../auth.php';
 
$data = json_decode(file_get_contents("php://input"));
 
if (!isset($data->id)) {
    $results->result=0;
    exit(json_encode($results));
}
$user_id = $_SESSION['user_id'];
$id = $data->id;
$changes = ['name'];
$params = [];
$sets = [];

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();

foreach ($changes as $m) {
    if (isset($data->{$m})) {
        $m2 = $data->{$m};
        $params[] = $m2;
        $sets[] = $m.'=?';
    }
}

if (!count($sets)) {
    $results->result=0;
    exit(json_encode($results));
}

$params[] = $id;
$sets = implode(',', $sets);

$mysqli = $sql->connect();
$m = $sql->query($mysqli, 'UPDATE language SET '.$sets.' WHERE id=?', $params);
 