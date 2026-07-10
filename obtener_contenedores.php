<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once 'conexion.php';

// Consulta para traer los datos de la tabla containers
$query = "SELECT id, numero_contenedor, tipo, estado, capacidad, ubicacion FROM containers";
$result = $conn->query($query);

if ($result) {
    $contenedores = array();
    
    while ($row = $result->fetch_assoc()) {
        $contenedores[] = [
            "id" => $row['id'],
            "numero_contenedor" => $row['numero_contenedor'],
            "tipo" => $row['tipo'],
            "estado" => $row['estado'],
            "capacidad" => $row['capacidad'],
            "ubicacion" => $row['ubicacion']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "data" => $contenedores
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error al obtener los contenedores: " . $conn->error
    ]);
}
?>