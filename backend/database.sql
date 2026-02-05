-- ============================================
-- BASE DE DATOS: TIENDA ONLINE
-- ============================================
-- Proyecto: Sistema de gestión de tienda online
-- Fecha: 2026
-- Script unificado con todas las sentencias SQL
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
    categoria VARCHAR(50) NOT NULL DEFAULT 'General' COMMENT 'Categoría del producto',
    precio DECIMAL(10, 2) NOT NULL COMMENT 'Precio en euros',
    stock INT NOT NULL DEFAULT 0 COMMENT 'Cantidad disponible en inventario',
    imagen VARCHAR(255) DEFAULT 'https://via.placeholder.com/300' COMMENT 'URL de la imagen',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_stock (stock),
    INDEX idx_categoria (categoria),
    CHECK (precio > 0),
    CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: CARRITO
-- ============================================
-- Almacena el carrito de cada usuario
-- ============================================
CREATE TABLE IF NOT EXISTS carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (usuario_id, producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: FACTURAS
-- ============================================
-- Datos generales de la factura (por compra)
-- ============================================
CREATE TABLE IF NOT EXISTS facturas (
    factura_id VARCHAR(50) PRIMARY KEY,
    usuario_id INT NOT NULL,
    direccion_envio VARCHAR(255) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    envio DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    fecha_factura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_factura_usuario (usuario_id),
    INDEX idx_factura_fecha (fecha_factura),
    CHECK (subtotal >= 0),
    CHECK (envio >= 0),
    CHECK (total >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: COMPRAS
-- ============================================
-- Almacena los pedidos realizados por cada usuario
-- (una fila por producto comprado)
-- ============================================
CREATE TABLE IF NOT EXISTS compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    factura_id VARCHAR(50) DEFAULT NULL,
    factura_url VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (factura_id) REFERENCES facturas(factura_id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha_compra),
    INDEX idx_factura (factura_id),
    CHECK (cantidad > 0),
    CHECK (precio_unitario > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES: USUARIOS
-- ============================================
-- Usuario por defecto para acceder al sistema
-- Email: admin@tienda.com / Password: admin123
-- Email: empleado@tienda.com / Password: admin123
-- ============================================
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Administrador', 'admin@tienda.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jefe'),
('Empleado Test', 'empleado@tienda.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'empleado');

-- ============================================
-- DATOS INICIALES: PRODUCTOS BÁSICOS
-- ============================================
INSERT INTO productos (nombre, descripcion, categoria, precio, stock, imagen) VALUES 
('Laptop HP Pavilion', 'Laptop HP Pavilion 15.6", Intel Core i5, 8GB RAM, 256GB SSD', 'Ordenadores', 599.99, 15, 'https://via.placeholder.com/300/0066cc/ffffff?text=Laptop+HP'),
('Mouse Logitech MX', 'Mouse inalámbrico ergonómico Logitech MX Master 3', 'Periféricos', 89.99, 50, 'https://via.placeholder.com/300/00cc66/ffffff?text=Mouse'),
('Teclado Mecánico RGB', 'Teclado mecánico gaming con iluminación RGB, switches azules', 'Periféricos', 129.99, 30, 'https://via.placeholder.com/300/cc0066/ffffff?text=Teclado'),
('Monitor Samsung 27"', 'Monitor Samsung 27 pulgadas, Full HD, 144Hz, panel IPS', 'Ordenadores', 249.99, 20, 'https://via.placeholder.com/300/6600cc/ffffff?text=Monitor'),
('Auriculares Sony', 'Auriculares inalámbricos Sony con cancelación de ruido', 'Audio', 179.99, 25, 'https://via.placeholder.com/300/cc6600/ffffff?text=Auriculares'),
('Webcam Logitech C920', 'Webcam Full HD 1080p con micrófono estéreo integrado', 'Periféricos', 79.99, 40, 'https://via.placeholder.com/300/009999/ffffff?text=Webcam');

-- ============================================
-- DATOS: TABLETS
-- ============================================
INSERT INTO productos (nombre, descripcion, categoria, precio, stock, imagen) VALUES
('iPad Pro 12.9"', 'Apple iPad Pro con chip M2 y pantalla XDR', 'Tablets', 1099.00, 15, 'https://via.placeholder.com/500?text=iPad+Pro'),
('Samsung Galaxy Tab S9', 'Tablet Android de alta gama con S Pen incluido', 'Tablets', 899.00, 20, 'https://via.placeholder.com/500?text=Galaxy+Tab+S9'),
('Xiaomi Pad 6', 'Tablet calidad-precio con pantalla de 144Hz', 'Tablets', 399.00, 30, 'https://via.placeholder.com/500?text=Xiaomi+Pad+6'),
('Lenovo Tab P12', 'Tablet perfecta para estudiantes y multimedia', 'Tablets', 349.00, 25, 'https://via.placeholder.com/500?text=Lenovo+Tab'),
('Microsoft Surface Pro 9', 'Portátil y tablet 2 en 1 con Windows 11', 'Tablets', 1299.00, 10, 'https://via.placeholder.com/500?text=Surface+Pro'),
('iPad Air 5', 'Potencia y ligereza con el chip M1', 'Tablets', 769.00, 18, 'https://via.placeholder.com/500?text=iPad+Air'),
('Samsung Galaxy Tab A8', 'Tablet económica para toda la familia', 'Tablets', 199.00, 50, 'https://via.placeholder.com/500?text=Galaxy+Tab+A8'),
('Huawei MatePad 11.5', 'Pantalla FullView y gran autonomía', 'Tablets', 299.00, 22, 'https://via.placeholder.com/500?text=MatePad'),
('Amazon Fire Max 11', 'La tablet más potente de Amazon', 'Tablets', 269.00, 35, 'https://via.placeholder.com/500?text=Fire+Max'),
('Realme Pad 2', 'Gran pantalla y batería de larga duración', 'Tablets', 249.00, 28, 'https://via.placeholder.com/500?text=Realme+Pad');

-- ============================================
-- DATOS: SMARTWATCH
-- ============================================
INSERT INTO productos (nombre, descripcion, categoria, precio, stock, imagen) VALUES
('Apple Watch Series 9', 'El reloj más avanzado de Apple con doble toque', 'Smartwatch', 449.00, 25, 'https://via.placeholder.com/500?text=Apple+Watch'),
('Samsung Galaxy Watch 6', 'Monitorización de salud avanzada y diseño elegante', 'Smartwatch', 299.00, 30, 'https://via.placeholder.com/500?text=Galaxy+Watch'),
('Garmin Fenix 7', 'Reloj GPS multideporte definitivo', 'Smartwatch', 699.00, 12, 'https://via.placeholder.com/500?text=Garmin+Fenix'),
('Xiaomi Smart Band 8', 'La pulsera de actividad más popular', 'Smartwatch', 49.00, 100, 'https://via.placeholder.com/500?text=Smart+Band'),
('Fitbit Versa 4', 'Smartwatch enfocado en fitness y salud', 'Smartwatch', 199.00, 40, 'https://via.placeholder.com/500?text=Fitbit'),
('Amazfit GTR 4', 'Diseño clásico con funciones deportivas modernas', 'Smartwatch', 169.00, 35, 'https://via.placeholder.com/500?text=Amazfit'),
('Huawei Watch GT 4', 'Estilo geométrico y batería de 2 semanas', 'Smartwatch', 249.00, 20, 'https://via.placeholder.com/500?text=Huawei+Watch'),
('Pixel Watch 2', 'La experiencia de Google en tu muñeca', 'Smartwatch', 399.00, 15, 'https://via.placeholder.com/500?text=Pixel+Watch'),
('Polar Vantage V3', 'Reloj deportivo premium con biosensores', 'Smartwatch', 599.00, 8, 'https://via.placeholder.com/500?text=Polar+Vantage'),
('Suunto Race', 'Pantalla AMOLED y mapas offline', 'Smartwatch', 449.00, 10, 'https://via.placeholder.com/500?text=Suunto+Race');

-- ============================================
-- DATOS: ORDENADORES (Más variedad)
-- ============================================
INSERT INTO productos (nombre, descripcion, categoria, precio, stock, imagen) VALUES
('MacBook Air M2', 'Portátil ultraligero y potente', 'Ordenadores', 1199.00, 15, 'https://via.placeholder.com/500?text=MacBook+Air'),
('Asus ROG Strix', 'Portátil gaming de alto rendimiento', 'Ordenadores', 1599.00, 8, 'https://via.placeholder.com/500?text=Asus+ROG'),
('HP Omen 16', 'Diseñado para jugar sin límites', 'Ordenadores', 1399.00, 10, 'https://via.placeholder.com/500?text=HP+Omen'),
('Dell XPS 13', 'El ultrabook definitivo con pantalla InfinityEdge', 'Ordenadores', 1499.00, 12, 'https://via.placeholder.com/500?text=Dell+XPS'),
('Lenovo Legion 5', 'Equilibrio perfecto entre rendimiento y precio', 'Ordenadores', 1099.00, 20, 'https://via.placeholder.com/500?text=Lenovo+Legion'),
('MSI Raider GE78', 'Potencia bruta para creadores y gamers', 'Ordenadores', 2499.00, 5, 'https://via.placeholder.com/500?text=MSI+Raider'),
('Acer Swift Go', 'Portátil ligero con pantalla OLED', 'Ordenadores', 899.00, 18, 'https://via.placeholder.com/500?text=Acer+Swift'),
('LG Gram 17', 'El portátil de 17 pulgadas más ligero', 'Ordenadores', 1699.00, 7, 'https://via.placeholder.com/500?text=LG+Gram'),
('Mac Mini M2', 'Pequeño pero matón', 'Ordenadores', 699.00, 30, 'https://via.placeholder.com/500?text=Mac+Mini'),
('iMac 24"', 'Todo en uno con diseño colorido', 'Ordenadores', 1599.00, 10, 'https://via.placeholder.com/500?text=iMac');

-- ============================================
-- DATOS: PERIFÉRICOS
-- ============================================
INSERT INTO productos (nombre, descripcion, categoria, precio, stock, imagen) VALUES
('Logitech G Pro X', 'Teclado mecánico gaming TKL', 'Periféricos', 129.00, 25, 'https://via.placeholder.com/500?text=Teclado+Logitech'),
('Razer DeathAdder V3', 'Ratón ergonómico ultraligero', 'Periféricos', 79.99, 40, 'https://via.placeholder.com/500?text=Razer+Mouse'),
('Corsair K70 RGB', 'Teclado mecánico premium', 'Periféricos', 169.99, 15, 'https://via.placeholder.com/500?text=Corsair+K70'),
('HyperX QuadCast S', 'Micrófono USB con iluminación RGB', 'Periféricos', 159.00, 20, 'https://via.placeholder.com/500?text=Microfono'),
('Elgato Stream Deck', 'Controlador de contenido para streamers', 'Periféricos', 149.00, 30, 'https://via.placeholder.com/500?text=Stream+Deck'),
('Logitech MX Master 3S', 'El ratón definitivo para productividad', 'Periféricos', 109.00, 35, 'https://via.placeholder.com/500?text=MX+Master'),
('Monitor LG UltraGear', 'Monitor gaming 27" 144Hz IPS', 'Periféricos', 299.00, 15, 'https://via.placeholder.com/500?text=Monitor+LG'),
('BenQ ScreenBar', 'Lámpara para monitor que cuida tus ojos', 'Periféricos', 109.00, 10, 'https://via.placeholder.com/500?text=ScreenBar'),
('Wacom Intuos Pro', 'Tableta gráfica profesional', 'Periféricos', 349.00, 8, 'https://via.placeholder.com/500?text=Wacom'),
('Keychron Q1 Pro', 'Teclado mecánico custom inalámbrico', 'Periféricos', 199.00, 12, 'https://via.placeholder.com/500?text=Keychron');

-- ============================================
-- DATOS: AUDIO
-- ============================================
INSERT INTO productos (nombre, descripcion, categoria, precio, stock, imagen) VALUES
('Sony WH-1000XM5', 'La mejor cancelación de ruido del mercado', 'Audio', 349.00, 20, 'https://via.placeholder.com/500?text=Sony+Headphones'),
('AirPods Pro 2', 'Sonido mágico con cancelación activa', 'Audio', 279.00, 40, 'https://via.placeholder.com/500?text=AirPods+Pro'),
('Bose QuietComfort 45', 'Comodidad legendaria y sonido premium', 'Audio', 299.00, 15, 'https://via.placeholder.com/500?text=Bose+QC45'),
('JBL Flip 6', 'Altavoz Bluetooth portátil resistente al agua', 'Audio', 119.00, 50, 'https://via.placeholder.com/500?text=JBL+Flip'),
('Sonos Era 100', 'Altavoz inteligente con sonido estéreo', 'Audio', 279.00, 10, 'https://via.placeholder.com/500?text=Sonos+Speaker'),
('Marshall Major IV', 'Diseño icónico y 80 horas de batería', 'Audio', 129.00, 25, 'https://via.placeholder.com/500?text=Marshall'),
('Sennheiser Momentum 4', 'Calidad de audio audiófila inalámbrica', 'Audio', 329.00, 12, 'https://via.placeholder.com/500?text=Sennheiser'),
('Nothing Ear (2)', 'Diseño transparente y sonido personalizado', 'Audio', 149.00, 30, 'https://via.placeholder.com/500?text=Nothing+Ear'),
('Audio-Technica AT2020', 'Micrófono de condensador cardioide', 'Audio', 99.00, 20, 'https://via.placeholder.com/500?text=Audio+Technica'),
('Google Pixel Buds Pro', 'Sonido premium de Google', 'Audio', 199.00, 25, 'https://via.placeholder.com/500?text=Pixel+Buds');

-- ============================================
-- CONSULTAS ÚTILES PARA VERIFICACIÓN
-- ============================================
-- Ver todos los usuarios
-- SELECT id, nombre, email, rol, fecha_registro FROM usuarios;

-- Ver todos los productos con stock bajo (menos de 10 unidades)
-- SELECT nombre, stock, precio FROM productos WHERE stock < 10 ORDER BY stock ASC;

-- Ver productos ordenados por precio
-- SELECT nombre, precio, stock FROM productos ORDER BY precio DESC;

-- Ver productos por categoría
-- SELECT categoria, COUNT(*) as total FROM productos GROUP BY categoria;
