<template>
  <div class="login-container">
    <h2 class="heading">登录</h2>
    <el-form
      @submit.native.prevent="handleSubmit"
      class="login-form"
      ref="loginForm"
      :model="loginForm"
    >
      <el-form-item label="用户名:" prop="username" class="form-item">
        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password" class="form-item">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item class="form-item">
        <el-button type="primary" native-type="submit" class="login-button">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'UserLogin',
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async handleSubmit() {
      try {
        if(!this.loginForm.username){
          this.$message.error("用户名不能为空");
          return;
        }
        if(!this.loginForm.password){
          this.$message.error("密码不能为空");
          return;
        }
        const response = await this.$axios.post(
          "https://greed106.conc.tech/todolist/login",
          this.loginForm
        );
        const result = response.data;

        if (result.code === 1) {
          // 登陆成功
          console.log("登录成功:", result.data);

          // 将 JWT 令牌存储在 localStorage
          localStorage.setItem("jwt", result.data);
          localStorage.setItem("username", this.loginForm.username);

          // 配置 Axios，使其在后续请求中自动发送 JWT 令牌
          this.$axios.defaults.headers.common["Authorization"] = result.data;

          // 路由到 home 页面
          this.$router.push("/home");
        }else{
          this.$message.error(result.msg);
        }
      } catch (error) {
        //处理4xx, 5xx状态码的错误响应
        console.error("登陆失败:", error);
        this.$message.error(error.response.data.msg); // 使用 ElementUI 的 message 组件显示错误消息
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  width: 400px;
  margin: 80px auto;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 20px;
  font-family: "Roboto", sans-serif;
}

.heading {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

.login-form {
  padding: 20px;
  border-radius: 5px;
}

.form-item {
  margin-bottom: 40px;
  position: relative;
}

.el-input {
  border-radius: 5px;
  transition: border-color 0.3s;
  width: 100%;
}

.el-input:focus {
  border-color: #42b983;
}

.login-button {
  width: 100%;
  border-radius: 5px;
  background-color: #42b983;
  color: #fff;
  transition: background-color 0.3s;
  font-size: 16px;
}

.login-button:hover {
  background-color: #356859;
}
</style>
