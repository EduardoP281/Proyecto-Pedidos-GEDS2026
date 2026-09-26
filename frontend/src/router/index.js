import { createRouter, createWebHistory } from 'vue-router';
import Catalog from '../views/Catalog.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Catalog',
    component: Catalog,
  },
  {
    path: '/catalog',
    name: 'CatalogAlias',
    component: Catalog,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/CartView.vue'),
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/order-confirmation',
    name: 'OrderConfirmation',
    component: () => import('../views/OrderConfirmation.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: () => import('../views/OrderList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: () => import('../views/AdminPanel.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/orders',
    name: 'OrderMonitoring',
    component: () => import('../views/OrderMonitoring.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
    return;
  }

  if (to.meta.guestOnly && token) {
    next('/');
    return;
  }

  if (to.path === '/admin') {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && (user.role_name === 'admin' || user.role === 'admin')) {
        next();
        return;
      }
    } catch (error) {
      // ignore parse failures; redirect to catalog
    }
    next('/');
    return;
  }

  next();
});

export default router;