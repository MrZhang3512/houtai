<template>
  <div class="app-container">
    <!-- 按钮 -->
    <div>
      <el-button type="primary" size="small" @click="handlerAddWaiter">新增</el-button>
      <el-button type="danger" size="small" @click="handlerBatchDelete">批量删除</el-button>
    </div>
    <!-- /按钮 -->
    <!-- 表格 -->
    <el-table
    :data="list.list"
    border
    style="width: 100%"
    @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        width="55"
        label="头像">
        <template v-slot="slot">
            <el-avatar  :src="slot.row.imgPhoto"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="140">
      </el-table-column>
      <el-table-column
        prop="realname"
        label="真实姓名"
        width="140">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="idCard"
        label="身份证号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="50">
      </el-table-column>
      <el-table-column
        label="状态"
        width="80">
        <template v-slot="slot">
          <el-switch
          v-model="slot.row.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="启用"
          inactive-value="禁用"
          @change="handlerChangeStatus(slot.row)">
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="slot">
          <el-button type="primary" size="small" @click="handlerEdit(slot.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handlerDelete(slot.row.id)">删除</el-button>
          <el-button type="primary" size="small" @click="handlerDetail(slot.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 分页 -->
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page+1"
        :page-sizes="[ 5, 10, 20, 30]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.total">
      </el-pagination>
    </div>
    <!-- /分页 -->
    <!-- 模态框 -->
    <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    >
    <el-form :model="waiter_info" :rules="rules" ref="ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="waiter_info.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="waiter_info.password" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="电话号" prop="telephone">
        <el-input v-model="waiter_info.telephone" placeholder="请输入电话号"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="waiter_info.idCard" placeholder="请输入身份证号码"></el-input>
      </el-form-item>
      <!-- 图片上传 -->
      <el-form-item label="上传图片">
            <el-upload
              ref="upload"
              class="avatar-uploader"
              action="http://121.199.29.84:8001/file/upload"
              :show-file-list="false"
              :on-remove="handleRemove"
              :on-success="handlerSuccess"
              :on-error="handlerError"
              >
              <img v-if="waiter_info.imgPhoto" :src="waiter_info.imgPhoto" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hiddenDialog">取 消</el-button>
      <el-button type="primary" @click="handlerSave('ruleForm')">确 定</el-button>
    </span>
   </el-dialog>
  <!-- /模态框 -->
  </div>
</template>

<script>
import { getList } from '@/api/table'

import {mapState,mapActions} from 'vuex'
export default {
  
  data() {
    return {
      listLoading: false,
      //分页参数
      params:{
        page:0,
        pageSize:5
      },
      //模态框状态
      dialogVisible:false,
      //模态框标题
      title:"",
      waiter_info:{},//表单数据
      ids: [],//批量删除的id 
      imageUrl:"",
      //手机号和身份证号码验证
      //表单验证规则
      rules:{
          username:[
              {required:true,message:"请输入用户名",trigger:"blur"},
              {min:2,max:6,message:"用户的字数为2-6位",trigger:"blur"}
          ],
          password:[
              {required:true,message:"请输入密码",trigger:"blur"},
              {min:6,message:"密码不少于6位",trigger:"blur"}
          ],
          telephone:[
              {required:true,message:"请输入电话号码",trigger:"blur"},
              
              {min:11,max:11,message:"长度为11",trigger:"blur"}
          ],
          idCard:[
              {required:true,message:"请输入身份证号码",trigger:"blur"},
              {min:18,max:18,message:"长度为18",trigger:"blur"}
          ]
      }
    }
  },
  created() {
    this.fetchDataWaiter(this.params);
  },
  computed:{
    ...mapState('waiters',["list"]),//获取到waiters仓库的数据list
  },
  methods: {
    //查找所有的wairer
    ...mapActions('waiters',{
       fetchDataWaiter: "fetchData",
       saveOrUpdateWaiter: "saveOrUpdate",
       deleteByIdWaiter: "deleteById",
       deleteByBatchWaiter: "deleteByBatch"
    }),
    ...mapActions('waiters',["saveWaiterDetail"]),
    //当前页数改变时触发
    handleSizeChange(pageSize){
      this.params = {page: 0,pageSize:pageSize}
      this.fetchDataWaiter(this.params);
    },
    //当前页改变时触发
    handleCurrentChange(page){
      this.params.page = page-1;
      this.fetchDataWaiter(this.params);
    },
    //添加员工按钮
    handlerAddWaiter(){
      this.showDialog();
      this.title = "新增员工信息";
      this.waiter_info = {imgPhoto:""};
      // //清楚图片列表
      // this.$nextTick(()=>{
      //   this.$refs.upload.clearFiles();
      // })
      
    },
    //显示模态框
    showDialog(){
      this.dialogVisible = true;
      
    },
    //隐藏模态框
    hiddenDialog(){
      this.dialogVisible = false;
      this.$nextTick(()=>{
        this.$refs.ruleForm.resetFields();
      })
    },
    //模态框确定
    handlerSave(ruleForm){
      this.$refs[ruleForm].validate(valid=>{
        if(valid){
          this.saveOrUpdateWaiter(this.waiter_info)
          .then((res)=>{
            this.$notify({
              title: '成功',
              message: res.statusText,
              type: 'success'
            });
            //关闭模态框
            this.hiddenDialog();
            //查询用户
            this.fetchDataWaiter(this.params);
            })
        }
      });
    },
    //编辑按钮
    handlerEdit(row){
      this.title = "修改员工信息";
      this.showDialog();
      //将row深拷贝一份，这样就不会导致表格和表单为同一个对象的地址而发生变化
      this.waiter_info = Object.assign({},row);
      
    },
    //详情按钮
    handlerDetail(row){
      //将当前行员工的数据传入到状态机中
      this.saveWaiterDetail(row);
      //将当前waiter通过路由将id传过去
      this.$router.push("/waiters/detail/w")
    },
    //删除
    handlerDelete(id){
       this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteByIdWaiter(id)
          .then((res)=>{
            this.$notify({
              title: '成功',
              message: res.statusText,
              type: 'success'
            });
            this.fetchDataWaiter(this.params);
          })
          .catch(res=>{
            this.$notify({
              title: '失败',
              message: "不能删除该用户",
              type: 'warning'
            });
          });
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

    },
    //点击复选框触发按钮
    handleSelectionChange(ids){
      //将每行数据的id映射出来
      this.ids = ids.map(item=>item.id); 
    },
    //批量删除
    handlerBatchDelete(){
      this.$confirm('此操作将永久删除这些员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteByBatchWaiter(this.ids)
          .then((res)=>{
            this.$notify({
              title: '成功',
              message: res.statusText,
              type: 'success'
            });
            this.fetchDataWaiter(this.params);
          }).catch(res=>{
            this.$notify({
              title: '失败',
              message: res.statusText,
              type: 'warning'
            });
          });
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //图片删除用到的方法
    handleRemove() {
      this.waiter_info.imgPhoto = "";
    },
    //上传成功后执行v
    handlerSuccess(response,file){
      //上传成功后将路径返回
      this.waiter_info.imgPhoto = "http://121.199.29.84:8888/group1/"+response.data.id;
      console.log(this.waiter_info.imgPhoto)
    },
    //上传失败
    handlerError(){
      this.$message({
        type:"warning",
        message:"上传失败"
      });
    },
    //状态开关
    handlerChangeStatus(value){
      console.log(value)
      this.saveOrUpdateWaiter(value)
      .then(()=>{
        this.$message({
        type:"success",
        message:"更新状态成功"
      });
      })
    }
  
  }
}
</script>
<style  scoped>
 .avatar-uploader .el-upload {
    border: 1px dashed #4e4545;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
