<template>
  <div>
    <nav-bar>
      <template v-slot:default>用户登录</template>
    </nav-bar>

    <div style="margin-top: 50px;">
      <div style="text-align: center; padding-top: 50px;">
        <van-image width="8rem"
                   fit="cover"
                   round
                   src="https://source.hibennett.cn/blog/85CAFF29-5B1C-4B25-9685-F531F694792B_1605613051191.jpeg"/>
      </div>
    </div>

    <van-form @submit="onSubmit" style="padding-top: 20px">
      <van-cell-group inset>
        <van-field
            v-model="email"
            name="email"
            label="邮箱"
            placeholder="邮箱地址"
            :rules="[{ required: true, message: '请填写邮箱' }]"
        />
        <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>

      <div style="margin: 16px;">
        <div class="link-login" @click="$router.push({path: '/register', query: {name}})">无账号，去注册</div>
        <van-button round block native-type="submit" color="#42b983">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import {reactive, ref, toRefs} from "vue";
import {login} from "@/network/profile";
import {Toast} from 'vant';
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";

export default {
  name: "Register",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const user = reactive({
      password: '',
      email: route.query.email
    })
    const onSubmit = (values) => {
      login(values).then(res => {
        window.localStorage.setItem('token', res.token_type + ' ' + res.access_token);
        store.commit('setIsLogin', true);
        Toast.success({
          message: '登录成功',
          onClose: () => {
            router.push({path: '/profile'});
          }
        })
      });
    };

    return {
      onSubmit,
      ...toRefs(user)
    };
  }
}
</script>

<style scoped>
.link-login {
  font-size: 14px;
  margin-bottom: 20px;
  color: var(--color-tint);
  display: inline-block;
}
</style>
