<?php
$host = "localhost";
$user = "root";
$pass = ""; // The default password in XAMPP is empty
$dbname = "weather_app";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>