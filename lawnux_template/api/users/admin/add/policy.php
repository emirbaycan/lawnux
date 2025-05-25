<?php

require '../auth.php';

$results = (object) [];

$data = json_decode(file_get_contents("php://input"));

$header = $data->header;

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();
$page = $sql->pageText($data->header); 
  
$pre_content = $data->pre_content;
$content = $data->content;
$content_json = $data->content_json; 
$created_at = $data->created_at;
$visibility = $data->visibility; 
 
$mysqli = $sql->connect();

$m = $sql->query($mysqli, 'INSERT INTO policies 
(header,page,pre_content,content,content_json,visibility,created_at) VALUES
(?,?,?,?,?,?,NOW())', 
[$header,$page,$pre_content,$content,$content_json,$visibility]);

if($m->result!==1){
  $results->result = $m->result;
  exit(json_encode($results));
}

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/kalenux/Kalenux.php';
$kalenux = new Kalenux(); 
$kalenux->update_page($sql,$mysqli,'policies');

$post_data = (object)[];
$post_data->page = $page;

$m = $kalenux->get_template('policy/policy', $post_data);

$template = $m->text;

$path = '/policy/'.$page.'.html';

$file_path = $_SERVER['DOCUMENT_ROOT'].$path;

$file = fopen($file_path,'w');
fwrite($file,$template);
fclose($file);
chmod($file_path, 0755);

$results->result = 1;
exit(json_encode($results));

