<template>
  <div class="register-container">
    <h2>注册</h2>
    <el-form
      @submit.native.prevent="validateAndRegister"
      class="register-form"
      ref="registerForm"
      :model="registerForm"
    >
      <el-form-item label="用户名:" class="form-item">
        <el-input
          v-model="registerForm.username"
          placeholder="请输入用户名"
        ></el-input>
        <span class="hint-text">（用户名是您的唯一身份标识）</span>
      </el-form-item>
      <el-form-item label="密码:" class="form-item">
        <el-input
          type="password"
          v-model="registerForm.password"
          placeholder="请输入密码"
        ></el-input>
        <span class="hint-text">（不要把密码告诉别人哦）</span>
      </el-form-item>
      <el-form-item label="确认密码:" class="form-item">
        <el-input
          type="password"
          v-model="registerForm.confirmPassword"
          placeholder="请再次输入密码"
        ></el-input>
        <span class="hint-text">（两次密码输入要一致哦）</span>
      </el-form-item>
      <el-form-item label="电子邮箱:" class="form-item">
        <el-input
          v-model="registerForm.email"
          placeholder="请输入电子邮箱"
        ></el-input>
        <span class="hint-text"
          >（我们会向您的邮箱中发送一封邮件以验证您的身份）</span
        >
      </el-form-item>
      <el-form-item class="form-item">
        <el-button type="primary" native-type="submit" class="register-button"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 自定义模态对话框 -->
    <div v-if="showTokenModal" class="token-modal">
      <div class="modal-content">
        <h3>请输入您收到的验证令牌</h3>
        <el-input
          v-model="registerForm.jwt"
          placeholder="验证令牌"
          class="token-input"
        ></el-input>
        <div class="modal-buttons">
          <el-button @click="showTokenModal = false" class="common-button"
            >取消</el-button
          >
          <el-button @click="completeRegistration" class="common-button"
            >提交</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { Loading } from "element-ui";

export default {
  name: "UserRegister",
  data() {
    return {
      showTokenModal: false, // 控制模态对话框的显示
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "", // 新的确认密码字段
        email: "",
        jwt: "", // 为用户输入的验证令牌添加一个新字段
      },
    };
  },
  methods: {
    async validateAndRegister() {
      const loading = Loading.service({ fullscreen: true }); // 显示全屏加载指示器
      try {
        // 检查每个字段是否都已填写
        if (!this.registerForm.username) {
          this.$message.error("请填写用户名");
          return;
        }
        if (!this.registerForm.password) {
          this.$message.error("请填写密码");
          return;
        }
        if (!this.registerForm.confirmPassword) {
          this.$message.error("请确认密码");
          return;
        }
        if (!this.registerForm.email) {
          this.$message.error("请填写电子邮箱");
          return;
        }
        // 检查密码和确认密码是否匹配
        if (this.registerForm.password !== this.registerForm.confirmPassword) {
          this.$message.error("两次密码输入不一致");
          return;
        }
        // 第一步: 验证用户名和邮箱
        const validationResponse = await this.$axios.post(
          "https://greed106.conc.tech/todolist/register/valid",
          {
            username: this.registerForm.username,
            email: this.registerForm.email,
          }
        );

        if (validationResponse.data.code !== 1) {
          this.$message.error(validationResponse.data.msg);
          return;
        }

        // 第二步: 显示模态对话框以提示用户输入验证令牌
        this.showTokenModal = true;
      } catch (error) {
        this.$message.error(
          error.response ? error.response.data.msg : error.message
        );
      } finally {
        loading.close(); // 关闭全屏加载指示器
      }
    },
    async completeRegistration() {
      const loading = Loading.service({ fullscreen: true }); // 显示全屏加载指示器
      try {
        const registrationResponse = await this.$axios.post(
          "https://greed106.conc.tech/todolist/register/code",
          {
            username: this.registerForm.username,
            password: this.registerForm.password,
            email: this.registerForm.email,
            jwt: this.registerForm.jwt, // 传递用户输入的验证令牌
          }
        );

        if (registrationResponse.data.code === 1) {
          this.$message.success("注册成功");
          this.$router.push("/login");
        } else {
          this.$message.error(registrationResponse.data.msg);
        }
      } catch (error) {
        this.$message.error(
          error.response ? error.response.data.msg : error.message
        );
      } finally {
        loading.close(); // 关闭全屏加载指示器
        this.showTokenModal = false; // 关闭模态对话框
      }
    },
  },
};
</script>
  
  
  <style scoped>
.heading {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}
.register-container {
  width: 400px;
  margin: 80px auto;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 20px;
  font-family: "Roboto", sans-serif; /* 添加一个优雅的字体 */
}

.register-form {
  padding: 20px;
  border-radius: 5px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600; /* 调整字体粗细 */
}

.form-item {
  margin-bottom: 40px;
  position: relative;
}

.el-input {
  border-radius: 5px;
  transition: border-color 0.3s;
  width: 100%; /* 确保输入框填充整个表单项 */
}

.el-input:focus {
  border-color: #42b983;
}

.register-button {
  width: 100%;
  border-radius: 5px;
  background-color: #42b983;
  color: #fff;
  transition: background-color 0.3s;
  font-size: 16px; /* 增大字体大小 */
}

.register-button:hover {
  background-color: #356859;
}
.common-button {
  border-radius: 5px;
  background-color: #42b983;
  color: #fff;
  transition: background-color 0.3s;
  font-size: 16px; /* 增大字体大小 */
}

.common-button:hover {
  background-color: #356859;
}
.hint-text {
  font-size: 12px;
  color: #999;
  position: absolute;
  bottom: -30px;
  left: 0;
}
/* 自定义模态对话框样式 */
.token-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}
.modal-buttons {
  display: flex;
  justify-content: flex-end; /* 使按钮靠右对齐 */
  gap: 10px; /* 添加间距以分隔按钮 */
}
.token-input {
  width: 100%;
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  justify-content: center;
}
.token-modal:target .modal-content {
  transform: scale(1.05); /* 当模态对话框显示时稍微放大一些 */
}
</style>