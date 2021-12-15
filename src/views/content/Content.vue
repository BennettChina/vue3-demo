<template>
  <div>
    <nav-bar>
      <template v-slot:default>商品详情:{{ id }}</template>
    </nav-bar>

    <van-image
        style="margin-top: 45px"
        lazy-load
        width="100%"
        :src="content.cover_url"
    />

    <van-card style="text-align: left"
              :num="content.stock"
              :price="content.price+'.00'"
              :desc="content.description"
              :title="content.title"
    >
      <template #tags>
        <van-tag plain type="danger" v-show="content.is_recommend">推荐</van-tag>
      </template>
      <template #footer>
        <van-button type="warning" :disabled="content.stock<1" @click="addCart">加入购物车</van-button>
        <van-button type="danger" :disabled="content.stock<1" @click="buy">立即购买</van-button>
      </template>
    </van-card>

    <van-tabs v-model:active="active">
      <van-tab title="概述">
        <div v-html="content.details" class="desc-content"></div>
      </van-tab>
      <van-tab title="热评">
        <div v-for="item in content.comments" :key="item.id">
          {{ item.user.name }}:
          <div>{{ item.content }}</div>
        </div>
      </van-tab>
      <van-tab title="相关图书">
        <goods-list :goods="like_goods"></goods-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import NavBar from "@common/navbar/NavBar";
import {useRoute} from "vue-router";
import {onMounted, reactive, ref, toRefs} from "vue";
import {getContent} from "@/network/content";
import GoodsList from "@content/goods/GoodsList";
import {addToCart} from "@/network/cart";
import {Toast} from "vant";
import {useStore} from "vuex";
import router from "@/router";

export default {
  name: "Content",
  components: {
    NavBar,
    GoodsList
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const id = ref('');
    id.value = route.query.id;

    let book = reactive({
      content: {},
      like_goods: [],
    })

    let active = ref(0);

    onMounted(() => {
      getContent(id.value).then(resp => {
        book.content = resp.goods
        book.like_goods = resp.like_goods
      })
    })

    const addCart = () => {
      addToCart({goods_id: book.content.id, num: 1}).then(resp => {
        if (resp.status === 201 || resp.status === 204) {
          Toast.success('添加成功');
          // 更新购物车数量
          store.dispatch('updateCart');
        }
      })
    }

    const buy = async () => {
      await addCart();
      await router.push({path: '/createOrder'})
    }

    return {
      id,
      ...toRefs(book),
      active,
      addCart,
      buy
    }
  }
}
</script>

<style scoped lang="scss">
.desc-content {
  padding: 10px;
}
</style>
