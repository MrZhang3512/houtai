<template>
  <div class="app-container">
    <!-- 按钮 -->
    <div>
      <el-button type="primary" size="small" @click="handlerAddCustomer">新增</el-button>
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
        prop="gender"
        label="性别"
        width="50">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="80">
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="slot">
          <el-button type="primary" size="small" @click="handlerEdit(slot.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handlerDelete(slot.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page+1"
        :page-sizes="[ 5, 10, 20, 30]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.total">
      </el-pagination>
    <!-- /分页 -->
    <!-- 模态框 -->
    <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    >
    <el-form :model="customer_info" :inline="true" label-width="150px">
      <el-form-item label="用户名">
        <el-input v-model="customer_info.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="customer_info.password" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="电话号">
        <el-input v-model="customer_info.telephone" placeholder="请输入电话号"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="customer_info.idCard" placeholder="请输入身份证号码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hiddenDialog">取 消</el-button>
      <el-button type="primary" @click="handlerSave">确 定</el-button>
    </span>
   </el-dialog>
  <!-- /模态框 -->
  </div>
</template>

<script>
import {getList} from '@/api/table'

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
      customer_info:{},//表单数据
      ids: []//批量删除的id 
    }
  },
  created() {
    this.fetchDataCustomer(this.params);
  },
  computed:{
    ...mapState('customers',["list"]),//获取到customers仓库的数据list
  },
  methods: {
    ...mapActions('customers',{
       fetchDataCustomer: "fetchData",
       saveOrUpdateCustomer: "saveOrUpdate",
       deleteByIdCustomer: "deleteById",
       deleteByBatchCustomer: "deleteByBatch"
    }),
    //当前页数改变时触发
    handleSizeChange(pageSize){
      this.params = {page: 0,pageSize:pageSize}
      this.fetchDataCustomer(this.params);
    },
    //当前页改变时触发
    handleCurrentChange(page){
      this.params.page = page-1;
      this.fetchDataCustomer(this.params);
    },
    //添加顾客按钮
    handlerAddCustomer(){
      this.showDialog();
      this.title = "新增顾客信息";
      this.customer_info = {};
    },
    //显示模态框
    showDialog(){
      this.dialogVisible = true;
    },
    //隐藏模态框
    hiddenDialog(){
      this.dialogVisible = false;
    },
    //模态框确定
    handlerSave(){
      this.saveOrUpdateCustomer(this.customer_info)
      .then((res)=>{
         this.$notify({
          title: '成功',
          message: res.statusText,
          type: 'success'
        });
        //关闭模态框
        this.hiddenDialog();
        //查询用户
        this.fetchDataCustomer(this.params);
        })
      
    },
    //编辑按钮
    handlerEdit(row){
      this.title = "修改顾客信息";
      this.showDialog();
      this.customer_info = Object.assign({},row);
    },
    //删除
    handlerDelete(id){
       this.$confirm('此操作将永久删除该顾客, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteByIdCustomer(id)
          .then((res)=>{
            this.$notify({
              title: '成功',
              message: res.statusText,
              type: 'success'
            });
            this.fetchDataCustomer(this.params);
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
      this.$confirm('此操作将永久删除这些顾客, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteByBatchCustomer(this.ids)
          .then((res)=>{
            this.$notify({
              title: '成功',
              message: res.statusText,
              type: 'success'
            });
            this.fetchDataCustomer(this.params);
          }).catch(res=>{
            this.$notify({
              title: '失败',
              message: res,
              type: 'warning'
            });
          });
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
}
</script>
