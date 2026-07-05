<?php
// Incluimos el archivo de conexión que acabamos de configurar
require_once 'conexion.php';

try {
    // Hacemos la consulta a tu tabla 'usuarios'
    $query = "SELECT id, nombre, correo, rol, created_at FROM usuarios";
    $stmt = $conexion->prepare($query);
    $stmt->execute();
    
    // Guardamos los resultados
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Se los enviamos a Angular en formato JSON
    echo json_encode($usuarios);

} catch(PDOException $exception) {
    echo json_encode(["error" => $exception->getMessage()]);
}
?>