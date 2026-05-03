<?php
include 'db.php';

// بنجيب أحدث 10 مدن تم البحث عنهم
$result = $conn->query("SELECT city_name FROM search_history ORDER BY id DESC LIMIT 10");
$cities = array();
while ($row = $result->fetch_assoc()) {
    $cities[] = $row;
}

// بنحول البيانات لـ JSON عشان الجافاسكريبت تفهمها
header('Content-Type: application/json');
echo json_encode($cities);
?>