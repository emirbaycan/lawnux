<?php

session_start();

$results = (object) [];
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_rank']) ||
$_SESSION['user_rank']!==1) {
    $results->result = 0;
    $results->msg = 'Please relogin';
    exit(json_encode($results));
}

$user_id = $_SESSION['user_id'];
