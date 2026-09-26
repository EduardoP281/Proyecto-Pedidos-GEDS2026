import pool from './src/infrastructure/database/db.js';

async function seed() {
  try {
    console.log('Iniciando carga de categorías y productos iniciales...');
    
    // Insertar categorías
    const categories = [
      { name: 'Bebidas', description: 'Cafés de especialidad, bebidas frías y tés orgánicos.' },
      { name: 'Comida', description: 'Platillos ligeros y opciones preparadas al momento.' },
      { name: 'Postres', description: 'Pastelería artesanal y confitería contemporánea.' },
      { name: 'Snacks', description: 'Aperitivos, frutos secos y barras energéticas.' },
      { name: 'Accesorios', description: 'Termos isotérmicos, tazas y artículos de diseño.' }
    ];

    for (const cat of categories) {
      await pool.query('INSERT INTO categories (name, description) VALUES (?, ?)', [cat.name, cat.description]);
    }
    console.log('✅ Categorías insertadas.');

    // Obtener IDs
    const [rows] = await pool.query('SELECT * FROM categories');
    
    const catBebidas = rows.find(r => r.name === 'Bebidas').id;
    const catComida = rows.find(r => r.name === 'Comida').id;
    const catPostres = rows.find(r => r.name === 'Postres').id;
    const catSnacks = rows.find(r => r.name === 'Snacks').id;
    const catAccesorios = rows.find(r => r.name === 'Accesorios').id;

    const products = [
      { name: 'Nitro Cold Brew Cyan Reserve', desc: 'Café extraído en frío durante 24 horas infundido con nitrógeno para una textura cremosa aterciopelada.', price: 4.85, stock: 24, catId: catBebidas },
      { name: 'Matcha Latte Ceremonial Jade', desc: 'Grado ceremonial auténtico de Uji con leche vaporizada de avena y sutil toque de miel de azahar.', price: 5.20, stock: 3, catId: catBebidas },
      { name: 'Electric Blue Tonic Espresso', desc: 'Doble shot de espresso premium sobre tónica artesanal con reducción cítrica y flor de guisante de mariposa.', price: 5.50, stock: 0, catId: catBebidas },
      { name: 'Sandwich Bagel de Salmón Ahumado', desc: 'Bagel artesanal con semillas de amapola, crema de eneldo, alcaparras y láminas de salmón noruego.', price: 8.90, stock: 14, catId: catComida },
      { name: 'Cheesecake de Frutos del Bosque', desc: 'Base crocante de galleta de cacao puro, crema ligera de queso y compota de moras silvestres.', price: 6.00, stock: 2, catId: catPostres },
      { name: 'Almendras Tostadas con Romero', desc: 'Mix crocante horneado en pequeños lotes con aceite de oliva extra virgen y finas hierbas mediterráneas.', price: 3.75, stock: 38, catId: catSnacks },
      { name: 'Termo AeroVacuum 750ml Obsidian', desc: 'Aislamiento térmico de doble capa en acero inoxidable quirúrgico con recubrimiento mate antideslizante.', price: 26.50, stock: 10, catId: catAccesorios }
    ];

    for (const prod of products) {
      await pool.query(
        'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [prod.name, prod.desc, prod.price, prod.stock, prod.catId, '']
      );
    }
    console.log('✅ Productos insertados.');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seed();
