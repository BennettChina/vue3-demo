<template>
  <div class="goods-item" @click="toGoodsContent(item.id)">
    <img v-lazy="item.cover_url" :alt="item.title">
    <div class="goods-info">
      <p>{{ item.title }}</p>
      <span class="price">
      <small>¥</small>{{ item.price }}
    </span>
      <span class="collect">{{ item.collects_count }}</span>
    </div>
  </div>
</template>

<script>
import {useRouter} from "vue-router";

export default {
  name: "Goods",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  setup() {
    let router = useRouter();
    return {
      toGoodsContent: (id) => {
        router.push({path: '/content.js', query: {id}})
      }
    }
  }
}
</script>

<style scoped lang="scss">
.goods-item {
  width: 45%;
  padding-bottom: 40px;
  position: relative;

  img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    overflow: hidden;
    text-align: center;

    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 3px;
    }

    .price {
      color: red;
      margin-right: 20px;
    }

    .collect {
      position: relative;
    }

    .collect::before {
      content: '';
      position: absolute;
      width: 15px;
      height: 15px;
      left: -15px;
      top: -0.1px;
      background: url('~@img/collect.png') 0 0/15px 15px;
    }
  }
}
</style>
