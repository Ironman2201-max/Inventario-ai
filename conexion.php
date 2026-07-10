<?php
// Configuración de la base de datos de XAMPP / VPS
$host = "localhost";
$username = "root";
$password = ""; // En XAMPP viene vacío por defecto
$db_name = "inventario_ai"; // Tu base de datos transaccional del proyecto

// Crear la conexión usando MySQLi (Obligatorio para que funcione con login.php y los demás)
$conn = new mysqli($host, $username, $password, $db_name);

// Verificar si hay errores de conexión
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error de conexión a la base de datos: " . $conn->connect_error
    ]);
    exit();
}

// Configurar el juego de caracteres a UTF-8 para evitar problemas con tildes o eñes
$conn->set_charset("utf8");
?>