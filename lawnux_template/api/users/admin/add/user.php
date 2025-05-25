<?php

require '../auth.php';

$results = (object) [];

$data = json_decode(file_get_contents("php://input"));

if (!is_object($data) ||
    !isset($data->user_rank) || 
    !isset($data->type) ||    
    !isset($data->email) || 
    !isset($data->username) || 
    !isset($data->nick)){
    $results->result = 0;
    exit(json_encode($results));
}

$user_rank = $data->user_rank; 
$type = $data->type; 
$email = $data->email;
$password = password_hash($data->password,PASSWORD_BCRYPT);
$username = $data->username; 
$nick = $data->nick; 
$created_at = $data->created_at; 
$image = $data->image;

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/file/File.php';
$file = new File();
$m = $file->move($user_id, '/temp/', '/img/services/', $id);
if ($m->result!==1) {
    $results->result=-98;
    exit(json_encode($results));
}
$image = $m->filepath;
 
require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();
$mysqli = $sql->connect();
$m = $sql->insert_query($mysqli, 'INSERT INTO users (user_rank,type,email,username,password) VALUES (?,?,?,?,?)', [$user_rank,$type,$email,$username,$password]);

if($m->result!==1){
    exit(json_encode($m));
}  
$id = $m->id;

$m = $sql->query($mysqli, 'INSERT INTO user_infos (id,nick,image) VALUES (?,?,?)', [$id,$nick,$image]);

exit(json_encode($m));