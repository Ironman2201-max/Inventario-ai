<?php
// Permitir que Angular consulte este archivo sin problemas de CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json; charset=UTF-8");

// Configuración de la base de datos de XAMPP
$host = "localhost";
$db_name = "angular_auth_db"; 
$username = "root";
$password = ""; // En XAMPP viene vacío por defecto

try {
    $conexion = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexion->exec("set names utf8");
} catch(PDOException $exception) {
    echo json_encode(["error" => "Error de conexión: " . $exception->getMessage()]);
}
?>