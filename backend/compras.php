<?php
/**
 * API de Compras - Tienda Online
 * 
 * Endpoints:
 * - POST /compras.php - Realizar una compra (requiere usuario logueado)
 * - GET /compras.php?user_id=X - Obtener historial de compras del usuario
 * 
 * NOTA PARA JUNIOR:
 * Esta API maneja las compras de productos. Cuando un usuario compra:
 * 1. Verifica que hay stock suficiente
 * 2. Crea un registro en la tabla 'compras'
 * 3. Reduce el stock del producto
 */

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    // ============================================
    // GET - Obtener historial de compras
    // ============================================
    case 'GET':
        // Si se pasa user_id, obtener compras de ese usuario
        if (isset($_GET['user_id'])) {
            $userId = intval($_GET['user_id']);
            
            // Consulta que une compras con productos para obtener info completa
            $sql = "SELECT 
                        c.id AS compra_id,
                        c.cantidad,
                        c.precio_unitario,
                        c.fecha_compra,
                        p.id AS producto_id,
                        p.nombre AS producto_nombre,
                        p.imagen AS producto_imagen,
                        (c.cantidad * c.precio_unitario) AS total
                    FROM compras c
                    INNER JOIN productos p ON c.producto_id = p.id
                    WHERE c.usuario_id = $userId
                    ORDER BY c.fecha_compra DESC";
            
            $result = $conn->query($sql);
            
            $compras = [];
            $totalGastado = 0;
            
            while($row = $result->fetch_assoc()) {
                $compras[] = $row;
                $totalGastado += floatval($row['total']);
            }
            
            echo json_encode([
                'success' => true,
                'compras' => $compras,
                'total_compras' => count($compras),
                'total_gastado' => $totalGastado
            ]);
        } else {
            // Si no se pasa user_id, error
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Se requiere user_id para ver el historial'
            ]);
        }
        break;
        
    // ============================================
    // POST - Realizar una compra
    // ============================================
    case 'POST':
        // Leer los datos enviados en formato JSON
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validar que se envíen los campos necesarios
        if (!isset($data['usuario_id']) || !isset($data['producto_id'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Faltan campos obligatorios: usuario_id, producto_id'
            ]);
            break;
        }
        
        $usuarioId = intval($data['usuario_id']);
        $productoId = intval($data['producto_id']);
        $cantidad = isset($data['cantidad']) ? intval($data['cantidad']) : 1;
        
        // Validar que la cantidad sea positiva
        if ($cantidad <= 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'La cantidad debe ser mayor a 0'
            ]);
            break;
        }
        
        // ============================================
        // PASO 1: Verificar que el producto existe y tiene stock
        // ============================================
        $sqlProducto = "SELECT id, nombre, precio, stock FROM productos WHERE id = $productoId";
        $resultProducto = $conn->query($sqlProducto);
        
        if ($resultProducto->num_rows === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Producto no encontrado'
            ]);
            break;
        }
        
        $producto = $resultProducto->fetch_assoc();
        
        // Verificar stock suficiente
        if ($producto['stock'] < $cantidad) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Stock insuficiente',
                'stock_disponible' => intval($producto['stock']),
                'cantidad_solicitada' => $cantidad
            ]);
            break;
        }
        
        // ============================================
        // PASO 2: Verificar que el usuario existe
        // ============================================
        $sqlUsuario = "SELECT id, nombre FROM usuarios WHERE id = $usuarioId";
        $resultUsuario = $conn->query($sqlUsuario);
        
        if ($resultUsuario->num_rows === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ]);
            break;
        }
        
        // ============================================
        // PASO 3: Iniciar transacción para asegurar consistencia
        // ============================================
        // Una transacción asegura que si algo falla, no se hacen cambios parciales
        $conn->begin_transaction();
        
        try {
            // Insertar la compra
            $precioUnitario = floatval($producto['precio']);
            $sqlCompra = "INSERT INTO compras (usuario_id, producto_id, cantidad, precio_unitario) 
                          VALUES ($usuarioId, $productoId, $cantidad, $precioUnitario)";
            
            if (!$conn->query($sqlCompra)) {
                throw new Exception('Error al registrar la compra: ' . $conn->error);
            }
            
            $compraId = $conn->insert_id;
            
            // Reducir el stock del producto
            $nuevoStock = intval($producto['stock']) - $cantidad;
            $sqlStock = "UPDATE productos SET stock = $nuevoStock WHERE id = $productoId";
            
            if (!$conn->query($sqlStock)) {
                throw new Exception('Error al actualizar el stock: ' . $conn->error);
            }
            
            // Si todo salió bien, confirmar la transacción
            $conn->commit();
            
            // Calcular el total de la compra
            $totalCompra = $cantidad * $precioUnitario;
            
            echo json_encode([
                'success' => true,
                'message' => '¡Compra realizada exitosamente!',
                'compra' => [
                    'id' => $compraId,
                    'producto' => $producto['nombre'],
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                    'total' => $totalCompra,
                    'stock_restante' => $nuevoStock
                ]
            ]);
            
        } catch (Exception $e) {
            // Si algo falla, deshacer todos los cambios
            $conn->rollback();
            
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'error' => 'Método no permitido. Use GET o POST'
        ]);
        break;
}

$conn->close();
?>
