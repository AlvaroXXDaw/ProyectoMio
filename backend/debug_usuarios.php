<?php
require_once 'config.php';

echo "=== DIAGNÓSTICO COMPLETO ===\n\n";

// 1. Verificar el usuario admin
$email = 'admin@tienda.com';
$sql = "SELECT id, nombre, email, rol, password FROM usuarios WHERE email = '$email'";
$resultado = $conexion->query($sql);

if ($resultado->num_rows === 0) {
    echo "ERROR: No existe el usuario $email\n";
    exit;
}

$usuario = $resultado->fetch_assoc();
echo "Usuario encontrado:\n";
echo "- ID: " . $usuario['id'] . "\n";
echo "- Nombre: " . $usuario['nombre'] . "\n";
echo "- Email: " . $usuario['email'] . "\n";
echo "- Rol: " . $usuario['rol'] . "\n";
echo "- Hash guardado: " . $usuario['password'] . "\n\n";

// 2. Probar la contraseña
$password = 'admin123';
echo "Probando contraseña '$password'...\n";

if (password_verify($password, $usuario['password'])) {
    echo "✓ CORRECTO - La contraseña coincide\n";
} else {
    echo "✗ ERROR - La contraseña NO coincide\n";
    
    // Generar un nuevo hash
    $nuevoHash = password_hash('admin123', PASSWORD_DEFAULT);
    echo "\nGenerando nuevo hash...\n";
    echo "Nuevo hash: $nuevoHash\n";
    
    // Actualizar la contraseña
    $sqlUpdate = "UPDATE usuarios SET password = '$nuevoHash' WHERE email = '$email'";
    if ($conexion->query($sqlUpdate)) {
        echo "✓ Contraseña actualizada correctamente\n";
        echo "Ahora prueba con: admin@tienda.com / admin123\n";
    } else {
        echo "✗ Error al actualizar: " . $conexion->error . "\n";
    }
}

$conexion->close();
?>
