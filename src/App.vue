<template>
  <div id="nav">
    <router-link to="/" class="tab-bar-item">
      <div class="icon"><i class="iconfont icon-home"></i></div>
      <div>首页</div>
    </router-link>
    <router-link to="/category" class="tab-bar-item">
      <div class="icon"><i class="iconfont icon-category"></i></div>
      <div>分类</div>
    </router-link>
    <router-link to="/cart" class="tab-bar-item">
      <div class="icon">
        <van-badge :content="$store.state.cartCount" max="9">
          <i class="iconfont icon-cart"></i>
        </van-badge>
      </div>
      <div>购物车</div>
    </router-link>
    <router-link to="/profile" class="tab-bar-item">
      <div class="icon"><i class="iconfont icon-profile"></i></div>
      <div>我的</div>
    </router-link>
  </div>

  <router-view v-slot="{Component}">
    <transition>
      <keep-alive exclude="Content">
        <component :is="Component"/>
      </keep-alive>
    </transition>
  </router-view>
<!--  <router-view/>-->
</template>

<script>
import {useStore} from "vuex";
import {onMounted} from "vue";

export default {
  name: 'App',
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch('updateCart');
    });
  }
}
</script>

<style lang="scss">
@import "~@css/base.css";
@import "~@css/iconfont.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  background: #F6F6F6;
  display: flex;
  position: fixed;
  z-index: 9;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 -3px 1px rgba(100, 100, 100, 0.1);

  a {
    color: var(--color-text);

    &.router-link-exact-active {
      color: var(--color-hight-text);
    }
  }

  .tab-bar-item {
    flex: 1;
    height: 50px;
    font-size: var(--font-size);
  }

  .tab-bar-item .icon {
    width: 24px;
    height: 24px;
    margin-top: 5px;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
