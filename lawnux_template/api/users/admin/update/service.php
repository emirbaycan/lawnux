<?php

require '../auth.php';
 
$data = json_decode(file_get_contents("php://input"));
 
if (!isset($data->id)) {
    $results->result=0;
    exit(json_encode($results));
}
$user_id = $_SESSION['user_id'];
$id = $data->id;
$changes = ['user','category','language','header','keywords','description','pre_content','content','content_json','visibility','created_at'];
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

if(isset($data->header)){
    $page = $sql->pageText($data->header);
    $sets[]='page=?'; 
    $params[]=$page;
}

if (isset($data->image) && $data->image==='1') {
    $sets[]='image=?'; 
    require $_SERVER['DOCUMENT_ROOT'].'/api/lib/file/File.php';
    $file = new File();
    $m = $file->move($user_id, '/temp/', '/img/services/', $id);
    if ($m->result!==1) {
        $results->log = $m->result;
        $results->result=-98;
        exit(json_encode($results));
    }
    $params[] = $m->filepath;
}

if (!count($sets)) {
    $results->result=0;
    exit(json_encode($results));
}

$params[] = $id;
$sets = implode(',', $sets);

$mysqli = $sql->connect();
$m = $sql->query($mysqli, 'UPDATE services SET '.$sets.' WHERE id=?', $params);

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/kalenux/Kalenux.php';
$kalenux = new Kalenux(); 

$m = $sql->get($mysqli, 'SELECT page FROM services WHERE id=?', [$id]);
$page = $m->data[0]['page'];

$post_data = (object)[];
$post_data->page = $page;

$m = $kalenux->get_template('service/service', $post_data);

$template = $m->text;

$path = '/service/'.$page.'.html';

$file_path = $_SERVER['DOCUMENT_ROOT'].$path;

$file = fopen($file_path,'w');
fwrite($file,$template);
fclose($file);
chmod($file_path, 0755);

$results->result = 1;
exit(json_encode($results));