import { createRouter, createWebHistory } from 'vue-router';
import Catalog from '../views/Catalog.vue';
import AdminPanel from '../views/AdminPanel.vue';

const routes = [
  {
    path: '/',
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

// simple route guard using stored user role
router.beforeEach((to, from, next) => {
  if (to.path === '/admin') {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && (user.role_name === 'admin' || user.role === 'admin')) {
        return next();
      }
    } catch (e) {
      // proceed to redirect
    }
    return next({ path: '/' });
  }
  next();
});

export default router;
