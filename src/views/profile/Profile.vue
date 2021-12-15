<template>
  <div>
    <nav-bar>
      <template v-slot:default>个人中心</template>
    </nav-bar>

    <div class="user-box">
      <div class="user-info">
        <div class="info">
          <img :src="user.avatar_url || 'https://source.hibennett.cn/blog/85CAFF29-5B1C-4B25-9685-F531F694792B_1605613051191.jpeg'"
               alt="avatar"/>
          <div class="user-desc">
            <span>昵称：{{ user.name }}</span>
            <span>登录名：{{ user.email }}</span>
            <span class="name">个性签名：机会只留给有准备的人</span>
          </div>
        </div>
      </div>

      <ul class="user-list">
        <li class="van-hairline--bottom" @click="goTo('/collect')">
          <span>我的收藏</span>
          <van-icon name="arrow"/>
        </li>
        <li class="van-hairline--bottom" @click="goTo('/orders')">
          <span>我的订单</span>
          <van-icon name="arrow"/>
        </li>
        <li class="van-hairline--bottom" @click="goTo('/setting')">
          <span>账号管理</span>
          <van-icon name="arrow"/>
        </li>
        <li class="van-hairline--bottom" @click="goTo('/address')">
          <span>地址管理</span>
          <van-icon name="arrow"/>
        </li>
        <li class="van-hairline--bottom" @click="goTo('/about')">
          <span>关于我们</span>
          <van-icon name="arrow"/>
        </li>
      </ul>
    </div>

    <div style="margin: 16px">
      <van-button round block color="#44BA80" @click="toLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script>
import NavBar from "@common/navbar/NavBar";
import {getUser, logout} from "@/network/profile";
import {Toast} from "vant";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {onMounted, reactive, toRefs} from "vue";

export default {
  name: "Profile",
  components: {
    NavBar
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      user: {}
    })

    onMounted(() => {
      getUser().then(res => {
        state.user = res;
      })
    })

    const toLogout = () => {
      logout().then(res => {
        if (res.status === 204) {
          Toast.success('退出成功')
          window.localStorage.removeItem('token');
          store.commit('setIsLogin', true);
          setTimeout(() => {
            router.push({path: '/login'});
          }, 500)
        }
      })
    }

    return {
      toLogout,
      goTo: (path) => {
        router.push({path})
      },
      ...toRefs(state)
    }
  }
}
</script>

<style scoped lang="scss">
#box {
  background: #fcfcfc;
  height: 100vh;
}

.user-box {
  margin-top: 65px;

  .user-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    width: 100%;
    height: 44px;
    line-height: 44px;
    padding: 0 10px;
    color: #252525;
    background: #fff;
    border-bottom: 1px solid #dcdcdc;

    .user-name {
      font-size: 14px;
    }
  }

  .user-info {
    width: 94%;
    height: 115px;
    background: linear-gradient(90deg, #31c7a7, #a1c7c7);
    box-shadow: 0 2px 5px #269090;
    border-radius: 6px;
    margin: 50px 10px 10px;
    text-align: left;

    .info {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      padding: 25px 20px;

      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-top: 4px;
      }

      .user-desc {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        line-height: 20px;
        font-size: 14px;
        color: #fff;

        span {
          color: #fff;
          font-size: 14px;
          padding: 2px 0;
        }
      }

      .account-setting {
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 13px;
        color: #fff;

        .van-icon-setting-o {
          font-size: 16px;
          vertical-align: -3px;
          margin-right: 4px;
        }
      }
    }
  }

  .user-list {
    padding: 0 8px;
    margin-top: 40px;

    li {
      padding-left: 5px;
      padding-right: 5px;
      height: 40px;
      line-height: 40px;
      display: flex;
      justify-content: space-between;
      font-size: 14px;

      .van-icon-arrow {
        margin-top: 13px;
      }

      margin: 20px 0 !important;
      background: #ffffff;
      border-radius: 3px;
    }
  }
}
</style>
