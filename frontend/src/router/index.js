import { createRouter, createWebHistory } from 'vue-router';
import Catalog from '../views/Catalog.vue';
import AdminPanel from '../views/AdminPanel.vue';
import Login from '../views/Login.vue'; // <-- 1. Importa tu componente de Login

const routes = [
  // Catálogo público
  {
    path: '/',
    name: 'Login', // <-- 2. Hacemos que la raíz sea el login (o puedes dejar el catálogo y usar /login)
    component: Login
  },
  {
    path: '/catalogo',
    name: 'Catalog',
    component: Catalog,
  },

  // Autenticación (Públicas / Solo invitados)
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guestOnly: true },
  },

  // RF-04: Carrito de compras con IVA 13%
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/CartView.vue'),
  },

  // RF-05: Checkout y Confirmación (Requieren sesión)
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
    component: AdminPanel,
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
  } else if (to.meta.guestOnly && token) {
    next('/');
    return;
  }

  if (to.path === '/admin') {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && (user.role_name === 'admin' || user.role === 'admin')) {
        return next();
      }
    } catch (e) {
      // Ignorar error de parseo
    }
    return next({ path: '/' });
  }

  next();
});
});

export default router;