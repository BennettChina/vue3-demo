<template>
  <div>
    <nav-bar>
      <template v-slot:default>图书分类</template>
    </nav-bar>

    <div id="main">
      <div class="order-tab">
        <van-tabs v-model="active" @click-tab="tabClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评论排序"></van-tab>
        </van-tabs>
      </div>

      <div>
        <van-sidebar class="sidebar" v-model="activeKey">
          <van-collapse v-model="activeName" accordion>
            <van-collapse-item :title="item.name" :name="item.name" v-for="item in categories" :key="item.id">
              <van-sidebar-item :title="sub.name" v-for="sub in item.children" :key="sub.id"
                                @click="getCategoryGoods(sub.id)"/>
            </van-collapse-item>
          </van-collapse>
        </van-sidebar>
      </div>

      <div class="contents">
        <div class="content" v-if="showGoods && showGoods.length > 0">
          <van-card
              load-lazy="true"
              @click="toGoodsDetails(item.id)"
              :num="item.comments_count"
              :tag="item.comments_count >= 0 ? '流行' : ''"
              :price="item.price+'.00'"
              :title="item.title"
              :thumb="item.cover_url"
              v-for="item in showGoods" :key="item.id"
          />
        </div>
        <div v-else>
          暂无此类图书
        </div>
      </div>
    </div>

    <back-top @back-top="backTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from "@common/navbar/NavBar";
import BackTop from "@common/backtop/BackTop";
import {computed, nextTick, onMounted, reactive, ref, watchEffect} from "vue";
import {getCategory, getGoodsList} from "@/network/category";
import BetterScroll from "better-scroll";
import {useRouter} from "vue-router";

export default {
  name: "Category",
  components: {
    NavBar,
    BackTop
  },
  setup() {
    let activeKey = ref(0);
    let categories = ref([]);
    let activeName = ref('');
    let active = ref(1);
    let currentOrderType = ref('sales');
    let currentCid = ref(0);
    let betterScroll = reactive({});
    const router = useRouter();

    let goods = reactive({
      sales: {page: 1, list: []},
      price: {page: 1, list: []},
      comments_count: {page: 1, list: []}
    })

    const showGoods = computed(() => {
      return goods[currentOrderType.value].list
    })

    const getGoodsData = () => {
      getGoodsList(currentOrderType.value, 1, currentCid.value).then(res => {
        goods[currentOrderType.value].list = res.goods.data
      })
    }

    let isShowBackTop = ref(false);

    onMounted(() => {
      // 创建滑动对象
      betterScroll = new BetterScroll('.contents', {
        probeType: 3,
        click: true,
        pullUpLoad: true,
        mouseWheel: true
      })

      getCategory().then(res => {
        categories.value = res.categories
      })

      getGoodsData();

      betterScroll.on('scroll', (pos) => {
        isShowBackTop.value = (-pos.y) > 300;
      });

      betterScroll.on('pullingUp', () => {
        let page = goods[currentOrderType.value].page + 1;
        getGoodsList(currentOrderType.value, page, currentCid.value).then(res => {
          goods[currentOrderType.value].list.push(...res.goods.data);
          goods[currentOrderType.value].page = page;
        })

        betterScroll.finishPullUp();
        betterScroll.refresh();
      });

    });

    // 返回顶部按钮事件
    const backTop = () => {
      // 0,0是目标坐标，500是滚动动画执行的时长(ms)
      betterScroll && betterScroll.scrollTo(0, 0, 500);
    }

    // 排序选项卡事件
    const tabClick = ({name}) => {
      let orderTypes = ['sales', 'price', 'comments_count'];
      currentOrderType.value = orderTypes[name];

      getGoodsData();

      nextTick(() => {
        // 重新计算高度
        betterScroll && betterScroll.refresh();
      })
    }

    // 筛选事件
    const getCategoryGoods = (id) => {
      currentCid.value = id;

      getGoodsData();
    }

    // 监听页面变化
    watchEffect(() => {
      // DOM渲染完成后执行
      nextTick(() => {
        // 重新计算高度
        betterScroll && betterScroll.refresh();
      })
    });

    return {
      activeKey,
      categories,
      activeName,
      active,
      tabClick,
      getCategoryGoods,
      showGoods,
      betterScroll,
      isShowBackTop,
      backTop,
      toGoodsDetails: (id) => {
        router.push({path: '/content', query: {id}})
      }
    }
  }
}
</script>

<style scoped lang="scss">
#main {
  margin-top: 45px;
  display: flex;

  .order-tab {
    flex: 1;
    height: 50px;
    position: fixed;
    top: 45px;
    left: 130px;
    right: 0;
    z-index: 9;
  }

  .sidebar {
    width: 130px;
    position: fixed;
    top: 95px;
    left: 0;
  }

  .contents {
    flex: 1;
    height: 100vh;
    position: absolute;
    top: 95px;
    left: 130px;
    right: 0;
    padding: 10px;
    text-align: left !important;
  }

  .van-card__thumb {
    width: 58px !important;
  }
}
</style>
