<template>
  <div id="home">
    <nav-bar>
      <template v-slot:default>图书兄弟</template>
    </nav-bar>
    <tab v-show="isTabFixed" @tab-click="tabClick" :titles="['畅销', '新书', '精选']"></tab>
    <div class="wrapper">
      <div class="contents">
        <div ref="bannerRef">
          <home-swiper :style="swiperStyle" :banners="banners"></home-swiper>
          <recommend-view :recommends="recommends"></recommend-view>
        </div>

        <tab @tab-click="tabClick" :titles="['畅销', '新书', '精选']"></tab>

        <goods-list :goods="showGoods"></goods-list>
      </div>
    </div>
    <back-top @back-top="backTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from "@home/components/HomeSwiper";
import NavBar from "@common/navbar/NavBar";
import RecommendView from "@home/components/RecommendView";
import {computed, nextTick, onMounted, reactive, ref, watchEffect} from "vue";
import {getAll, getGoods} from "@/network/home";
import Tab from "@content/tab/Tab";
import GoodsList from "@content/goods/GoodsList";
import BetterScroll from 'better-scroll';
import BackTop from "@common/backtop/BackTop";

export default {
  name: 'Home',
  components: {
    NavBar,
    RecommendView,
    Tab,
    GoodsList,
    BackTop,
    HomeSwiper
  },
  setup() {
    const recommends = ref([]);
    let banners = ref([]);
    const goods = reactive({
      sales: {page: 1, list: []},
      recommend: {page: 1, list: []},
      new: {page: 1, list: []},
    });

    const currentType = ref('sales');
    const showGoods = computed(() => {
          return goods[currentType.value].list
        }
    );
    let betterScroll = reactive({});
    let bannerRef = ref(null);
    let isTabFixed = ref(false);
    let isShowBackTop = ref(false);
    let swiperStyle = reactive({});

    onMounted(() => {
      // 创建滑动对象
      betterScroll = new BetterScroll('.wrapper', {
        // movable: true,
        // zoom: true,
        probeType: 3,
        click: true,
        pullUpLoad: true,
        // bindToWrapper: true,
        // disableTouch: false,
        // disableMouse: false,
        mouseWheel: true
      })

      swiperStyle = {
        'margin-top': '45px'
      }


      betterScroll.on('scroll', (pos) => {
        isShowBackTop.value = isTabFixed.value = (-pos.y) > bannerRef.value.offsetHeight;
      });

      betterScroll.on('pullingUp', () => {
        let page = goods[currentType.value].page + 1;
        getGoods(currentType.value, page).then(resp => {
          resp.goods.data.forEach(v => {
            if (!goods[currentType.value].list.map(bo => bo.id).includes(v.id)) {
              goods[currentType.value].list.push(v)
            }
          })
          goods[currentType.value].page = page;
        });

        betterScroll.finishPullUp();

        betterScroll.refresh();
      });

      getAll().then(resp => {
        recommends.value = resp.goods.data;
        banners.value = resp.slides.slice(0,2);
      }).catch(err => console.error(err));

      getGoods().then(data => {
        goods.sales.list = data.goods.data;
      }).catch(err => console.error(err));
    });

    const tabClick = (index) => {
      const types = ['sales', 'new', 'recommend'];
      getGoods(types[index]).then(data => {
        goods[types[index]].list = data.goods.data;
      }).catch(err => console.error(err));

      return currentType.value = types[index];
    }

    // 监听页面变化
    watchEffect(() => {
      // DOM渲染完成后执行
      nextTick(() => {
        // 重新计算高度
        betterScroll && betterScroll.refresh();
      })
    });

    let backTop = () => {
      // 0,0是目标坐标，500是滚动动画执行的时长(ms)
      betterScroll.scrollTo(0, 0, 500);
    };

    return {
      recommends,
      tabClick,
      goods,
      showGoods,
      isTabFixed,
      bannerRef,
      isShowBackTop,
      backTop,
      banners,
      swiperStyle
    }
  }
};
</script>

<style scoped>
#home {
  position: relative;
  height: 100vh;
}

.banners img {
  width: 100%;
  height: auto;
}

.wrapper {
  position: absolute;
  top: 45px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;
}

.contents {

}
</style>
