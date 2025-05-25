<?php

session_start();

$results = (object) [];

if (!isset($_SESSION['logged_in'])) {
    $results->result=0;
} else {
    $results->result=1;
}

exit(json_encode($results));
