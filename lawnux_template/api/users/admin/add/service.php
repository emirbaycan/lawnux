<?php

require '../auth.php';

$results = (object) [];

$data = json_decode(file_get_contents("php://input"));

if (!is_object($data) ||
  !isset($data->header)||
  !isset($data->keywords)||
  !isset($data->description)||
  !isset($data->pre_content)||
  !isset($data->image)||
  !isset($data->content)||
  !isset($data->content_json)||
  !isset($data->created_at)||
  !isset($data->visibility) ) {    
    $results->log = 'Missing variable';
    $results->result = 0;
    exit(json_encode($results));
}

$header = $data->header;

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();
$page = $sql->pageText($data->header); 
 
$data->page = $page;
$pre_content = $data->pre_content;
$image = $data->image;
$content = $data->content;
$content_json = $data->content_json;
$language = $data->language;
$created_at = $data->created_at;
$visibility = $data->visibility;
$keywords = $data->keywords;
$description = $data->description;

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/file/File.php';
$file = new File();
$m = $file->move($user_id, '/temp/', '/img/services/', $id);
if ($m->result!==1) {
    $results->log = [$m->result];
    $results->result=-98;
    exit(json_encode($results));
}
$image = $m->filepath;
 
$mysqli = $sql->connect();
$m = $sql->query($mysqli, 'INSERT INTO services (language,header,keywords,description,page,pre_content,image,content,content_json,created_at,visibility) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [$language,$header,$keywords,$description,$page,$pre_content,$image,$content,$content_json,$created_at,$visibility]);

if($m->result!==1){
    $results->log = [$language,$header,$keywords,$description,$page,$pre_content,$image,$content,$content_json,$created_at,$visibility];
    $results->result = $m->result;
    exit(json_encode($results));
}

$type=3;
$m = $sql->get($mysqli, 'SELECT name FROM folders WHERE type=? and language=?', [$type,$language]);
$folder_name = $m->data[0]['name'];

$m = $sql->get($mysqli, 'SELECT name FROM languages WHERE id=?', [$language]);
$language = $m->data[0]['name'];

$post_data = (object)[];
$post_data->page = $page;

$template = 'service';
$path = '/'.$folder_name.'/'.$page.'.html';

require_once $_SERVER['DOCUMENT_ROOT'].'/api/lib/kalenux/Kalenux.php';
$kalenux = new Kalenux();
$m = $kalenux->get_template($template.'/'.$template, $post_data);

if ($m->result!==1) {
    $results->result = -5;
    exit(json_encode($results));
}

$page_text = $m->text;

$file_path = $_SERVER['DOCUMENT_ROOT'].$path;
$paths = explode('/',$path);
$mk_base = $_SERVER['DOCUMENT_ROOT'].'/';
foreach($paths as $dir ){
    $mk_base.=$dir.'/';
    if(!file_exists($mk_base) && !strpos($dir,'.')){
        mkdir($mk_base, 0777);
    }
}

$file = fopen($file_path,'w');
fwrite($file,$page_text);
fclose($file);
chmod($file, 0744);

$results->result = 1;
exit(json_encode($results));

