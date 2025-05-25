<?php

require '../auth.php';
 
$data = json_decode(file_get_contents("php://input"));
 
if (!isset($data->id)) {
    $results->result=0;
    exit(json_encode($results));
}
$user_id = $_SESSION['user_id'];
$id = $data->id;
$changes = ['keywords','description','instagram','linkedin','youtube','visibility','created_at'];
$params = [];
$sets = [];

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();
$mysqli = $sql->connect();

foreach ($changes as $m) {
    if (isset($data->{$m})) {
        $m2 = $data->{$m};
        $params[] = $m2;
        $sets[] = $m.'=?';
    }
}

if(isset($data->nick)){
    $page = $sql->pageText($data->nick);
    $sets[]='page=?'; 
    $params[]=$page;
}

if (count($sets)) {
    $params[] = $id;
    $sets = implode(',', $sets);
   
    $m = $sql->query($mysqli, 'UPDATE writers SET '.$sets.' WHERE id=?', $params);
}

$changes = ['email','username'];
$params = [];
$sets = [];

foreach ($changes as $m) {
    if (isset($data->{$m})) {
        $m2 = $data->{$m};
        $params[] = $m2;
        $sets[] = $m.'=?';
    }
}

if(isset($data->password)){
    $password = password_hash($data->password,PASSWORD_BCRYPT);
    $sets[]='password=?'; 
    $params[]=$password;
}

if (count($sets)) {
    $params[] = $id;
    $sets = implode(',', $sets);
    $m = $sql->query($mysqli, 'UPDATE users SET '.$sets.' WHERE id=?', $params);
}

$changes = ['nick'];
$params = [];
$sets = [];

foreach ($changes as $m) {
    if (isset($data->{$m})) {
        $m2 = $data->{$m};
        $params[] = $m2;
        $sets[] = $m.'=?';
    }
}

if (isset($data->image) && $data->image==='1') {
    $sets[]='image=?'; 
    require $_SERVER['DOCUMENT_ROOT'].'/api/lib/file/File.php';
    $file = new File();
    $m = $file->move($user_id, '/temp/', '/img/writers/', $id);
    if ($m->result!==1) {
        $results->result=-98;
        exit(json_encode($results));
    }
    $params[] = $m->filepath;
}

if (count($sets)) {
    $params[] = $id;
    $sets = implode(',', $sets);
    $m = $sql->query($mysqli, 'UPDATE user_infos SET '.$sets.' WHERE user_id=?', $params);
}


require $_SERVER['DOCUMENT_ROOT'].'/api/lib/kalenux/Kalenux.php';
$kalenux = new Kalenux(); 

$m = $sql->get($mysqli, 'SELECT page FROM writers WHERE id=?', [$id]);
$page = $m->data[0]['page'];

$post_data = (object)[];
$post_data->page = $page;

$m = $kalenux->get_template('writer/writer', $post_data);

$template = $m->text;

$path = '/writer/'.$page.'.html';

$file_path = $_SERVER['DOCUMENT_ROOT'].$path;

$file = fopen($file_path,'w');
fwrite($file,$template);
fclose($file);
chmod($file_path, 0755);

$results->result = 1;
exit(json_encode($results));