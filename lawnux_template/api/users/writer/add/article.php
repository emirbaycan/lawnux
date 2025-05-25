<?php

require '../auth.php';

$results = (object) [];

$data = json_decode(file_get_contents("php://input"));

if (!is_object($data) ||
  !isset($data->category) ||
  !isset($data->header)||
  !isset($data->keywords)||
  !isset($data->description)||
  !isset($data->keywords)||
  !isset($data->description)||
  !isset($data->pre_content)||
  !isset($data->content)||
  !isset($data->content_json) ) {    
    $results->result = 0;
    exit(json_encode($results));
}

$user = $_SESSION['user_id'];
$category = $data->category;
$header = $data->header;

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();
$page = $sql->pageText($data->header); 

$description = $data->description;
$keywords = $data->keywords;

$pre_content = $data->pre_content;
$content = $data->content;
$content_json = $data->content_json;

$sql = new Sql();
$mysqli = $sql->connect();
$params = [$user,$category,$header,$keywords,$description,$page,$pre_content,$content,$content_json];
$m = $sql->query($mysqli, 'INSERT INTO articles 
(user,category,header,keywords,description,page,pre_content,content,content_json) VALUES 
(?,?,?,?,?,?,?,?,?)', $params);

if($m->result!==1){
    $m->log = $params;
    exit(json_encode($m));
} 

$post_data = (object)[];
$post_data->page = $page;

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/kalenux/Kalenux.php';
$kalenux = new Kalenux(); 

$m = $kalenux->get_template('article/article', $post_data);

$template = $m->text;

$path = '/article/'.$page.'.html';

$file_path = $_SERVER['DOCUMENT_ROOT'].$path;

$file = fopen($file_path,'w');
fwrite($file,$template);
fclose($file);
chmod($file_path, 0755);

$results->result = 1;
exit(json_encode($results));