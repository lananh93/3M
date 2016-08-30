<?php
session_start();

echo $_SESSION['user_name'];
echo $_SESSION['access_token'];
$access_token = $_SESSION['access_token'];

$my_site = 'http://192.168.0.156/MindMapMaker1/loginFb.php';

$url = 'https://www.facebook.com/logout.php?next=' . $my_site . '&access_token='.$access_token;
header('Location: '.$url);
session_unset();
session_destroy();
?>