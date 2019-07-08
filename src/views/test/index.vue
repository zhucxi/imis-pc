<template>
  <div>
    <h1>测试页面</h1>
    <el-divider content-position="left">post请求</el-divider>
    <el-input class="test_input" v-model="name" placeholder="请输入账号"></el-input>
    <el-input class="test_input" type="password" v-model="password" placeholder="请输入密码"></el-input>
    <el-button type="success" round @click="submit()" >提交信息</el-button>
    <el-divider content-position="left">get请求</el-divider>
    <el-input class="test_input" v-model="searchIn" placeholder="查询内容"></el-input>
    <el-button type="primary" icon="el-icon-search" @click="searchInfo">搜索</el-button>
  </div>
</template>

<script>
    export default {
      name: "test",
      data(){
        return {
          name:'',
          password:'',
          msg:'',
          searchIn:''
        }
      },
      methods:{
        submit:function () {
          this.axios({
            method:'post',
            url:'/testController/postTest',
            data:this.$qs.stringify({username:this.name,password:this.password})
          }).then(rex=> {
            this.$message(rex.data);
          }).catch(rex=> {
            this.$message(rex.date);
          })
        },
        searchInfo:function () {
          this.axios({
            method: 'get',
            url:'/testController/getTest',
            params:{searchInfo:this.searchIn}
          }).then(rex=>{
            this.$message({
              message:rex.data,
              type:'success'
            });
            console.log(rex);
          })
        }
      }
    }
</script>

<style scoped>
.test_input{
  width: 300px;
  height: 100%;
  /*display: block;*/
  margin: 10px auto;
}
</style>
