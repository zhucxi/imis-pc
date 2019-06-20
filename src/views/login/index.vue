<template>
  <div class="main_body">
    <h2>登录页</h2>
    <form >
    <el-input class="login_input" type="text" v-model="username" placeholder="请输入用户名"></el-input>
    <el-input class="login_input" type="password" v-model="password" placeholder="请输入密码"></el-input>
    <el-button class="login_btn" type="primary" @click="login">登录</el-button>
    </form>
  </div>
</template>

<script>
    export default {
        name: "login",
        data(){
          return{
            username:'',
            password:''
          }
        },
      methods:{
        login: function () {
          const data={'username':this.username,'password':this.password}
          this.axios.post('/testController/hello',this.$qs.stringify(data))
          .then(function (res) {
            console.log(res)
          }).catch(function (res) {
            console.log(res)
          })
        }
      }
    }
</script>

<style scoped>
.main_body{
  text-align: center;
}
.login_input{
  width: 300px;
  height: 100%;
  display: block;
  margin: 10px auto;
}
.login_btn{
  width: 300px;
  height: 100%;
}
</style>
