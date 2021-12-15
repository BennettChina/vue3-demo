<template>
  <nav class="nav-bar">
    <div class="left" @click="goBack">
      <slot name="left">
        <img src="~@img/left.png" alt="left"/>
      </slot>
    </div>
    <div class="center">
      <slot></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </nav>
</template>

<script>
import {useRouter} from "vue-router";

export default {
  name: "NavBar",
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.back();
    }

    return {
      goBack
    }
  }
}
</script>

<style scoped>
.nav-bar {
  background: var(--color-tint);
  color: #FFFFFF;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
  height: 45px;
  line-height: 45px;
  text-align: center;
  box-shadow: 0 2px 0 rgba(100, 100, 100, 0.1);
  display: flex;
}

.left, .right {
  width: 60px;
}

.center {
  flex: 1;
}

.left img {
  width: 45px;
  padding: 12px;
}
</style>
