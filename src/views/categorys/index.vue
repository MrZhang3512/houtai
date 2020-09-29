<template>
  <div class="app-container">
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button type="primary" size="small"  @click="handlerAddCategory">添加栏目</el-button>
        </el-col>
      </el-row>
      <!--  表格-->
      <treeTable 
        class="tables"
        :data="treeAllList"
        :columns="mycolumns"
        :border="true"
        :show-index="true"
        :selection-type="false"
        :expand-type="false">
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag type="success" v-if="scope.row.parentId===null">一级</el-tag>
            <el-tag v-else>二级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="option" slot-scope="slot">
            <el-button type="primary" icon="el-icon-edit" @click="handlerEdit(slot.row)" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handlerDelete(slot.row.id)">删除</el-button>
          </template>
      </treeTable>
    </el-card>
    <!-- 模态框 -->
    <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    >
    <el-form :model="category_info" :inline="true" label-width="150px">
      <el-form-item label="栏目名称">
        <el-input v-model="category_info.name" placeholder="请输入栏目名称"></el-input>
      </el-form-item>
      <el-form-item label="选择父栏目">
        <!-- 级联选择器 -->
        <div class="block">
          <el-cascader
            :value="category_info.parentId"
            :options="options"
            :props="{ checkStrictly: true ,expandTrigger: 'hover',label:'name',value:'id'}"
            clearable
            @change="handlerSelectParent"></el-cascader>
        </div>
        <!-- /级联选择器 -->
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

import {mapState,mapActions} from 'vuex'
export default {
  
  data() {
    return {
      listLoading: false,
      dialogVisible:false,
      //模态框标题
      title:"",
      category_info:{},//表单数据
      // 表格各列的配置
      mycolumns:[
            {
              label: "分类名称",
              prop: "name"
            },
            {
              label:"排序",
              type:"template",
              template:"order",
              width:"80px"
            },
            {
              label:"操作",
              type:"template",
              template:"option"
            },
            
               ],
      //级联选择器的数据
      options:[],
      
    }
  },
  created() {
    //查询栏目
    this.findCategoryTree();
    
    
  },
  computed:{
    ...mapState('categorys',["treeAllList"]),//获取到customers仓库的数据list
  },
  methods: {
    ...mapActions('categorys',["findCategoryTree"]),
    ...mapActions('categorys',{
       fetchDataCategory: "fetchData",
       saveOrUpdateCategory: "saveOrUpdate",
       deleteByIdCategory: "deleteById",
    }),
    
    //添加栏目按钮
    handlerAddCategory(){
      this.options = this.treeAllList;
      this.showDialog();
      this.title = "新增栏目信息";
      this.category_info = {};
    },
    //显示模态框
    showDialog(){
      this.dialogVisible = true;
    },
    //隐藏模态框
    hiddenDialog(){
      this.dialogVisible = false;
    },
    //级联样式表选中时触发
    handlerSelectParent(value){
      //拿到父栏目的ID
      let id = value[value.length-1];
      this.category_info.parentId = id;
    },
    //模态框确定
    handlerSave(){
      this.saveOrUpdateCategory(this.category_info)
      .then((res)=>{
         this.$notify({
          title: '成功',
          message: res.statusText,
          type: 'success'
        });
        //关闭模态框
        this.hiddenDialog();
        //查询用户
        this.findCategoryTree();
        })
      
    },
    //编辑按钮
    handlerEdit(row){
      this.title = "修改栏目信息";
      this.showDialog();
      this.category_info = Object.assign({},row);
    },
    //删除
    handlerDelete(id){
       this.$confirm('此操作将永久删除该栏目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteByIdCategory(id)
          .then((res)=>{
            this.$notify({
              title: '成功',
              message: res.statusText,
              type: 'success'
            });
            this.findCategoryTree();
          })
          .catch(res=>{
            this.$notify({
              title: '失败',
              message: res,
              type: 'warning'
            });
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

    },
  }
}
</script>
<style  scoped>
.tables {
    margin-top :1em;
}
</style>
