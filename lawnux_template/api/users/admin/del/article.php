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
$m = $sql->delete($mysqli, 'articles', 'id=?', [$data->id]);

$m = $sql->get($mysqli, 'SELECT page,language FROM articles WHERE id=?',[$id]);
$m = $m->data[0];
$page = $m['page']; 
$language = $m['language']; 

$template = 'article';
$type = 2; 

$m = $sql->get($mysqli, 'SELECT name FROM folders WHERE type=? and language=?', [$type,$language]);
$folder_name = $m->data[0]['name'];

$m = $sql->get($mysqli, 'SELECT language FROM news WHERE id=?',[$id]);
$language = $m->data[0]['language'];

$data = (object)[];
$post_data->page = $page;

$path = '/'.$folder_name.'/'.$page.'.html';

rmdir($_SERVER['DOCUMENT_ROOT'].$path);
exit(json_encode($m));
 
?>
 