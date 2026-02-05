# 🚀 Guía de Instalación - Tienda Online

## Requisitos Previos
- ✅ XAMPP instalado
- ✅ Node.js y npm instalados
- ✅ Angular CLI instalado (`npm install -g @angular/cli`)

## 📝 Pasos de Instalación

### PASO 1: Configurar el Backend

#### 1.1 Iniciar XAMPP
1. Abre XAMPP Control Panel
2. Inicia **Apache**
3. Inicia **MySQL**

#### 1.2 Crear la Base de Datos
1. Abre phpMyAdmin: http://localhost/phpmyadmin
2. Haz clic en "Nueva" para crear una base de datos
3. Nombre: `tienda_online`
4. Cotejamiento: `utf8mb4_unicode_ci`
5. Haz clic en "Crear"

#### 1.3 Importar las Tablas y Datos
1. Selecciona la base de datos `tienda_online`
2. Ve a la pestaña "Importar"
3. Haz clic en "Seleccionar archivo"
4. Selecciona el archivo: `backend/database.sql`
5. Haz clic en "Continuar"

#### 1.4 Verificar la Instalación
Ejecuta estas consultas SQL para verificar:

```sql
-- Ver usuarios creados
SELECT id, nombre, email, rol FROM usuarios;

-- Ver productos creados
SELECT id, nombre, precio, stock FROM productos;
```

Deberías ver:
- 2 usuarios (admin y empleado)
- 6 productos con diferentes stocks

### PASO 2: Configurar el Frontend (Angular)

#### 2.1 Instalar Dependencias
```bash
cd C:\xampp\htdocs\DWEC\Angular\ProyectoMio
npm install
```

#### 2.2 Iniciar la Aplicación
```bash
ng serve -o
```

Esto abrirá automáticamente el navegador en: http://localhost:4200

### PASO 3: Probar la Aplicación

#### 3.1 Login como Administrador
1. La aplicación redirigirá automáticamente a `/login`
2. Usa estas credenciales:
   - **Email**: `admin@tienda.com`
   - **Password**: `admin123`
3. Al hacer login, verás el navbar con todas las opciones (incluyendo Admin)

#### 3.2 Login como Empleado
1. Cierra sesión
2. Usa estas credenciales:
   - **Email**: `empleado@tienda.com`
   - **Password**: `admin123`
3. Al hacer login, NO verás la opción de Admin (solo Inicio y Carrito)

## 🔐 Cómo Funcionan las Credenciales

### Verificación en la Base de Datos
Cuando haces login:

1. Angular envía el email y password a `backend/auth.php`
2. PHP ejecuta: `SELECT * FROM usuarios WHERE email = 'email_ingresado'`
3. Si el usuario existe, PHP verifica la contraseña con `password_verify()`
4. Si la contraseña es correcta, devuelve los datos del usuario
5. Angular guarda los datos en `localStorage`

### Añadir Nuevos Usuarios

**Opción 1: Desde la aplicación (si implementas registro)**

**Opción 2: Desde phpMyAdmin**
```sql
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Nuevo Usuario', 'nuevo@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'empleado');
```

**Opción 3: Crear un archivo PHP temporal**
```php
<?php
// crear_usuario.php
$password = password_hash('tupassword', PASSWORD_DEFAULT);
echo $password; // Copia este hash y úsalo en SQL
?>
```

## 📊 Estructura de la Base de Datos

### Tabla: usuarios
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único del usuario |
| nombre | VARCHAR(100) | Nombre completo |
| email | VARCHAR(100) | Email (único) |
| password | VARCHAR(255) | Hash de la contraseña |
| rol | ENUM | 'empleado' o 'jefe' |
| fecha_registro | TIMESTAMP | Fecha de creación |

### Tabla: productos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único del producto |
| nombre | VARCHAR(100) | Nombre del producto |
| descripcion | TEXT | Descripción detallada |
| precio | DECIMAL(10,2) | Precio en euros |
| stock | INT | Unidades disponibles |
| imagen | VARCHAR(255) | URL de la imagen |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| fecha_actualizacion | TIMESTAMP | Última actualización |

## ⚠️ Solución de Problemas

### "Error de conexión a la base de datos"
**Solución**: 
- Verifica que MySQL esté corriendo en XAMPP
- Verifica que la base de datos `tienda_online` exista
- Revisa `backend/config.php` y ajusta las credenciales si es necesario

### "Usuario no encontrado" al hacer login
**Solución**:
- Verifica que ejecutaste `database.sql`
- Consulta: `SELECT * FROM usuarios;` en phpMyAdmin
- Asegúrate de usar el email exacto: `admin@tienda.com`

### La aplicación no carga / Error de compilación
**Solución**:
```bash
# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Reiniciar servidor
ng serve
```

### No se ve el navbar o falta estilos
**Solución**:
- Verifica que existe `src/app/app.css` con los estilos del navbar
- Reinicia el servidor de Angular: Ctrl+C y luego `ng serve`

## 🎯 Próximos Pasos

Una vez instalado correctamente:

1. ✅ Implementar los componentes (Home, Carrito, Admin, Login)
2. ✅ Crear servicios para conectar con el backend
3. ✅ Implementar la funcionalidad de añadir productos (solo admin)
4. ✅ Implementar el carrito de compras
5. ✅ Añadir validaciones en los formularios

## 📞 URLs Importantes

- **Frontend**: http://localhost:4200
- **Backend**: http://localhost/DWEC/Angular/ProyectoMio/backend/
- **phpMyAdmin**: http://localhost/phpmyadmin
- **API Productos**: http://localhost/DWEC/Angular/ProyectoMio/backend/productos.php
- **API Auth**: http://localhost/DWEC/Angular/ProyectoMio/backend/auth.php
