import {createRouter, createWebHistory} from 'vue-router';
import store from '@/store';
import {Toast} from "vant";

const routes = [
    {
        path: '/',
        name: 'Default',
        component: () => import('@/views/home/Home'),
        meta: {
            title: '图书兄弟-首页'
        }
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/Home'),
        meta: {
            title: '图书兄弟-首页'
        }
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile/Profile'),
        meta: {
            title: '图书兄弟-个人中心',
            isRequiredAuth: true
        }
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/views/cart/Cart'),
        meta: {
            title: '图书兄弟-购物车',
            isRequiredAuth: true
        }
    },
    {
        path: '/content',
        name: 'content',
        component: () => import('@/views/content/Content'),
        meta: {
            title: '图书兄弟-商品详情'
        }
    },
    {
        path: '/category',
        name: 'category',
        component: () => import('@/views/category/Category'),
        meta: {
            title: '图书兄弟-图书分类'
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/profile/Register'),
        meta: {
            title: '图书兄弟-用户注册'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/profile/Login'),
        meta: {
            title: '图书兄弟-用户登录'
        }
    },
    {
        path: '/address',
        name: 'address',
        component: () => import('@/views/profile/Address'),
        meta: {
            title: '图书兄弟-地址管理',
            isRequiredAuth: true
        }
    },
    {
        path: '/addressEdit',
        name: 'addressEdit',
        component: () => import('@/views/profile/AddressEdit'),
        meta: {
            title: '图书兄弟-地址编辑',
            isRequiredAuth: true
        }
    },
    {
        path: '/createOrder',
        name: 'createOrder',
        component: () => import('@/views/order/CreateOrder'),
        meta: {
            title: '图书兄弟-创建订单',
            isRequiredAuth: true
        }
    },
    {
        path: '/orders',
        name: 'orders',
        component: () => import('@/views/order/Orders'),
        meta: {
            title: '图书兄弟-订单列表',
            isRequiredAuth: true
        }
    },
    {
        path: '/orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/order/OrderDetail'),
        meta: {
            title: '图书兄弟-订单详情',
            isRequiredAuth: true
        }
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from) => {
    if (to.meta.isRequiredAuth && store.state.user.isLogin === false){
        Toast.fail({
            message: '登录过期，请先登录',
            duration: 1000
        })
        return {
            replace: true,
            name: 'login'
        }
    }
    document.title = to.meta.title;
    return true;
})

export default router;
