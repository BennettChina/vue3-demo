import {createStore} from 'vuex';
import {getCartList} from "@/network/cart";

export default createStore({
    state: {
        tabCurrentIdx: 0,
        user: {
            isLogin: !!window.localStorage.getItem('token')
        },
        cartCount: 0
    },
    mutations: {
        setIsLogin(state, payload) {
            state.user.isLogin = payload;
        },
        setCartNum(state, payload=0) {
            state.cartCount=payload
        }
    },
    actions: {
        updateCart({commit}) {
            getCartList({include: 'goods'}).then(res=>{
                commit('setCartNum', res.data.length || 0)
            })
        }
    },
    modules: {},
});
