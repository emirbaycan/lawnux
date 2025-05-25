<?php
 
session_start();

$results = (object) [];

if (isset($_SESSION['application']) && !empty($_SESSION['application'])) {
    $application=$_SESSION['application'];
    $b = strtotime('-5 minute');
    $c = $application['time'];
    if ($c-$b>0 && $application['count']>2) {
        $results->result = -3;
        exit(json_encode($results));
    }
    if ($application['count']>10) {
        $b = strtotime('-60 minute');
        if ($c-$b>0) {
            $results->result = -4;
            exit(json_encode($results));
        } else {
            $application = ['time'=>time(),'count'=>0];
            $_SESSION['application']=$application;
        }
    }
} else {
    $application = ['time'=>time(),'count'=>0];
    $_SESSION['application']=$application;
}

$data = json_decode(file_get_contents("php://input"));

if (!is_object($data) ||
  !isset($data->fullname) ||
  !isset($data->phone)||
  !isset($data->email)||
  !isset($data->field)||
  !isset($data->cover_letter)||
  !isset($data->cv) ) {
    $application->time = time();
    $application->count = $application->count+1;
    $_SESSION['application']=$application;
    $results->result = 0;
    exit(json_encode($results));
}

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();

$fullname = $sql->saveText($data->fullname);
$phone = $sql->saveText($data->phone);
$email = $sql->saveText($data->email);
$field = $sql->saveText($data->field);
$cover_letter = $sql->saveText($data->cover_letter);
$cv = $data->cv;

if($cv!==0){
    require $_SERVER['DOCUMENT_ROOT'].'/api/lib/file/File.php';
    $file = new File();
    $m = $file->move($_SESSION['filename'], '/temp/', '/cvs/', $_SESSION['filename']);
    if($m->result!==1){
        exit(json_encode($m));
    }
    $cv = $m->filepath;
}

$mysqli = $sql->connect();
$m = $sql->query($mysqli, 'INSERT INTO applications (fullname,phone,email,field,cover_letter,cv) VALUES (?,?,?,?,?,?)', [$fullname,$phone,$email,$field,$cover_letter,$cv]);
$results = $m;
$results->log = [$fullname,$phone,$email,$field,$cover_letter,$cv];

$sql->close($mysqli);

$application->time = time();
$application->count = 0;
$_SESSION['application']=$application;

exit(json_encode($results));
