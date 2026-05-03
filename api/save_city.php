<?php
include 'db.php';

if (isset($_POST['city'])) {
    $city = $conn->real_escape_string(trim($_POST['city']));
    
    if (!empty($city)) {
        // Step 1: Delete the city if it already exists to avoid duplicates
        // and to prepare it for "jumping" to the top
        $conn->query("DELETE FROM search_history WHERE city_name = '$city'");
        
        // Step 2: Insert the city as a new record (it will get the latest ID)
        $conn->query("INSERT INTO search_history (city_name) VALUES ('$city')");
    }
}
?>