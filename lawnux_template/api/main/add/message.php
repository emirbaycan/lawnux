<?php
 
session_start();

$results = (object) [];

if (isset($_SESSION['send_message']) && !empty($_SESSION['send_message'])) {
    $send_message=$_SESSION['send_message'];
    $b = strtotime('-5 minute');
    $c = $send_message['time'];
    if ($c-$b>0 && $send_message['count']>2) {
        $results->result = -3;
        exit(json_encode($results));
    }
    if ($send_message['count']>10) {
        $b = strtotime('-60 minute');
        if ($c-$b>0) {
            $results->result = -4;
            exit(json_encode($results));
        } else {
            $send_message = ['time'=>time(),'count'=>0];
            $_SESSION['send_message']=$send_message;
        }
    }
} else {
    $send_message = ['time'=>time(),'count'=>0];
    $_SESSION['send_message']=$send_message;
}

$data = json_decode(file_get_contents("php://input"));

if (!is_object($data) ||
 !isset($data->fullname) ||
  !isset($data->email)||
  !isset($data->message) ) {
    $send_message->time = time();
    $send_message->count = $send_message->count+1;
    $_SESSION['send_message']=$send_message;
    $results->result = 0;
    exit(json_encode($results));
}

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();

$fullname = $sql->saveText($data->fullname);
$email = $sql->saveText($data->email);
$phone = $sql->saveText($data->phone);
$message = $sql->saveText($data->message);

$mysqli = $sql->connect();
 
$m = $sql->insert_query($mysqli, 'INSERT INTO contact (fullname,email,phone,message) VALUES (?,?,?,?)', [$fullname,$email,$phone,$message]);
$id = $m->id;
 
if (!empty($_SERVER["HTTP_CLIENT_IP"]))
{
    $ip = $_SERVER["HTTP_CLIENT_IP"];
}
elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"]))
{
    $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
}
else
{
    $ip = $_SERVER["REMOTE_ADDR"];
} 

$geo = unserialize(file_get_contents("http://www.geoplugin.net/php.gp?ip=$ip"));
$country = $geo["geoplugin_countryName"];
$city = $geo["geoplugin_city"];
$user_agent = $_SERVER['HTTP_USER_AGENT'];

$m = $sql->query($mysqli, 'INSERT INTO contact_infos (id,ip,country,city,user_agent) VALUES (?,?,?,?,?)', [$id,$ip,$country,$city,$user_agent]);
$results = $m;

$sql->close($mysqli);

$send_message->time = time();
$send_message->count = $send_message->count = 0;
$_SESSION['send_message']=$send_message;

exit(json_encode($results));
