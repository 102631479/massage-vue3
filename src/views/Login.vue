<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">
        {{ !thisData.isLogin ? "欢迎登录" : "注册新账号" }}
      </div>
      <transition name="fade-transform" mode="out-in">
        <el-form
          :model="param"
          :rules="rules"
          ref="login"
          label-width="0px"
          class="ms-content"
        >
          <el-form-item prop="username">
            <el-input v-model="param.username" placeholder="输入账号">
              <template #prepend>
                <el-button icon="el-icon-user"></el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="输入密码"
              v-model="param.password"
              @keyup.enter="submitForm()"
            >
              <template #prepend>
                <el-button icon="el-icon-lock"></el-button>
              </template>
            </el-input>
          </el-form-item>
          <transition name="fade-transform" mode="out-in">
            <div v-if="thisData.isLogin" class="action-active">
              <el-form-item prop="adginPassword">
                <el-input
                  type="password"
                  placeholder="再次输入密码"
                  v-model="param.adginPassword"
                  @keyup.enter="submitForm()"
                >
                  <template #prepend>
                    <el-button icon="el-icon-lock"></el-button>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </transition>

          <div class="login-btn">
            <el-button type="primary" @click="submitForm()">
              {{ !thisData.isLogin ? "登录" : "注册" }}</el-button
            >
          </div>
          <p class="login-tips" @click="whetherLogin(thisData.isLogin)">
            {{
              !thisData.isLogin
                ? "Tips : 没有账号去注册"
                : "Tips : 有了账号去登录"
            }}。
          </p>
        </el-form>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getlogin, getRegister } from "../api/index";

export default {
  setup() {
    let thisData = reactive({
      isLogin: false,
    });
    let whetherLogin = (d) => {
      thisData.isLogin = !d;
    };
    const router = useRouter();
    const param = reactive({
      username: "",
      password: "",
      adginPassword: "",
    });
    const rules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      adginPassword: [
        { required: true, message: "请再次输入密码", trigger: "blur" },
      ],
    };

    const login = ref(null);

    // 登录请求
    const submitForm = () => {
      login.value.validate((valid) => {
        if (valid) {
          if (!thisData.isLogin) {
            delete param.adginPassword;
            getlogin(param)
              .then((res) => {
                let data = res.data;
                ElMessage.success("登录成功");
                localStorage.setItem("ms_username", data.username);
                localStorage.setItem("ms_token", data.token);
                router.push("/");
              })
              .catch((err) => {
                console.log(err);
                ElMessage.error("登录失败");
              });
            return;
          }
          console.log(param.password, param.adginPassword);
          if (param.password == param.adginPassword) {
            getRegister(param)
              .then((res) => {
                console.log(res);
                ElMessage.success("注册成功");
              })
              .catch((err) => {
                ElMessage.error(err.meta.msg);
              });
          } else {
            ElMessage.error("两次密码不一致");
          }
        }
      });
    };
    const store = useStore();
    store.commit("clearTags");
    return {
      thisData,
      param,
      rules,
      login,
      submitForm,
      whetherLogin,
    };
  },
};
</script>

<style scoped>
/* fade-transform */
.fade-transform-leave-active {
  transform: translateY(30px);
  transition: all 1s;
}
.fade-transform-enter-active {
  transform: translateY(30px);
  transition: all 1s;
}

.fade-transform-enter {
  opacity: 0;
  /* transform: translateX(-10px); */
  /* transform: translateY(-20px); */
}

.fade-transform-leave-to {
  transition: all 1s;
  /* transition: 0.5s; */
  opacity: 0.2;
  transform: translateX(50px);
}
.action-active {
  transition: 0.2s;
}
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 400%;
  background-image: linear-gradient(
    125deg,
    #27ae60,
    #2980b9,
    #e74c3c,
    #8e44ad,
    #27ae60,
    #2980b9,
    #e74c3c,
    #8e44ad
  );
  animation: bganimation 15s infinite;
  /* background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%; */
}
@keyframes bganimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 40%;
  width: 350px;
  margin: -160px 0 0 -150px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  cursor: pointer;
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.login-tips:hover {
  color: #2980b9;
}
</style>