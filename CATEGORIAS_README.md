# Implementación de Categorías - Instrucciones

## ¿Qué se ha implementado?

✅ **Backend (PHP + MySQL):**

- Script SQL para agregar campo `categoria` a la tabla productos
- Endpoint `obtener_categorias.php` para listar categorías únicas
- Actualizado `obtener_productos.php` para:
  - Incluir campo categoria en todas las consultas
  - Permitir filtrado por categoria con `?categoria=NombreCategoria`

✅ **Frontend (Angular):**

- Servicio actualizado con métodos:
  - `getCategorias()` - Obtiene lista de categorías
  - `getProductsByCategory(categoria)` - Filtra productos por categoría
- Componente Home actualizado con:
  - Barra de categorías sticky debajo del hero
  - Filtrado interactivo por categoría
  - Estilos minimalistas para los botones de categoría

## Pasos para activar las categorías:

### 1. Ejecutar el script SQL

Opción A - Desde phpMyAdmin:

1. Abre `http://localhost/phpmyadmin`
2. Selecciona la base de datos `tienda_online`
3. Ve a la pestaña "SQL"
4. Copia y pega el contenido del archivo `backend/agregar_categorias.sql`
5. Haz clic en "Continuar"

Opción B - Desde línea de comandos:

```bash
mysql -u root -p tienda_online < backend/agregar_categorias.sql
```

### 2. Verificar cambios

Ejecuta esta consulta en phpMyAdmin para verificar:

```sql
SELECT id, nombre, categoria, precio FROM productos;
```

Deberías ver:

- Laptop HP Pavilion → Ordenadores
- Mouse Logitech MX → Periféricos
- Teclado Mecánico RGB → Periféricos
- Monitor Samsung 27" → Ordenadores
- Auriculares Sony → Audio
- Webcam Logitech C920 → Periféricos

### 3. Reiniciar el servidor Angular (si está corriendo)

El código Angular ya está actualizado, solo asegúrate de que el servidor esté corriendo:

```bash
ng serve
```

## Cómo funciona:

1. **Al cargar la página Home:**
   - Se obtienen todas las categorías disponibles
   - Se muestran como botones en la barra de categorías
   - Por defecto muestra todos los productos

2. **Al hacer clic en una categoría:**
   - Se filtra la lista de productos
   - El botón seleccionado se marca como activo (fondo negro)
   - Se mantiene el diseño minimalista

3. **Botón "Todas":**
   - Quita el filtro y muestra todos los productos

## Archivos modificados:

**Backend:**

- `backend/agregar_categorias.sql` ⭐ NUEVO
- `backend/obtener_categorias.php` ⭐ NUEVO
- `backend/obtener_productos.php` 📝 MODIFICADO

**Frontend:**

- `src/app/product-data.ts` 📝 MODIFICADO
- `src/app/components/home/home.component.ts` 📝 MODIFICADO
- `src/app/components/home/home.component.html` 📝 MODIFICADO
- `src/app/components/home/home.component.css` 📝 MODIFICADO
