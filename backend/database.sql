-- ============================================
-- BASE DE DATOS: TIENDA ONLINE
-- ============================================
-- Proyecto: Sistema de gestión de tienda online
-- Fecha: 2026
-- ============================================

CREATE DATABASE IF NOT EXISTS tienda_online 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE tienda_online;

-- ============================================
-- TABLA: USUARIOS
-- ============================================
-- Almacena información de usuarios del sistema
-- Roles: empleado (puede ver productos) y jefe (admin completo)
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Password hasheado con password_hash()',
    rol ENUM('empleado', 'jefe') DEFAULT 'empleado' COMMENT 'empleado: solo lectura, jefe: admin',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: PRODUCTOS
-- ============================================
-- Almacena el catálogo de productos
-- Incluye stock para control de inventario
-- ============================================
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT COMMENT 'Descripción detallada del producto',
    precio DECIMAL(10, 2) NOT NULL COMMENT 'Precio en euros',
    stock INT NOT NULL DEFAULT 0 COMMENT 'Cantidad disponible en inventario',
    imagen VARCHAR(255) DEFAULT 'https://via.placeholder.com/300' COMMENT 'URL de la imagen',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_stock (stock),
    CHECK (precio > 0),
    CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES: USUARIO ADMINISTRADOR
-- ============================================
-- Usuario por defecto para acceder al sistema
-- Email: admin@tienda.com
-- Password: admin123
-- ============================================
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Administrador', 'admin@tienda.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jefe'),
('Empleado Test', 'empleado@tienda.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'empleado');

-- ============================================
-- DATOS INICIALES: PRODUCTOS DE EJEMPLO
-- ============================================
-- Productos de muestra para testing
-- ============================================
INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES 
('Laptop HP Pavilion', 'Laptop HP Pavilion 15.6", Intel Core i5, 8GB RAM, 256GB SSD', 599.99, 15, 'https://via.placeholder.com/300/0066cc/ffffff?text=Laptop+HP'),
('Mouse Logitech MX', 'Mouse inalámbrico ergonómico Logitech MX Master 3', 89.99, 50, 'https://via.placeholder.com/300/00cc66/ffffff?text=Mouse'),
('Teclado Mecánico RGB', 'Teclado mecánico gaming con iluminación RGB, switches azules', 129.99, 30, 'https://via.placeholder.com/300/cc0066/ffffff?text=Teclado'),
('Monitor Samsung 27"', 'Monitor Samsung 27 pulgadas, Full HD, 144Hz, panel IPS', 249.99, 20, 'https://via.placeholder.com/300/6600cc/ffffff?text=Monitor'),
('Auriculares Sony', 'Auriculares inalámbricos Sony con cancelación de ruido', 179.99, 25, 'https://via.placeholder.com/300/cc6600/ffffff?text=Auriculares'),
('Webcam Logitech C920', 'Webcam Full HD 1080p con micrófono estéreo integrado', 79.99, 40, 'https://via.placeholder.com/300/009999/ffffff?text=Webcam');

-- ============================================
-- CONSULTAS ÚTILES PARA VERIFICACIÓN
-- ============================================
-- Ver todos los usuarios
-- SELECT id, nombre, email, rol, fecha_registro FROM usuarios;

-- Ver todos los productos con stock bajo (menos de 10 unidades)
-- SELECT nombre, stock, precio FROM productos WHERE stock < 10 ORDER BY stock ASC;

-- Ver productos ordenados por precio
-- SELECT nombre, precio, stock FROM productos ORDER BY precio DESC;
