<?php
require_once 'config.php';

echo "Actualizando contraseña del admin...\n\n";

$hashCorrecto = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
$email = 'admin@tienda.com';

$sql = "UPDATE usuarios SET password = '$hashCorrecto' WHERE email = '$email'";

if ($conexion->query($sql) === TRUE) {
    echo "✓ Contraseña actualizada correctamente para $email\n";
    echo "Ahora puedes usar: admin@tienda.com / admin123\n";
} else {
    echo "✗ Error: " . $conexion->error . "\n";
}

$conexion->close();
?>
