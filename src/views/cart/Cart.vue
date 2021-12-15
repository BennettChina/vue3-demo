<template>
  <div>
    <nav-bar class="nav-bar">
      <template v-slot:default>购物车(<span style="color: red">{{ $store.state.cartCount }}</span>)
      </template>
    </nav-bar>
    <div class="cart-box">
      <div class="cart-body">
        <van-checkbox-group
            ref="checkboxGroup"
            @change="boxGroupChange"
            v-model="checked"
        >
          <van-swipe-cell
              :right-width="50"
              :key="index"
              v-for="(item, index) in list"
          >
            <div class="good-item">
              <!--选中购物车中商品的ID-->
              <van-checkbox :name="item.id" :disabled="item.goods.stock < 1"/>
              <div class="good-img">
                <img :src="item.goods.cover_url"/>
              </div>
              <div class="good-desc">
                <div class="good-title">
                  <span>{{ item.goods.title }}</span>
                  <span>仅剩:{{ item.goods.stock }}</span>
                </div>
                <div class="good-btn">
                  <div class="price">
                    <small>￥</small>{{ item.goods.price + ".00" }}
                  </div>
                  <van-stepper
                      integer
                      :min="1"
                      :max="item.goods.stock"
                      :model-value="item.num"
                      :name="item.id"
                      async-change
                      @change="modifyCart"
                  />
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                  square
                  icon="delete"
                  type="danger"
                  class="delete-button"
                  @click="deleteGoods(item.id)"
              />
            </template>
          </van-swipe-cell>
        </van-checkbox-group>
      </div>
      <van-submit-bar
          class="submit-all"
          :price="totalPrice * 100"
          @submit="goToBuy"
          button-text="结算"
      >
        <van-checkbox @click="checkAll" v-model="allChecked">全选</van-checkbox>
      </van-submit-bar>

      <div class="empty" v-if="!list.length">
        <img class="empty-cart" src="~@img/empty-car.png" alt="空购物车"/>
        <div class="title">购物车空空如也</div>
        <van-button round color="#1baeae" type="primary" block @click="continueBuy">前往选购</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs, onMounted, computed, ref,} from "vue";
import NavBar from "@common/navbar/NavBar";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {Toast} from "vant";
import {checked, getCartList, remove, updateNum} from "@/network/cart";

export default {
  name: "Cart",
  components: {NavBar},
  setup() {
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      list: [],
      checked: []
    })

    const continueBuy = () => {
      router.push({path: 'category'})
    }

    const init = () => {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        onOpened: () => {
          getCartList({include: 'goods'}).then(res => {
            state.list = res.data;
            state.checked = state.list.filter(item => item.is_checked === 1 && item.goods.stock > 0).map(item => item.id);
            Toast.clear();
          })
        }
      })
    }

    onMounted(() => {
      init();
    })

    const modifyCart = (value, detail) => {
      Toast.loading({
        message: '修改中...',
        duration: 0
      });
      // 更新商品的数量
      updateNum(detail.name, {num: value}).then(() => {
        state.list.forEach(item => {
          item.id === detail.name ? item.num = value : item.num
        })
        Toast.clear();
      });
    }

    const checkboxGroup = ref(null);
    const allChecked = ref(false);

    // 全选按钮事件
    const checkAll = () => {
      checkboxGroup.value.toggleAll({
        skipDisabled: true,
        checked: allChecked.value
      });
    }

    // 实时更新选中状态...
    const boxGroupChange = (names) => {
      // 更新全选按钮的状态
      allChecked.value = names.length === state.list.length;
      checked({cart_ids: names});
    }

    // 删除商品
    const deleteGoods = (id) => {
      remove(id).then(res => {
        if (res.status === 204) {
          // 删除list中的商品
          let index = state.list.findIndex(item => item.id === id);
          index !== -1 && state.list.splice(index, 1);
          // 删除checkbox的选中的商品(如果有的话)
          index = state.checked.findIndex(item => item.id === id);
          index !== -1 && state.checked.splice(index, 1);

          // 更新store中的值
          store.dispatch('updateCart')
          Toast.success('删除成功');
        }
      })
    }

    const totalPrice = computed(() => {
      if (state.list.length < 1) {
        return 0
      }
      return state.list.filter(item => state.checked.includes(item.id))
          .map(item => item.goods.price * item.num)
          .reduce((p, c) => p + c, 0);
    })

    const goToBuy = () => {
      if (state.checked.length < 1) {
        Toast.fail('请选择商品进行结算')
      } else {
        router.push({path: 'createOrder'})
      }
    }

    return {
      ...toRefs(state),
      continueBuy,
      modifyCart,
      checkAll,
      checkboxGroup,
      allChecked,
      boxGroupChange,
      deleteGoods,
      totalPrice,
      goToBuy
    }
  }
}
</script>
<style lang="scss" scoped>
.cart-box {
  .cart-body {
    margin: 60px 0 100px 0;
    padding-left: 10px;

    .good-item {
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

    .delete-button {
      width: 50px;
      height: 100%;
    }
  }

  .empty {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    margin-top: 200px;

    .empty-cart {
      width: 150px;
      margin-bottom: 20px;
    }

    .van-icon-smile-o {
      font-size: 50px;
    }

    .title {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }

  .submit-all {
    margin-bottom: 50px;

    .van-checkbox {
      margin-left: 0px;
    }

    .van-submit-bar__text {
      margin-right: 10px;
    }

    .van-submit-bar__button {
      background: red;
    }
  }

  .van-checkbox__icon--checked .van-icon {
    background-color: red;
    border-color: red;
  }
}
</style>
