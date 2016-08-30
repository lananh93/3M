<?php
session_start();

$lines = $_POST['lines'];
$length = $_POST['length'];
$ideas = $_POST['ideas'];
$name = $_POST['name'];

$_SESSION['collection'] = $name;
// $_SESSION['username'] = 'admidssfneerwe';

error_log($length);
$m = new MongoClient();
$db = $m->MMM;

$collection = $db ->$name;
$check = false;
for($i=0; $i<$length; $i++) {
    $point = array ('start' =>$lines[$i][0], 'end' =>$lines[$i][1], 'ideas' =>$ideas[$i],'MMname' => $name);
    if($collection->insert($point)) {
        $check = true;
    } else {
        $check = false;
    }
}
if($check) {
    echo json_encode("true");
} else {
    echo json_encode("false");
}



?>