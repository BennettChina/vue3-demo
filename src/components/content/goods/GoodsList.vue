<template>
  <div class="goods">
    <goods v-for="item in goods" :item="item" :key="item.id"></goods>
  </div>
</template>
<script>
import Goods from "@content/goods/Goods";

export default {
  name: "GoodsList",
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    Goods
  }
}
</script>

<style scoped>
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 5px 10px;
  z-index: 9;
}
</style>
