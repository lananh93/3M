<?php
session_start();
$m = new MongoClient();
$db = $m ->MMM;
$collection = $db->$_POST['collection'];


$result = $collection->drop();
$mindmap = array();
foreach ($result as  $value) {
    $mindmap[] = $value;
}
echo json_encode($mindmap);
?>