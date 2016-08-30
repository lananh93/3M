<?php
$lines = $_POST['lines'];
$length = $_POST['length'];
$ideas  = $_POST['ideas'];
$name = $_POST['name'];
error_log($length);
$m = new MongoClient();
$db = $m->MMM;
$collection = $db ->lines;
$check = false;
for($i=0; $i<$length; $i++) {
    $point = array ('start' =>$lines[$i][0], 'end' =>$lines[$i][1], 'ideas' =>$ideas[$i], 'MMname'=>$name);
    if($collection->insert($point)) {
        $check = true;
    } else {
        $check = false;
    }
}
?>