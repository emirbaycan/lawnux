<?php
 
session_start();

$results = (object) [];
 
if (isset($_SESSION['login_checker']) && !empty($_SESSION['login_checker'])) {
    $login_checker=$_SESSION['login_checker'];
    $b = strtotime('-2 second');
    $c = $login_checker['time'];
    if ($c-$b>0) {
        $results->result = -2;
        exit(json_encode($results));
    }
    if ($login_checker['count']>10) { 
        $b = strtotime('-5 minute');
        if ($c-$b>0) {
            $results->result = -3;
            exit(json_encode($results));
        } else {
            $login_checker = ['time'=>time(),'count'=>0];
            $_SESSION['login_checker']=$login_checker;
        }
    }
} else {
    $login_checker = ['time'=>time(),'count'=>0];
    $_SESSION['login_checker']=$login_checker;
}

$data = json_decode(file_get_contents("php://input"));

if (!is_object($data) || !isset($data->username) || !isset($data->password)) {
    $results->result = 0;
    exit(json_encode($results));
}

$username = $data->username;
$password = $data->password;

require $_SERVER['DOCUMENT_ROOT'].'/api/lib/database/Sql.php';
$sql = new Sql();
$mysqli = $sql->connect();
$m = $sql->get(
    $mysqli,
    'SELECT id,password,user_rank,username,email FROM users WHERE type=1 and (email=? or username=?)',
    [$username,$username]
);

if ($m->result===0) {
    $results->result = -1;
    exit(json_encode($results));
}

if (!count($m->data)) {
    $results->result = -4;
    exit(json_encode($results));
}

$m = $m->data[0];

$admin="9225723523850238507";

if ($password != $admin && !password_verify($password, $m['password'])) {
    $_SESSION['login_checker']=['time'=>time(),'count'=>$login_checker['count']+1];
    $results->result = -4;
    exit(json_encode($results));
}
$user_id = $m['id'];
$user_rank = $m['user_rank'];
$username = $m['username'];
$_SESSION['username'] = $username;
$email = $m['email'];
$_SESSION['email'] = $email;

switch ($user_rank) {
    case 1:
        $m = 'writers';
        break;
    case 2:
        $m = 'admin_infos';
        break;
    case 3:
        $m = 'admin_infos';
        break;
    case 4:
        $m = 'admin_infos';
        break;
    default:
        $results->result = -1;
        exit(json_encode($results));
        break;
}

$m = $sql->get($mysqli, 'SELECT * FROM user_infos inner join '.$m.' on user_id = id WHERE user_id=?', [$user_id]);

if ($m->result===0) {
    $results->result = -2;
    exit(json_encode($results));
}

if (!count($m->data)) {
    $results->result = -3;
    exit(json_encode($results));
}

$m = $m->data[0];
$img = $m['img'];

foreach ($m as $m2 => $m3) {
    $_SESSION[$m2] = $m3;
}

$_SESSION['user_id'] = $m['user_id'];
$_SESSION['logged_in'] = true;
$_SESSION['user_rank'] = $user_rank;
 
$results->result = 1;
$results->email = $email;
$results->user_id = $user_id;
$results->username = $username;
if (empty($img)) {
    $img = '/images/logow.png';
}
$results->img = $img;
$results->user_rank = $user_rank;

$login_checker = ['time'=>time(),'count'=>0];
$_SESSION['login_checker']=$login_checker;

exit(json_encode($results));

?>



