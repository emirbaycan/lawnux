<?php
 
require '../auth.php';

$data = json_decode(file_get_contents("php://input"));
 
$file = $_FILES['file'];
if (!isset($file)) {
    $results->result=-1;
    exit(json_encode($results));
}

$target_dir = '/temp/';
$user_id = $_SESSION['user_id'];
$max_size = 10*1024*1024;
$supported_formats = ['png','jpg','jpeg','doc','docx','pdf'];

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/file/File.php';
$filer = new File();
$filer = $filer->upload(
    $file, $target_dir, $user_id, $max_size, $supported_formats);

if($filer->result!==1){
    $results->result = $filer->result;
    $results->log = $filer->log;
    exit(json_encode($results));
}

$results->result = 1;
$results->filename = $user_id.'.'.$filer->file_type;
exit(json_encode($results));