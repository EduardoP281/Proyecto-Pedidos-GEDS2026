import { createRouter, createWebHistory } from 'vue-router';
import Catalog from '../views/Catalog.vue';
import AdminPanel from '../views/AdminPanel.vue';
import Login from '../views/Login.vue'; // <-- 1. Importa tu componente de Login

const routes = [
  {
    path: '/',
    name: 'Login', // <-- 2. Hacemos que la raíz sea el login (o puedes dejar el catálogo y usar /login)
    component: Login
  },
  {
    path: '/catalogo',
    name: 'Catalog',
    component: Catalog
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guardián de rutas
router.beforeEach((to, from, next) => {
  if (to.path === '/admin') {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && (user.role_name === 'admin' || user.role === 'admin')) {
        return next();
      }
    } catch (e) {
      // Ignorar error de parseo
    }
    // Si no es admin o no está logueado, mandarlo al login
    return next({ path: '/' }); 
  }
  next();
});

export default router;