<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once 'conexion.php';

// Consulta para traer los datos de la tabla movements
$query = "SELECT id, id_contenedor, tipo_movimiento, usuario, fecha_movimiento, latitud, longitud FROM movements ORDER BY fecha_movimiento DESC";
$result = $conn->query($query);

if ($result) {
    $movimientos = array();
    
    while ($row = $result->fetch_assoc()) {
        $movimientos[] = [
            "id" => $row['id'],
            "id_contenedor" => $row['id_contenedor'],
            "tipo_movimiento" => $row['tipo_movimiento'],
            "usuario" => $row['usuario'],
            "fecha_movimiento" => $row['fecha_movimiento'],
            "latitud" => $row['latitud'],
            "longitud" => $row['longitud']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "data" => $movimientos
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error al obtener los movimientos: " . $conn->error
    ]);
}
?>