<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img
          src="~assets/img/login/user.jpg"
          alt=""
          title="Hey,You could be the next Bill Gates~"
        />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
            autofocus
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLoginData } from 'network/login/login.js'

export default {
  name: 'login',
  data() {
    return {
      // 登录表单数据绑定对象
      loginForm: {
        username: '',
        password: '',
      },
      // 登录表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 节流阀
      throttle: false,
    }
  },
  methods: {
    // 重置登陆表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        // 预验证成功才会发送网络请求，减少服务器压力
        if (!valid) return
        if (this.throttle) return
        const res = await getLoginData(this.loginForm)
        // 登录失败
        if (res.meta.status !== 200) {
          // 开启节流阀
          this.throttle = true
          this.$message({
            type: 'error',
            message: '登录失败！',
            duration: 1500,
            // 当消息提示关闭回调
            onClose: () => {
              this.throttle = false
            },
          })
        } else {
          // 1.将登录成功之后的token，保存到客户端的sessionStorage中
          //    1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
          //    1.2 token只应在当前网站打开期间生效,所以将token保存在sessionStorage中
          window.sessionStorage.setItem('token', res.data.token)
          // 附加功能：进入首页时，欢迎用户
          window.sessionStorage.setItem('username', this.loginForm.username)
          // 2.通过编程式导航跳转到后台主页，路由地址是 /home
          this.$router.replace('/home')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 140px;
    width: 140px;
    background-color: #fff;
    padding: 5px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 8px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .login_form {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;

    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>