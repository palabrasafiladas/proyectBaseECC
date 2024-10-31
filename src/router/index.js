import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';



const router = createRouter({
    history: createWebHistory(),
    routes: [
       
        {
            path: '/e-commerce',
            component: AppLayout,
            children: [
                // {
                //     path: '/e-commerce',
                //     name: 'e-commerce',
                //     meta: {
                //         breadcrumb: ['E-Commerce Dashboard'],
                //         requiresAuth: true,
                        
                //     },
                //     component: () => import('@/views/dashboards/Ecommerce.vue')
                // },
              
                {
                    path: '/ecommerce/product-overview',
                    name: 'product-overview',
                    meta: {
                        breadcrumb: ['E-Commerce', 'Product Overview'],
                        requiresAuth: true
                    },
                    component: () => import('@/views/e-commerce/ProductOverview.vue')
                },
                {
                    path: '/ecommerce/product-list/:slug?',
                    name: 'product-list',
                    meta: {
                        breadcrumb: ['Inicio','Categorias', 'Productos'],
                        requiresAuth: true
                    },
                    component: () => import('@/views/e-commerce/ProductList.vue')
                },
                
                // {
                //     path: '/ecommerce/categorias-products',
                //     name: 'categorias-products',
                //     meta: {
                //         breadcrumb: ['E-Commerce', 'categorias-productos']
                //     },
                //     component: () => import('@/views/e-commerce/CategoriasProducts')
                // },
                {
                    path: '/ecommerce/shopping-cart',
                    name: 'shopping-cart',
                    meta: {
                        breadcrumb: ['Productos', 'Resumen de productos'],
                        requiresAuth: true,
                    },
                    component: () => import('@/views/e-commerce/ShoppingCart.vue')
                },
                {
                    path: '/ecommerce/checkout-form',
                    name: 'checkout-form',
                    meta: {
                        breadcrumb: ['Resumen de productos', 'Detalle de Presupuesto'],
                        requiresAuth: true,
                    },
                    component: () => import('@/views/e-commerce/CheckoutForm.vue')
                },

                //pasando parametro de id con router push
                {
                    path: '/ecommerce/detalle-presupuesto/:id',
                    name: 'detalle-presupuesto',
                    meta: {
                        breadcrumb: ['Detalle de presupuesto'],
                        requiresAuth: true,
                    },
                    component: () => import('@/views/e-commerce/DetallePresupuesto.vue'),
                    // Define props como una función y devuelve true para pasar todos los parámetros de ruta como props al componente
                    props: route => ({ id: route.params.id }),
                    //antes de entrar me imprime mi valor de id
                    beforeEnter: (to, from, next) => {
                        console.log('ID del presupuesto:', to.params.id);
                        next();
                    }
                },
                
                //pasando parametro de id con router push con mi pantalla de producto
                {
                    path: '/ecommerce/productos-detalle/:id',
                    name: 'productos-detalle',
                    meta: {
                        breadcrumb: ['Detalle de producto'],
                        requiresAuth: true,
                    },
                    component: () => import('@/views/e-commerce/ProductosDetalle.vue'),
                    // Define props como una función y devuelve true para pasar todos los parámetros de ruta como props al componente
                    props: route => ({ id: route.params.id }),
                    //antes de entrar me imprime mi valor de id
                    beforeEnter: (to, from, next) => {
                        //console.log para imprimir el valor del parámetro ":id"
                        console.log('ID del producto', to.params.id);
                        next();
                    }
                },

                {
                    path: '/ecommerce/checkout-form',
                    name: 'checkout-form',
                    meta: {
                        breadcrumb: ['Resumen de productos', 'Detalle de Presupuesto'],
                        requiresAuth: true,
                    },
                    component: () => import('@/views/e-commerce/CheckoutForm.vue')
                },

                
                {
                    path: '/ecommerce/order-history',
                    name: 'order-history',
                    meta: {
                        breadcrumb: ['Inicio' ,'Presupuestos realizados'],
                        requiresAuth: true,
                    },
                    component: () => import('@/views/e-commerce/OrderHistory.vue')
                },
                {
                    path: '/ecommerce/HomeCategorias',
                    name: 'homecategorias',
                    meta: {
                        breadcrumb: ['Inicio', 'Categorias'],
                        requiresAuth: true,
                    },
                    component: () => import('@/views/e-commerce/HomeCategorias.vue')
                },
                {
                    path: '/ecommerce/order-summary',
                    name: 'order-summary',
                    meta: {
                        breadcrumb: ['E-Commerce', 'Order Summary'],
                        requiresAuth: true,
                    },
                    component: () => import('@/views/e-commerce/OrderSummary.vue')
                },
                {
                    path: '/profile/create',
                    name: 'user-create',
                    meta: {
                        breadcrumb: ['User Management', 'Create'],
                        requiresAuth: true,
                    },
                    component: () => import('@/views/user-management/UserCreate.vue')
                },
                {
                    path: '/profile/list',
                    name: 'user-list',
                    meta: {
                        breadcrumb: ['User Management', 'List'],
                        requiresAuth: true,
                    },
                    component: () => import('@/views/user-management/UserList.vue')
                },
               
            
               
            ]
        },
       
        {
            path: '/',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
        },
        {
            path: '/auth/forgotpassword',
            name: 'forgotpassword',
            component: () => import('@/views/pages/auth/ForgotPassword.vue')
        },
        {
            path: '/auth/newpassword',
            name: 'newpassword',
            component: () => import('@/views/pages/auth/NewPassword.vue')
        },
        {
            path: '/auth/verification',
            name: 'verification',
            component: () => import('@/views/pages/auth/Verification.vue')
        },
        {
            path: '/auth/lockscreen',
            name: 'lockscreen',
            component: () => import('@/views/pages/auth/LockScreen.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        }
        
    ],
    scrollBehavior() {
        return { left: 0, top: 0 };
    }
});
//validación de rutas
router.beforeEach((to, from, next) => {
    let requiresAuth = to.meta.requiresAuth;
    let token = sessionStorage.getItem('token'); // Recupera el token de sessionStorage
  
    if (requiresAuth && !token) {
      // Redirecciona a la página de inicio si no se encuentra ningún token
      next('/');
    } else {
      // Permite la navegación si el token está presente o la ruta no requiere autenticación
      next();
    }
  });
  
export default router;
