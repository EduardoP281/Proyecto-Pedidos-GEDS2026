
 -- BASE DE DATOS


DROP DATABASE IF EXISTS minierp_delivery;

CREATE DATABASE minierp_delivery
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE minierp_delivery;

SET FOREIGN_KEY_CHECKS=0;


-- MÓDULO DE SEGURIDAD



 --   TABLA: ROLES


CREATE TABLE roles(

    role_id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(50) NOT NULL,

    description VARCHAR(255),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_role_name
        UNIQUE(name)

)ENGINE=InnoDB;



 --   TABLA: PERMISOS


CREATE TABLE permissions(

    permission_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    module VARCHAR(80) NOT NULL,

    action VARCHAR(50) NOT NULL,

    description VARCHAR(255),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_permission_module(module),

    CONSTRAINT uq_permission
        UNIQUE(module,action)

)ENGINE=InnoDB;



  --  TABLA: ROLES PERMISOS


CREATE TABLE role_permissions(

    role_permission_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    role_id TINYINT UNSIGNED NOT NULL,

    permission_id SMALLINT UNSIGNED NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_rp_role(role_id),

    INDEX idx_rp_permission(permission_id),

    CONSTRAINT fk_rp_role
        FOREIGN KEY(role_id)
        REFERENCES roles(role_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_rp_permission
        FOREIGN KEY(permission_id)
        REFERENCES permissions(permission_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_role_permission
        UNIQUE(role_id,permission_id)

)ENGINE=InnoDB;



   -- TABLA: USUARIOS


CREATE TABLE users(

    user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    role_id TINYINT UNSIGNED NOT NULL,

    full_name VARCHAR(150) NOT NULL,

    username VARCHAR(50) NOT NULL,

    email VARCHAR(150) NOT NULL,

    phone VARCHAR(20),

    password_hash VARCHAR(255) NOT NULL,

    jwt_token TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    last_login DATETIME,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME,

    INDEX idx_user_role(role_id),

    INDEX idx_user_email(email),

    INDEX idx_user_username(username),

    CONSTRAINT uq_username
        UNIQUE(username),

    CONSTRAINT uq_email
        UNIQUE(email),

    CONSTRAINT fk_user_role
        FOREIGN KEY(role_id)
        REFERENCES roles(role_id)
        ON UPDATE CASCADE

)ENGINE=InnoDB;




-- MÓDULO DE CATÁLOGO



   -- TABLA: CATEGORÍAS


CREATE TABLE categories(

    category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(120) NOT NULL,

    description VARCHAR(255),

    image_url VARCHAR(500),

    is_active BOOLEAN DEFAULT TRUE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME,

    CONSTRAINT uq_category_name
        UNIQUE(name)

)ENGINE=InnoDB;



  --  TABLA: PRODUCTOS


CREATE TABLE products(

    product_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    category_id INT UNSIGNED,

    name VARCHAR(150) NOT NULL,

    description TEXT,

    image_url VARCHAR(500),

    price DECIMAL(10,2) NOT NULL,

    stock INT NOT NULL DEFAULT 0,

    is_available BOOLEAN DEFAULT TRUE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME,

    INDEX idx_product_category(category_id),

    INDEX idx_product_name(name),

    CONSTRAINT chk_price
        CHECK(price>=0),

    CONSTRAINT chk_stock
        CHECK(stock>=0),

    CONSTRAINT fk_product_category
        FOREIGN KEY(category_id)
        REFERENCES categories(category_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE

)ENGINE=InnoDB;




-- MÓDULO DEL CLIENTE



   -- TABLA: DIRECCIONES


CREATE TABLE customer_addresses(

    address_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    address_line VARCHAR(255) NOT NULL,

    city VARCHAR(100) NOT NULL,

    department VARCHAR(100),

    reference_point VARCHAR(255),

    postal_code VARCHAR(20),

    latitude DECIMAL(10,7),

    longitude DECIMAL(10,7),

    is_default BOOLEAN DEFAULT FALSE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME,

    INDEX idx_address_user(user_id),

    CONSTRAINT fk_address_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

)ENGINE=InnoDB;




  --  TABLA: CARRITO


CREATE TABLE shopping_carts(

    cart_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME,

    INDEX idx_cart_user(user_id),

    CONSTRAINT uq_cart_user
        UNIQUE(user_id),

    CONSTRAINT fk_cart_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

)ENGINE=InnoDB;




   -- TABLA: DETALLE DEL CARRITO


CREATE TABLE shopping_cart_details(

    cart_detail_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    cart_id INT UNSIGNED NOT NULL,

    product_id INT UNSIGNED NOT NULL,

    quantity INT NOT NULL,

    unit_price DECIMAL(10,2) NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_cartdetail_cart(cart_id),

    INDEX idx_cartdetail_product(product_id),

    CONSTRAINT chk_quantity
        CHECK(quantity>0),

    CONSTRAINT fk_cartdetail_cart
        FOREIGN KEY(cart_id)
        REFERENCES shopping_carts(cart_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_cartdetail_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)
        ON UPDATE CASCADE

)ENGINE=InnoDB;



-- MÓDULO DE PEDIDOS


-- TABLA: ESTADOS DEL PEDIDO


CREATE TABLE order_status(

    status_id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(50) NOT NULL,

    description VARCHAR(255),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_status_name
        UNIQUE(name)

)ENGINE=InnoDB;



--    TABLA: PEDIDOS


CREATE TABLE orders(

    order_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    customer_id INT UNSIGNED NOT NULL,

    address_id INT UNSIGNED NOT NULL,

    status_id TINYINT UNSIGNED NOT NULL,

    payment_method ENUM('Efectivo contra entrega')
        DEFAULT 'Efectivo contra entrega',

    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    notes VARCHAR(500),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME,

    INDEX idx_order_customer(customer_id),

    INDEX idx_order_address(address_id),

    INDEX idx_order_status(status_id),

    CONSTRAINT chk_order_total
        CHECK(total>=0),

    CONSTRAINT fk_order_customer
        FOREIGN KEY(customer_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE,

    CONSTRAINT fk_order_address
        FOREIGN KEY(address_id)
        REFERENCES customer_addresses(address_id)
        ON UPDATE CASCADE,

    CONSTRAINT fk_order_status
        FOREIGN KEY(status_id)
        REFERENCES order_status(status_id)
        ON UPDATE CASCADE

)ENGINE=InnoDB;




  --  TABLA: DETALLE DEL PEDIDO


CREATE TABLE order_details(

    order_detail_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    order_id BIGINT UNSIGNED NOT NULL,

    product_id INT UNSIGNED NOT NULL,

    quantity INT NOT NULL,

    unit_price DECIMAL(10,2) NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_orderdetail_order(order_id),

    INDEX idx_orderdetail_product(product_id),

    CONSTRAINT chk_orderdetail_quantity
        CHECK(quantity>0),

    CONSTRAINT chk_orderdetail_price
        CHECK(unit_price>=0),

    CONSTRAINT fk_orderdetail_order
        FOREIGN KEY(order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_orderdetail_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)
        ON UPDATE CASCADE

)ENGINE=InnoDB;




-- MÓDULO DE REPARTIDORES



   -- TABLA: ASIGNACIÓN DE PEDIDOS


CREATE TABLE delivery_assignments(

    assignment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    order_id BIGINT UNSIGNED NOT NULL,

    delivery_user_id INT UNSIGNED NOT NULL,

    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    accepted_at DATETIME,

    picked_up_at DATETIME,

    delivered_at DATETIME,

    cancelled_at DATETIME,

    notes VARCHAR(255),

    INDEX idx_assignment_order(order_id),

    INDEX idx_assignment_delivery(delivery_user_id),

    CONSTRAINT uq_assignment_order
        UNIQUE(order_id),

    CONSTRAINT fk_assignment_order
        FOREIGN KEY(order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_assignment_delivery
        FOREIGN KEY(delivery_user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE

)ENGINE=InnoDB;




 -- MÓDULO DE AUDITORÍA



    -- TABLA: LOGS


CREATE TABLE logs(

    log_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED,

    table_name VARCHAR(100) NOT NULL,

    record_id BIGINT UNSIGNED NOT NULL,

    action ENUM(
        'INSERT',
        'UPDATE',
        'DELETE',
        'LOGIN',
        'LOGOUT'
    ) NOT NULL,

    description TEXT,

    ip_address VARCHAR(45),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_logs_user(user_id),

    INDEX idx_logs_table(table_name),

    INDEX idx_logs_action(action),

    CONSTRAINT fk_logs_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE

)ENGINE=InnoDB;
