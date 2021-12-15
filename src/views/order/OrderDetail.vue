<template>
  <div class="order-detail-box">
    <nav-bar class="nav-bar">
      <template v-slot:default> 定单详情</template>
    </nav-bar>
    <div class="order-status">
      <div class="status-item">
        <label>订单状态：{{ statusStr }}</label>
        <span></span>
      </div>
      <div class="status-item">
        <label>订单编号：</label>
        <span>{{ detail.order_no }}</span>
      </div>
      <div class="status-item">
        <label>下单时间：</label>
        <span>{{ detail.created_at }}</span>
      </div>

      <van-button
          v-if="detail.status === 1"
          @click="pay"
          style="margin-bottom: 10px"
          color="#1baeae"
          block>
        去支付
      </van-button>
      <van-button v-if="detail.status === 1" @click="confirmOrderEvent" block>确认订单</van-button>
    </div>
    <div class="order-price">
      <div class="price-item">
        <label>商品金额：</label>
        <span>¥ {{ total + ".00" }}</span>
      </div>
      <div class="price-item">
        <label>配送方式：</label>
        <span>普通快递</span>
      </div>
    </div>

    <van-card
        v-for="item in detail.orderDetails.data"
        :key="item.id"
        :num="item.num"
        :price="item.price + '.00'"
        desc="全场包邮"
        :title="item.goods.title"
        :thumb="item.goods.cover_url"
    />


    <van-popup
        v-model:show="showPay"
        position="bottom"
        :style="{ height: '40%' }"
        @closed="closePopup"
    >
      <div style="width: 90%; margin: 0 auto; padding: 30px 0">
        <van-grid :border="false" :column-num="2">
          <van-grid-item text="支付宝">
            <p>支付宝二维码</p>
            <van-image width="150" height="150" :src="aliyun"/>
          </van-grid-item>
          <van-grid-item text="微信支付">
            <p>微信二维码</p>
            <van-image width="150" height="150" :src="wechat"/>
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {computed, onMounted, reactive, toRefs} from "vue";
import NavBar from "@/components/common/navbar/NavBar";
import {useRoute, useRouter} from "vue-router";
import {Dialog, Toast} from "vant";
import {confirmOrder, getOrderDetail, getPayCode, getPayStatus} from "@/network/order";

export default {
  name: "OrderDetail",
  components: {
    NavBar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      orderNo: "", // 订单ID
      detail: {
        address_id: null,
        amount: null,
        express_no: null,
        express_type: null,
        id: null,
        // 订单详情
        orderDetails: {
          data: [],
        },
        status: 0, // 初始状态为0
        order_no: '',
        created_at: null,
        pay_time: null,
        pay_type: null,
        trade_no: null,
        updated_at: null,
        user_id: null
      },
      showPay: false,
      aliyun: "",
      wechat: "",
    });

    const init = () => {
      getOrderDetail(state.orderNo, 'orderDetails.goods,user').then(res => {
        state.detail = res;
      })
    }

    onMounted(() => {
      state.orderNo = route.query.order || '';
      Toast.loading({message: '加载中...', duration: 0})
      // 初始化数据
      init()
      Toast.clear();
    })

    const statusStr = computed(() => {
      let status = ['', '未支付', '已支付', '等待发货', '确认收货', '已过期']
      return status[state.detail.status];
    })

    const total = computed(() => {
      if (state.detail.orderDetails.data.length < 1) {
        return 0
      }
      return state.detail.orderDetails.data
          .map(item => item.goods.price * item.num)
          .reduce((p, c) => p + c, 0);
    })

    let timer;
    const pay = () => {
      state.showPay = true;
      getPayCode(state.orderNo, 'aliyun').then(res => {
        state.aliyun = res.qr_code_url.startsWith('http', 0) ? res.qr_code_url : 'https://api.shop.eduwork.cn' + res.qr_code_url;
      })
      timer = setInterval(() => {
        getPayStatus(state.orderNo).then(res => {
          // 支付完成
          if (res === 2) {
            clearInterval(timer);
            init()
            state.showPay = false;
          }
        })
      }, 2000);
    }

    const confirmOrderEvent = () => {
      Dialog.confirm({
        title: '是否确认订单'
      }).then(() => {
        // confirm
        confirmOrder(state.orderNo).then(res => {
          if (res.status_code === 204) {
            Toast.success('已确认收货');
            init();
          }
        })
      }).catch(() => {
        // cancel
      })
    }
    return {
      ...toRefs(state),
      statusStr,
      total,
      pay,
      closePopup: () => {
        clearInterval(timer);
      },
      confirmOrderEvent
    };
  },
};
</script>

<style lang="scss" scoped>
.order-detail-box {
  text-align: left;
  background: #f7f7f7;

  .order-status {
    background: #fff;
    margin-top: 44px;
    padding: 20px;
    font-size: 15px;

    .status-item {
      margin-bottom: 10px;

      label {
        color: #999;
      }
    }
  }

  .order-price {
    background: #fff;
    margin: 20px 0;
    padding: 20px;
    font-size: 15px;

    .price-item {
      margin-bottom: 10px;

      label {
        color: #999;
      }
    }
  }

  .van-card {
    margin-top: 0;
    // 使用深度选择器修改组件中的公共样式,否则无法修改到组件中的样式
    ::v-deep(.van-card__thumb) {
      height: auto;
    }
  }
}
</style>
