<template>
  <div>
    <h1>测试页面</h1>
    <el-divider content-position="left">get请求</el-divider>
    <el-input class="search_input" v-model="searchIn" placeholder="查询内容"></el-input>
    <el-button type="primary" icon="el-icon-search" @click="searchInfo">搜索</el-button>
    <el-divider content-position="left">列表</el-divider>
    <el-button size="mini" @click="batchDelete()" type="danger" icon="el-icon-delete" class="operate_button">批量物理删除</el-button>
    <el-button size="mini" @click="deleteInfo()" type="danger" icon="el-icon-delete" class="operate_button">物理删除</el-button>
    <el-button size="mini" @click="removeInfo()" type="warning" icon="el-icon-delete" class="operate_button">逻辑删除</el-button>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" width="100%" tooltip-effect="dark" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" ></el-table-column>
      <el-table-column prop="birthday" label="生日" ></el-table-column>
      <el-table-column prop="sex" label="性别" :formatter="formatterSex"></el-table-column>
      <el-table-column prop="openstate" label="开启状态" :formatter="formatterOpenState"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.$index,scope.row)" type="primary">查看</el-button>
          <el-button size="mini" @click="handleEidt(scope.$index,scope.row)" type="primary">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[10,20,50,100]"
                   :page-size="pageSize"
                   layout="total,sizes,prev,pager,next,jumper"
                   :total="total">
    </el-pagination>
    <el-divider content-position="left">post请求</el-divider>
    <label class="test_input">账号<el-input  v-model="name" placeholder="请输入账号"></el-input></label>
    <label class="test_input">密码<el-input type="password" v-model="password" placeholder="请输入密码"></el-input></label>
    <label>性别：<el-radio v-model="sex" label="1">男</el-radio>
                 <el-radio v-model="sex" label="0">女</el-radio></label>
    <label class="test_input"><el-switch v-model="openstate" inactive-text="开启状态"></el-switch></label>
    <div class="block">
      <el-date-picker v-model="birthday" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
    </div>
    <el-button class="test_input" type="success" round @click="submit()" >提交信息</el-button>
    <el-dialog title="查看" :visible.sync="viewDialog" width="100%" fullscreen center>
      <!--<el-table :data="viewData">
        <el-table-column property="name" label="账号"></el-table-column>
        <el-table-column property="password" label="密码"></el-table-column>
        <el-table-column property="id" label="ID"></el-table-column>
      </el-table>-->
      <el-input v-model="viewData.name"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialog = false">取消</el-button>
        <el-button type="primary" @click="viewDialog = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "test",
      data(){
        return {
          name:'',
          password:'',
          sex:'1',
          openstate:'true',
          birthday:null,
          msg:'',
          searchIn:'',
          //列表数据
          tableData:[],
          //列表选中行
          multipleSelection:[],
          //列表当前页
          currentPage:1,
          //数据条数
          pageSize :10,
          //总条数
          total:0,
          loading:false,
          //查看dialog
          viewDialog:false,
          viewData:{
            name: '',
            password:'',
            id:''
          }
        }
      },
      methods:{
        submit:function () {
          this.axios({
            method:'post',
            url:'/testController/add',
            data:this.$qs.stringify({username:this.name,password:this.password,
              sex:this.sex,openstate:this.openstate,birthday: this.birthday},{skipNulls:true})
          }).then(rex=> {
            this.$message({message:rex.data.operateMessage,type:rex.data.operateSuccess===true?'success':'error'});
          }).catch(rex=> {
            this.$message(rex.date);
          })
        },
        //查询
        searchInfo:function () {
          this.loading = true;
          this.axios({
            method: 'get',
            url:'/testController/pageQuery',
            params:{currentPage:this.currentPage,pageSize:this.pageSize,username:this.searchIn}
          }).then(rex=>{
            this.loading = false;
            this.tableData=rex.data.records;
            this.currentPage = rex.data.current;
            this.total=rex.data.total;
            if(rex.data.total===0){
              this.$message({
                message:'未查询到数据',
                type:'warning'
              });
            }
          })
        },
        //点击列表选择框时触发
        handleSelectionChange:function(val){
          this.multipleSelection = val;
        },
        //修改
        handleEidt:function(index,row){
          console.log(index);
        },
        //查看
        handleView:function(index,row){
          this.axios({
            method:'get',
            url:'/testController/getById',
            params: {id:row.id}
          }).then(rex=>{
            this.viewData.name = rex.data.username;
            this.viewData.password = rex.data.password;
            this.viewData.id = rex.data.id;
            this.viewDialog = true
          })
        },
        handleSizeChange:function(val){
          this.pageSize = val;
          this.searchInfo();
        },
        handleCurrentChange:function(val){
          this.currentPage = val;
          this.searchInfo();
        },
        formatterSex:function (row,column,cellValue) {
          if(cellValue=='1'){
            return '男';
          }else {
            return '女';
          }
        },
        formatterOpenState:function (row,column,cellValue) {
          if(cellValue===true){
            return '开启';
          }else{
            return '关闭';
          }
        },
        //批量物理删除
        batchDelete:function () {
            if(this.multipleSelection.length===0){
              this.$message({
                message:'未选中要删除的数据',
                type:'warning'
              });
            }else{
              let ids = []
              this.multipleSelection.map((item)=>{
                ids.push(item.id)
              })
              this.axios({
                method:'post',
                url:'/testController/batchDelete',
                data:{ids:ids}
              }).then(rex=>{
                this.$message({message:rex.data.operateMessage,type:rex.data.operateSuccess===true?'success':'error'});
                if(rex.data.operateSuccess===true){
                  if(this.multipleSelection.length==this.tableData.length&&this.currentPage!=1){
                    this.currentPage = this.currentPage-1;
                  }
                  this.searchInfo();
                }
              })
            }
        },
        //物理删除
        deleteInfo:function(){
          if(this.multipleSelection.length===1){
            let id;
            this.multipleSelection.map((item)=>{
              id=item.id
            })
            this.axios({
              method:"post",
              url:'/testController/delete',
              data:this.$qs.stringify({id:id})
            }).then(rex=>{
              this.$message({message:rex.data.operateMessage,type:rex.data.operateSuccess===true?'success':'error'});
              if(rex.data.operateSuccess===true){
                if(this.multipleSelection.length==this.tableData.length&&this.currentPage!=1){
                  this.currentPage = this.currentPage-1;
                }
                this.searchInfo();
              }
            });
          }else{
            this.$message({
              message:'需对一条数据进行删除',
              type:'warning'
            });
          }
        },
        //逻辑删除
        removeInfo:function (){
          if(this.multipleSelection.length===1){
            let id;
            this.multipleSelection.map((item)=>{
              id=item.id
            });
            this.axios({
              method:'post',
              url:'/testController/remove',
              data:this.$qs.stringify({id:id})
            }).then(rex=>{
              this.$message({message:rex.data.operateMessage,type:rex.data.operateSuccess===true?'success':'error'});
              if(rex.data.operateSuccess===true){
                if(this.multipleSelection.length==this.tableData.length&&this.currentPage!=1){
                  this.currentPage = this.currentPage-1;
                }
                this.searchInfo();
              }
            });
          }else {
            this.$message({
              message:'需对一条数据进行删除',
              type:'warning'
            });
          }
        }
      }
    }
</script>

<style scoped>
  .test_input{
    width: 300px;
    height: 100%;
    display: block;
    margin: 10px auto;
  }
  .search_input{
    width: 300px;
    height: 100%;
    margin: 10px auto;
  }
  .operate_button{
    margin: 0 5px 5px 5px;
    float: left;
  }
</style>
