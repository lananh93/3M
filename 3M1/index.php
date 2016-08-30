<?php
session_start();

$app_id = "1682366585349308";
$app_secret = "03ed4a3bd521acee4bebd85ed8da2893";
$redirect_uri = urlencode("http://192.168.0.156/MindMapMaker1/index.php");
$user_name;
// Get code value
$code = $_GET['code'];
// Từ giá trị của code sẽ lấy ra được access token để truy cập vào thông tin người dùng bằng cách gọi một HTTP Get request đến địa chỉ
// Get access token info
$facebook_access_token_uri = "https://graph.facebook.com/oauth/access_token?client_id=$app_id&redirect_uri=$redirect_uri&client_secret=$app_secret&code=$code";

if(!isset($_SESSION['user_name'])){
    $ch = curl_init(); // tạo mới 1 curl
    curl_setopt($ch, CURLOPT_URL, $facebook_access_token_uri); // cấu hình cho curl //
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

    $response = curl_exec($ch); // execute cURL session
    curl_close($ch); // ngắt

    // Get access token
    $access_token = str_replace('access_token=', '', explode("&", $response)[0]);

    // Get user infomation by graph api
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://graph.facebook.com/me?access_token=$access_token");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

    $response = curl_exec($ch);
    curl_close($ch);

    $user = json_decode($response);
    // Log user in
    $_SESSION['user_login'] = true;
    $_SESSION['user_name'] = $user->name;
    $_SESSION['access_token'] = $access_token;
    $user_name = $_SESSION['user_name'];
    echo $access_token;
}
else{
    // echo  $_SESSION['user_name'];
}
?>
<html>
<head>
    <meta charset="utf-8" />
    <title> Mind Map Maker</title>
    <link rel="stylesheet" href="style.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script type="text/javascript" src = "main.js"></script>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">


</head>
<body>
<div class="top">
    <h2> Welcome <?php echo $_SESSION['user_name'] . " !";?></h2>
    <a id="logout" href="logoutFb.php"><img src="logout1.png" width="255px"></a>
</div>
<div class = "wrapper">
    <canvas id="canvas"></canvas>
</div>
<div id="buttonWrapper">
    <button type="button" class="btn btn-primary btn-sm" id = "plus" ><span class="glyphicon glyphicon-zoom-in"></span> Zoom in</button>
    <button type="button" class="btn btn-primary btn-sm" id ="minus" ><span class="glyphicon glyphicon-zoom-out"></span> Zoom out</button>
    <button class="btn btn-danger btn-sm" id ="view"><span class="glyphicon glyphicon-search"></span> View Mode</button>
    <button id="edit" class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-pencil"></span> Edit Mode</button>
    <button class="btn btn-primary btn-sm" id="clear"><span class="glyphicon glyphicon-remove-sign"></span> Clear</button>
    <button class="btn btn-success btn-sm" id="save"><span class="glyphicon glyphicon-save"></span> Save</button>
    <button class="btn btn-primary btn-sm" id="undo"><span class="glyphicon glyphicon-arrow-left"></span> Undo</button>
    <div id="sideBar">
        <button class="btn btn-primary btn-sm" id="newproject">New Project</button>
    </div>
</div>

</body>
</html>