<template>
  <div class="recommend">
    <div class="recommend-item" v-for="recommend in recommends.slice(0, 4)" :key="recommend.id">
      <a href="" @click.prevent="goContent(recommend.id)">
        <img v-lazy="recommend.cover_url" :alt="recommend.title">
        <div>{{recommend.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
import {useRouter} from "vue-router";

export default {
  name: "RecommendView",
  props: {
    recommends: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  setup() {
    const router = useRouter();
    const goContent = (id) => {
      router.push({
        path: '/content',
        query: {id}
      });
    };

    return {
      goContent
    }
  }
}
</script>

<style scoped lang="scss">
.recommend {
  width: 100%;
  display: flex;
}
.recommend-item {
  flex: 1;
  padding: 15px 0 30px;
  border-bottom: 8px solid #EEE;
  img {
    width: 70px;
    height: 70px;
    margin-bottom: 10px;
    font-size: 12px;
  }
}
</style>
