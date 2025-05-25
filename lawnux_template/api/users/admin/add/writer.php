<?php

require '../auth.php';

$results = (object) [];

$data = json_decode(file_get_contents("php://input"));

if (!is_object($data)) {    
    $results->result = 0;
    exit(json_encode($results));
}

$nick = $data->nick;

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();
$page = $sql->pageText($nick); 

$language = $data->language;
$keywords = $data->keywords;
$description = $data->description;

$email = $data->email;
$username = $data->username;
$password = password_hash($data->password,PASSWORD_BCRYPT);
$image = $data->image;
$instagram = $data->instagram;
$linkedin = $data->linkedin;
$youtube = $data->youtube;

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/file/File.php';
$file = new File();
$m = $file->move($user_id, '/temp/', '/img/writers/', $id);
if ($m->result!==1) {
    $results->result=-98;
    exit(json_encode($results));
}
$image = $m->filepath;
  
$mysqli = $sql->connect();

$m = $sql->insert_query($mysqli, 'INSERT INTO users 
(type,email,username,password,user_rank) VALUES 
(1,?,?,?,1)', 
[$email,$username,$password]);

$user_id = $m->id;

$m = $sql->query($mysqli, 'INSERT INTO user_infos 
(user_id,nick,image) VALUES 
(?,?,?)', 
[$user_id,$nick,$image]);

$m = $sql->query($mysqli, 'INSERT INTO writers 
(id,page,keywords,description,instagram,linkedin,youtube) VALUES 
(?,?,?,?,?,?,?)', 
[$user_id,$page,$keywords,$description,$instagram,$linkedin,$youtube]);

$type = 4;
$m = $sql->get($mysqli, 'SELECT name FROM folders WHERE type=? and language=?', [$type,$language]);
$folder_name = $m->data[0]['name'];

$m = $sql->get($mysqli, 'SELECT name FROM languages WHERE id=?', [$language]);
$language = $m->data[0]['name'];

$post_data = (object)[];
$post_data->page = $page;

$template = 'writer';
$path = '/'.$folder_name.'/'.$page.'.html';

require_once $_SERVER['DOCUMENT_ROOT'].'/api/lib/kalenux/Kalenux.php';
$kalenux = new Kalenux();
$m = $kalenux->get_template($template.'/'.$template, $post_data);
if ($m->result!==1) {
    $results->result = -5;
    exit(json_encode($results));
}

$page = $m->text;

$file_path = $_SERVER['DOCUMENT_ROOT'].$path;
$paths = explode('/',$path);
$mk_base = $_SERVER['DOCUMENT_ROOT'].'/';
foreach($paths as $dir ){
    $mk_base.=$dir.'/';
    if(!file_exists($mk_base) && !strpos($dir,'.')){
        mkdir($mk_base, 0777);
    }
}

if(file_exists($file_path)){
    unlink($file_path);
}

$file = fopen($file_path,'w');
fwrite($file,$page);
fclose($file);
chmod($file, 0744);

$results->log = $file_path;
$results->result = 1;
exit(json_encode($results));
