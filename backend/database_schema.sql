CREATE DATABASE IF NOT EXISTS pedidos_db;
USE pedidos_db;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    category_id INT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Datos iniciales
INSERT IGNORE INTO categories (id, name, description) VALUES
(1, 'Bebidas', 'Cafés de especialidad, bebidas frías y tés orgánicos.'),
(2, 'Comida', 'Platillos ligeros y opciones preparadas al momento.'),
(3, 'Postres', 'Pastelería artesanal y confitería contemporánea.'),
(4, 'Snacks', 'Aperitivos, frutos secos y barras energéticas.'),
(5, 'Accesorios', 'Termos isotérmicos, tazas y artículos de diseño.');

INSERT IGNORE INTO products (id, name, description, price, stock, category_id, image_url) VALUES
(1, 'Nitro Cold Brew Cyan Reserve', 'Café extraído en frío durante 24 horas infundido con nitrógeno para una textura cremosa aterciopelada.', 4.85, 24, 1, ''),
(2, 'Matcha Latte Ceremonial Jade', 'Grado ceremonial auténtico de Uji con leche vaporizada de avena y sutil toque de miel de azahar.', 5.20, 3, 1, ''),
(3, 'Electric Blue Tonic Espresso', 'Doble shot de espresso premium sobre tónica artesanal con reducción cítrica y flor de guisante de mariposa.', 5.50, 0, 1, ''),
(4, 'Sandwich Bagel de Salmón Ahumado', 'Bagel artesanal con semillas de amapola, crema de eneldo, alcaparras y láminas de salmón noruego.', 8.90, 14, 2, ''),
(5, 'Cheesecake de Frutos del Bosque', 'Base crocante de galleta de cacao puro, crema ligera de queso y compota de moras silvestres.', 6.00, 2, 3, ''),
(6, 'Almendras Tostadas con Romero', 'Mix crocante horneado en pequeños lotes con aceite de oliva extra virgen y finas hierbas mediterráneas.', 3.75, 38, 4, ''),
(7, 'Termo AeroVacuum 750ml Obsidian', 'Aislamiento térmico de doble capa en acero inoxidable quirúrgico con recubrimiento mate antideslizante.', 26.50, 10, 5, '');

