-- ============================================
-- SCRIPT DE ACTUALIZACIÓN DE IMÁGENES
-- ============================================
-- Ejecuta este script en phpMyAdmin para actualizar
-- todas las imágenes de productos con fotos reales
-- ============================================

USE tienda_online;

-- ============================================
-- PRODUCTOS BÁSICOS (ID 1-6)
-- ============================================
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80' WHERE nombre = 'Laptop HP Pavilion';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80' WHERE nombre = 'Mouse Logitech MX';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80' WHERE nombre = 'Teclado Mecánico RGB';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80' WHERE nombre = 'Monitor Samsung 27"';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' WHERE nombre = 'Auriculares Sony';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500&q=80' WHERE nombre = 'Webcam Logitech C920';

-- ============================================
-- TABLETS
-- ============================================
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' WHERE nombre = 'iPad Pro 12.9"';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1632634133474-d8e64a3476f0?w=500&q=80' WHERE nombre = 'Samsung Galaxy Tab S9';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80' WHERE nombre = 'Xiaomi Pad 6';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&q=80' WHERE nombre = 'Lenovo Tab P12';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80' WHERE nombre = 'Microsoft Surface Pro 9';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=500&q=80' WHERE nombre = 'iPad Air 5';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=500&q=80' WHERE nombre = 'Samsung Galaxy Tab A8';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1628815113969-0487917f7a58?w=500&q=80' WHERE nombre = 'Huawei MatePad 11.5';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&q=80' WHERE nombre = 'Amazon Fire Max 11';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&q=80' WHERE nombre = 'Realme Pad 2';

-- ============================================
-- SMARTWATCH
-- ============================================
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80' WHERE nombre = 'Apple Watch Series 9';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80' WHERE nombre = 'Samsung Galaxy Watch 6';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80' WHERE nombre = 'Garmin Fenix 7';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80' WHERE nombre = 'Xiaomi Smart Band 8';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500&q=80' WHERE nombre = 'Fitbit Versa 4';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' WHERE nombre = 'Amazfit GTR 4';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=500&q=80' WHERE nombre = 'Huawei Watch GT 4';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80' WHERE nombre = 'Pixel Watch 2';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=500&q=80' WHERE nombre = 'Polar Vantage V3';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&q=80' WHERE nombre = 'Suunto Race';

-- ============================================
-- ORDENADORES
-- ============================================
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80' WHERE nombre = 'MacBook Air M2';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&q=80' WHERE nombre = 'Asus ROG Strix';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=500&q=80' WHERE nombre = 'HP Omen 16';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80' WHERE nombre = 'Dell XPS 13';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80' WHERE nombre = 'Lenovo Legion 5';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80' WHERE nombre = 'MSI Raider GE78';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' WHERE nombre = 'Acer Swift Go';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=500&q=80' WHERE nombre = 'LG Gram 17';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1637410124884-12a684746a24?w=500&q=80' WHERE nombre = 'Mac Mini M2';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1527443060795-0402a18906c3?w=500&q=80' WHERE nombre = 'iMac 24"';

-- ============================================
-- PERIFÉRICOS
-- ============================================
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80' WHERE nombre = 'Logitech G Pro X';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80' WHERE nombre = 'Razer DeathAdder V3';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' WHERE nombre = 'Corsair K70 RGB';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&q=80' WHERE nombre = 'HyperX QuadCast S';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&q=80' WHERE nombre = 'Elgato Stream Deck';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80' WHERE nombre = 'Logitech MX Master 3S';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500&q=80' WHERE nombre = 'Monitor LG UltraGear';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&q=80' WHERE nombre = 'BenQ ScreenBar';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=500&q=80' WHERE nombre = 'Wacom Intuos Pro';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=500&q=80' WHERE nombre = 'Keychron Q1 Pro';

-- ============================================
-- AUDIO
-- ============================================
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80' WHERE nombre = 'Sony WH-1000XM5';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&q=80' WHERE nombre = 'AirPods Pro 2';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80' WHERE nombre = 'Bose QuietComfort 45';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80' WHERE nombre = 'JBL Flip 6';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80' WHERE nombre = 'Sonos Era 100';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80' WHERE nombre = 'Marshall Major IV';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500&q=80' WHERE nombre = 'Sennheiser Momentum 4';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80' WHERE nombre = 'Nothing Ear (2)';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&q=80' WHERE nombre = 'Audio-Technica AT2020';
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1655212738632-b1d08b04cdce?w=500&q=80' WHERE nombre = 'Google Pixel Buds Pro';

-- ============================================
-- VERIFICAR LOS CAMBIOS
-- ============================================
SELECT id, nombre, imagen FROM productos ORDER BY id;
