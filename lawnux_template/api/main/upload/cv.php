<?php
 
session_start();

$results = (object) [];

if (isset($_SESSION['cv']) && !empty($_SESSION['cv'])) {
    $cv=$_SESSION['cv'];
    $b = strtotime('-5 minute');
    $c = $cv['time'];
    if ($c-$b>0 && $cv['count']>2) {
        $results->result = -3;
        exit(json_encode($results));
    }
    if ($cv['count']>10) {
        $b = strtotime('-60 minute');
        if ($c-$b>0) {
            $results->result = -4;
            exit(json_encode($results));
        } else {
            $cv = ['time'=>time(),'count'=>0];
            $_SESSION['cv']=$cv;
        }
    }
} else {
    $cv = ['time'=>time(),'count'=>0];
    $_SESSION['cv']=$cv;
}

$file = $_FILES['file'];
if (!isset($file)) {
    $results->result=0;
    exit(json_encode($results));
}

$target_dir = '/temp/';
$filename = session_id().time();
$_SESSION['filename'] = $filename;
$max_size = 5*1024*1024;
$supported_formats = ['doc','docx','pdf'];

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/file/File.php';
$filer = new File();
$m = $filer->upload($file, $target_dir, $filename, $max_size, $supported_formats);
if($m->result!==1){
    $results->result=$m->result;
    exit(json_encode($results));
}

$results->result = 1;
$results->filename = $filename.'.'.$m->file_type;
exit(json_encode($results));