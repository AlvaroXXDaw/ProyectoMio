-- ============================================
-- ACTUALIZACIÓN: AGREGAR CATEGORÍAS
-- ============================================
-- Este script agrega el campo categoria a la tabla productos
-- y actualiza los datos existentes con categorías
-- ============================================

USE tienda_online;

-- 1. Agregar columna categoria si no existe
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS categoria VARCHAR(50) NOT NULL DEFAULT 'General' COMMENT 'Categoría del producto'
AFTER descripcion;

-- 2. Crear índice para búsquedas rápidas por categoría
ALTER TABLE productos
ADD INDEX IF NOT EXISTS idx_categoria (categoria);

-- 3. Actualizar productos existentes con categorías
UPDATE productos SET categoria = 'Ordenadores' WHERE nombre LIKE '%Laptop%' OR nombre LIKE '%Monitor%';
UPDATE productos SET categoria = 'Periféricos' WHERE nombre LIKE '%Mouse%' OR nombre LIKE '%Teclado%' OR nombre LIKE '%Webcam%';
UPDATE productos SET categoria = 'Audio' WHERE nombre LIKE '%Auriculares%';

-- 4. Verificar las categorías actuales
SELECT DISTINCT categoria FROM productos ORDER BY categoria;

-- ============================================
-- ESTRUCTURA ACTUALIZADA
-- ============================================
-- Ahora la tabla productos tiene:
-- - id, nombre, descripcion, categoria, precio, stock, imagen
-- ============================================
