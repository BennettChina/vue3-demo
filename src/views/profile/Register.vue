<template>
  <div>
    <nav-bar>
      <template v-slot:default>用户注册</template>
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
            v-model="name"
            name="name"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
            v-model="password_confirmation"
            type="password"
            name="password_confirmation"
            label="确认密码"
            placeholder="确认密码"
            :rules="[{ required: true, message: '请填写确认密码' }]"
        />
        <van-field
            v-model="email"
            name="email"
            label="邮箱"
            placeholder="邮箱地址"
            :rules="[{ required: true, message: '请填写邮箱' }]"
        />
      </van-cell-group>

      <div style="margin: 16px;">
        <div class="link-login" @click="$router.push({path: '/login', query: {email}})">已有账号，去登录</div>
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
import {register} from "@/network/profile";
import {Notify, Toast} from 'vant';
import {useRoute, useRouter} from "vue-router";

export default {
  name: "Register",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const user = reactive({
      name: '',
      password: '',
      password_confirmation: '',
      email: route.query.email
    })
    const onSubmit = (values) => {
      if (user.password !== user.password_confirmation) {
        Notify({type: 'danger', message: '输入的密码不一致'});
        return
      }

      register(values).then(res => {
        if (res.status === 201) {
          Toast.success({
            message: '注册成功',
            onClose: () => {
              router.push({
                path: '/login',
                query: {
                  email: user.email
                }
              })
            }
          })
        }
      })
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
