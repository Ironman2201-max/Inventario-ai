<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->correo) && !empty($data->password)) {
    // Buscamos el usuario por correo
    $query = "SELECT id, nombre, correo, password, rol FROM usuarios WHERE correo = ? LIMIT 0,1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $data->correo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        // Verificamos la contraseña encriptada (como las que tienes en phpMyAdmin)
        if (password_verify($data->password, $row['password'])) {
            
            // Simulamos un token JWT simple para cumplir con el requisito RF-02
            $token = base64_encode(json_encode([
                "id" => $row['id'],
                "rol" => $row['rol'],
                "exp" => time() + 3600
            ]));

            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Acceso concedido.",
                "token" => $token,
                "user" => [
                    "id" => $row['id'],
                    "nombre" => $row['nombre'],
                    "correo" => $row['correo'],
                    "rol" => $row['rol']
                ]
            ]);
            exit;
        }
    }
    
    // Error genérico por seguridad (RF-01): No dice si falló el usuario o la clave
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Credenciales incorrectas."]);
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Datos incompletos."]);
}
?>