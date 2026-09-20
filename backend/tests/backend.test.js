import test from 'node:test';
import assert from 'node:assert/strict';

import { createRepositories } from '../src/infrastructure/repositories/repositoryFactory.js';
import { createCategory } from '../src/application/usecases/categoryUseCases.js';
import { createProduct } from '../src/application/usecases/productUseCases.js';
import { createOrder } from '../src/application/usecases/orderUseCases.js';
import { ORDER_STATUS } from '../src/domain/orderStatus.js';

const createTestContext = () => createRepositories({ dbPath: ':memory:' });

test('createCategory validates names', async () => {
  const { categoryRepository } = createTestContext();

  const created = await createCategory(categoryRepository, { name: 'Electrónica' });

  assert.equal(created.name, 'Electrónica');
  assert.ok(created.id);
});

test('createProduct enforces price and stock validation', async () => {
  const { productRepository } = createTestContext();

  await assert.rejects(
    () => createProduct(productRepository, { name: 'Mouse', categoryId: 'cat-1', price: 0, stock: 2 }),
    /mayor a 0/
  );

  await assert.rejects(
    () => createProduct(productRepository, { name: 'Teclado', categoryId: 'cat-1', price: 15, stock: -1 }),
    /no puede ser menor a 0/
  );
});

test('createProduct accepts snake_case category ids from the web client', async () => {
  const { productRepository } = createTestContext();

  const product = await createProduct(productRepository, {
    name: 'Mouse USB',
    category_id: 'cat-1',
    price: 12.5,
    stock: 7,
  });

  assert.equal(product.categoryId, 'cat-1');
  assert.equal(product.stock, 7);
});

test('createOrder decrements stock atomically and assigns initial status', async () => {
  const { productRepository, orderRepository, transactionManager } = createTestContext();

  const product = await productRepository.create({
    id: 'prod-100',
    name: 'Camisa',
    description: 'Algodón',
    categoryId: 'cat-1',
    price: 30,
    stock: 5,
  });

  const order = await createOrder(
    { productRepository, orderRepository, transactionManager },
    {
      customerName: 'Juan Pérez',
      customerEmail: 'juan@demo.com',
      items: [{ productId: product.id, quantity: 2 }],
    }
  );

  assert.equal(order.status, ORDER_STATUS.CREADO);
  assert.equal(order.total, 67.8);

  const updatedProduct = await productRepository.getById(product.id);
  assert.equal(updatedProduct.stock, 3);
});

test('createOrder accepts snake_case client payloads and decrements stock', async () => {
  const { productRepository, orderRepository, transactionManager } = createTestContext();

  const product = await productRepository.create({
    id: 'prod-102',
    name: 'Saco',
    description: 'Algodón',
    categoryId: 'cat-1',
    price: 40,
    stock: 4,
  });

  const order = await createOrder(
    { productRepository, orderRepository, transactionManager },
    {
      customer_name: 'Ana García',
      customer_email: 'ana@demo.com',
      items: [{ product_id: product.id, quantity: 2 }],
    }
  );

  assert.equal(order.status, ORDER_STATUS.CREADO);
  assert.equal(order.total, 90.4);

  const updatedProduct = await productRepository.getById(product.id);
  assert.equal(updatedProduct.stock, 2);
});

test('createOrder rejects stock overflow', async () => {
  const { productRepository, orderRepository, transactionManager } = createTestContext();

  const product = await productRepository.create({
    id: 'prod-101',
    name: 'Pantalón',
    description: 'Urban',
    categoryId: 'cat-1',
    price: 50,
    stock: 1,
  });

  await assert.rejects(
    () => createOrder(
      { productRepository, orderRepository, transactionManager },
      {
        customerName: 'Ana García',
        customerEmail: 'ana@demo.com',
        items: [{ productId: product.id, quantity: 2 }],
      }
    ),
    /stock suficiente/
  );
});
