<template>
    <div class="c-login-container">
        <div class="c-login-head">
            <div class="logo" :style="setLogo"></div>
        </div>
        <div class="c-login">
            <h1>用户登录</h1>
            <ul>
                <li :class="usernameInputClass">
                    <span class="icon">
                        <Icon type="android-person" slot="prepend" :size="18" color="#999"></Icon>
                    </span>
                    <input type="text" placeholder="用户名" v-model="username">
                </li>
                <li class="error-text" v-if="usernameError">{{usernameErrorText}}</li>
                <li :class="passwordInputClass">
                    <span class="icon">
                        <Icon type="locked" slot="prepend" :size="18" color="#999"></Icon>
                    </span>
                    <input type="password" placeholder="密码" v-model="password">
                </li>
                <li class="error-text" v-if="passwordError">{{passwordErrorText}}</li>
            </ul>
            <div class="more g-parent-clear">
                <div class="g-fl">
                    <Checkbox v-model="rememberPassword" @on-change="rememberPasswordCallback">记住密码</Checkbox>
                </div>
                <div class="g-fr">
                    <a href="#">新用户注册</a>
                </div>
            </div>
            <Button type="primary" long size="large" :loading="loginLoading" @click="login">
                <span v-if="!loginLoading">登录</span>
                <span v-else>登录中...</span>
            </Button>
        </div>
    </div>
</template>

<script>
import config from "config";
import logoDefaultImg from "../main/images/logo.png";
import "./styles/login.style";
const logo = config.logoImage ? config.logoImage : logoDefaultImg;
export default {
  data() {
    return {
      username: "jumaAdmin",
      password: "123",
      usernameError: false,
      passwordError: false,
      usernameErrorText: "",
      passwordErrorText: "",
      isLogin: false,
      loginLoading: false,
      rememberPassword: true
    };
  },
  computed: {
    setLogo() {
      return `background-image:url('${logo}');`;
    },
    usernameInputClass() {
      let inputClass = "input";
      if (this.usernameError) {
        inputClass += " input-error";
      }
      return inputClass;
    },
    passwordInputClass() {
      let inputClass = "input";
      if (this.passwordError) {
        inputClass += " input-error";
      }
      return inputClass;
    }
  },
  methods: {
    //记住密码
    rememberPasswordCallback(selected) {
      if (selected) {
      }
      this.rememberPassword = selected;
      console.log(selected);
    },
    //登录验证及登录系统
    login() {
      if (this.username == "") {
        this.usernameError = true;
        this.usernameErrorText = "请输入您的用户名！";
      } else {
        this.usernameError = false;
        this.usernameErrorText = "";
      }
      if (this.password == "") {
        this.passwordError = true;
        this.passwordErrorText = "请输入您的密码！";
      } else {
        this.passwordError = false;
        this.passwordErrorText = "";
      }
      if (this.usernameError || this.passwordError) {
        this.isLogin = false;
      } else {
        this.isLogin = true;
      }
      if (
        this.username == "jumaAdmin" &&
        this.password == "123" &&
        this.isLogin
      ) {
        this.loginLoading = true;
        setTimeout(() => {
          this.loginLoading = false;
          location.href = "#/home/";
        }, 2000);
      }
    }
  }
};
</script>
