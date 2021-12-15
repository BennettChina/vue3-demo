<template>
  <van-swipe v-if="banners.length" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="(banner, index) in banners" :key="index">
      <img v-lazy="banner.img_url" :alt="banner.title">
    </van-swipe-item>
  </van-swipe>
</template>

<script>
export default {
  name: "HomeSwiper",
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      }
    }
  }
}
</script>

<style scoped>
img {
  width: 100%;
  height: auto !important;
}
</style>
