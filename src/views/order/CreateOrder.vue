<template>
  <div class="create-order">
    <nav-bar class="nav-bar">
      <template v-slot:default> 订单预览</template>
    </nav-bar>

    <div class="address-wrap" @click="selectAddress">
      <div class="name" v-if="address.name">
        <span>{{ address.name }}</span>
        <span>{{ address.phone }}</span>
      </div>
      <div class="address">
        {{ address.province }} {{ address.city }} {{ address.county }}
        {{ address.address }}
      </div>
      <van-icon class="arrow" name="arrow"/>
    </div>
    <div class="good" v-if="cartList && cartList.length > 0">
      <div class="good-item" v-for="(item, index) in cartList" :key="index">
        <div class="good-img"><img v-lazy="item.goods.cover_url" alt=""/></div>
        <div class="good-desc">
          <div class="good-title">
            <span>{{ item.goods.title }}</span>
            <span>x{{ item.num }}</span>
          </div>
          <div class="good-btn">
            <div class="price">
              <small>¥</small> {{ item.goods.price + ".00" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-submit-bar
        class="submit-all"
        :price="total * 100"
        button-text="生成订单"
        @submit="submit"
    >
      商品金额
    </van-submit-bar>

    <van-popup
        closeable
        :close-on-click-overlay="false"
        v-model:show="showPay"
        position="bottom"
        :style="{ height: '40%' }"
        @close="closePopup"
    >
      <van-grid :border="false" :column-num="2">
        <van-grid-item>
          <p>支付宝二维码</p>
          <van-image width="150" height="150" :src="aliyun"/>
        </van-grid-item>
        <van-grid-item>
          <p>微信二维码</p>
          <van-image width="150" height="150" :src="wechat"/>
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
import {reactive, onMounted, toRefs, computed} from "vue";
import NavBar from "@/components/common/navbar/NavBar";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {Toast} from "vant";
import {createOrder, getPayCode, getPayStatus, previewOrder} from "@/network/order";

export default {
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter(); // 跳转的路由
    const route = useRoute(); // 接收参数的路由
    const store = useStore();
    const state = reactive({
      // 生成一个订单号
      cartList: [],
      address: {},
      showPay: false,
      orderNo: "",
      aliyun: "",
      wechat: "",
    });

    const init = () => {
      Toast.loading({
        message: '加载中...',
        duration: 0
      });

      previewOrder().then(res => {
        state.cartList = res.carts
        state.address = res.address.filter(a => a.is_default === 1)[0] || {
          address: '请选择或添加一个地址'
        }
        Toast.clear()
      })
    }

    onMounted(() => {
      init()
    })

    const total = computed(() => {
      if (state.cartList.length < 1) {
        return 0
      }
      return state.cartList.map(item => item.goods.price * item.num)
          .reduce((p, c) => p + c, 0);
    })

    let timer;
    const submit = () => {
      createOrder({address_id: state.address.id}).then(res => {
        Toast.success({
          message: '订单创建成功'
        })

        store.dispatch('updateCart');
        // 弹出支付弹框
        state.showPay = true;
        state.orderNo = res.id;
        getPayCode(state.orderNo, 'aliyun').then(res => {
          state.aliyun = res.qr_code_url.startsWith('http', 0) ? res.qr_code_url : 'https://api.shop.eduwork.cn' + res.qr_code_url;
        });

        // 微信无法使用
        // getPayCode(state.orderNo, 'wechat').then(res => {
        //   state.wechat = res.qr_code_url.startsWith('http', 0) ? res.qr_code_url : 'https://api.shop.eduwork.cn' + res.qr_code_url;
        // });

        // 轮询查询支付状态
        timer = setInterval(() => {
          getPayStatus(state.orderNo).then(res => {
            // 支付完成
            if (res === 2) {
              clearInterval(timer);
              router.push({path: '/orderDetail', query: {order: state.orderNo}})
            }
          })
        }, 2000)
      })
    }


    return {
      ...toRefs(state),
      selectAddress: () => {
        router.push({path: '/address'})
      },
      total,
      submit,
      closePopup: () => {
        state.showPay = false
        clearInterval(timer)
        router.push({path: '/orderDetail', query: {order: state.orderNo}})
      }
    };
  },
};
</script>

<style lang="scss" scoped>
.create-order {
  background: #f9f9f9;

  .address-wrap {
    text-align: left;
    margin-bottom: 20px;
    background: #fff;
    position: relative;
    margin-top: 44px;
    font-size: 14px;
    padding: 15px;
    color: #222333;

    .name,
    .address {
      margin: 10px 0;
    }

    .name span:first-child {
      padding-right: 5px;
    }

    .arrow {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }

    &::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: -webkit-repeating-linear-gradient(
              135deg,
              #ff6c6c 0,
              #ff6c6c 20%,
              transparent 0,
              transparent 25%,
              #1989fa 0,
              #1989fa 45%,
              transparent 0,
              transparent 50%
      );
      background: repeating-linear-gradient(
              -45deg,
              #ff6c6c 0,
              #ff6c6c 20%,
              transparent 0,
              transparent 25%,
              #1989fa 0,
              #1989fa 45%,
              transparent 0,
              transparent 50%
      );
      background-size: 80px;
      content: "";
    }
  }

  .good {
    margin-bottom: 120px;
  }

  .good-item {
    padding: 10px;
    background: #fff;
    display: flex;

    .good-img {
      img {
        width: 100px;
        height: auto;
      }
    }

    .good-desc {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      padding: 20px;

      .good-title {
        display: flex;
        justify-content: space-between;
      }

      .good-btn {
        display: flex;
        justify-content: space-between;

        .price {
          font-size: 16px;
          color: red;
          line-height: 28px;
        }

        .van-icon-delete {
          font-size: 20px;
          margin-top: 4px;
        }
      }
    }
  }

  .pay-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    padding: 10px 0;
    padding-bottom: 50px;
    border-top: 1px solid #e9e9e9;

    > div {
      display: flex;
      justify-content: space-between;
      padding: 0 5%;
      margin: 10px 0;
      font-size: 14px;

      span:nth-child(2) {
        color: red;
        font-size: 18px;
      }
    }

    .pay-btn {
      position: fixed;
      bottom: 7px;
      right: 0;
      left: 0;
      width: 90%;
      margin: 0 auto;
    }
  }
}

.submit-all {
  margin-bottom: 50px;
  z-index: 9 !important;
}
</style>
