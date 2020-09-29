<template>
     <div id="app">
         <el-row class="btns">
             <el-col :span="12" >
                <!-- 按钮 -->
                <div>
                <el-button type="primary" size="small" @click="handlerToAdd" >添加</el-button>
                </div> 
                <!-- /按钮 -->
            </el-col>
            <el-col :span="8" style="text-align:right">
            <!-- 搜索栏 -->
            <el-form :inline="true">
                <el-form-item label="产品名称" >
                    <el-input @keyup.native.enter="headlerSearch" size="small" v-model="params.name"></el-input>
                    <!-- el-input是element-ui封装的组件，如果想要使用input的原生事件需要加上.native修饰符 -->
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="headlerSearch" >查询</el-button>
                </el-form-item>
            </el-form>
            <!--  /搜索栏-->
         </el-col>
         </el-row>
         <!-- 表格 -->
         <div class="tables">
             <el-table :data="productList.list" style="width: 100%">
                 <el-table-column prop="id" width="150" label="产品ID"></el-table-column>
                 <el-table-column prop="name" width="120" label="产品名称"></el-table-column>
                 <el-table-column prop="price" width="120" label="产品单价"></el-table-column>
                 <el-table-column prop="status" width="120" label="状态"></el-table-column>
                 <el-table-column prop="category.name" width="200" label="所属分类"></el-table-column>
                 <el-table-column width="110" label="产品图片">
                    <template v-slot="slot">
                        <el-avatar  :src="slot.row.photo"></el-avatar>
                    </template>
                </el-table-column>
                 <el-table-column label="操作" width="230">
                     <template v-slot="slot">
                         <el-button type="danger" size="small"  @click="handlerDelete(slot.row.id)">删除</el-button>
                         <el-button type="primary" size="small" @click="handlerEdit(slot.row)">修改</el-button>
                         <el-button type="primary" size="small" @click="handlerDetail(slot.row)">详情</el-button>
                     </template>
                 </el-table-column>
             </el-table>
         </div>
         <!-- /表格 -->
         <!-- 分页 -->
         <el-pagination
             layout="prev, pager, next"
             :total="productList.total"
             :page-size="params.pageSize"
             :current-page="params.page"
             @current-change="handlerPageChange">
         </el-pagination>
         <!-- /分页 -->
         <!-- 模态框 -->
        <el-dialog :title="title" :visible="visible" @close="closeModal">
            <el-form :model="product"
                    label-width="80px"
                    label-position="left"
                    >
                <el-form-item label="产品名称" prop="name">
                    <el-input v-model="product.name" ></el-input>
                </el-form-item>
                <el-form-item label="单价" prop="price">
                    <el-input v-model="product.price" ></el-input>
                </el-form-item>
                <el-form-item label="所属栏目">
                    <el-select v-model="product.categoryId" placeholder="请选择">
                        <el-option
                        v-for="item in categoryList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="product.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="closeModal">取消</el-button>
                <el-button size="small" type="primary" @click="handlerSubmit('productForm')">提交</el-button>
            </div>
        </el-dialog>
         <!-- /模态框 -->
     </div>
</template>
<script>
import {mapState,mapActions,mapMutations} from 'vuex'
export default {
    data(){
        return {
            name:"产品管理",
            params:{
                page:0,
                pageSize:5
            },
            product:{},
            title:""
        }
    },
    methods:{
        ...mapActions("products",["openModal","closeModal","saveProductDetail"]),
        ...mapActions("products",{
            queryProduct:"query",
            saveOrUpdateProduct:"saveOrUpdate",
            deleteByIdProduct:"deleteById"
        }),
    
        ...mapActions("categorys",{
            findAllCategory:"findAll"
        }),
        ...mapMutations('app',["select"]),
        //分页
        handlerPageChange(page){
            this.params.page=page-1;
            this.queryProduct(this.params)
        },
        //查询功能
        headlerSearch(){
            this.queryProduct(this.params);
        },
        //产品信息提交
        handlerSubmit(formName){
            this.saveOrUpdateProduct(this.product).then(()=>{
                        this.queryProduct(this.params);
                        this.$notify({
                            title:"success",
                            type:"success",
                            message:this.message
                        })
                    })
        },
        //添加按钮
        handlerToAdd(){
            this.product = {};
            this.title = "添加产品"
            this.openModal();
            this.findAllCategory();
        },

        //跳转到产品详情页面
        toDetailsHandler(id){
            this.$router.push("/productDetails/"+id)
        },
        //删除
        handlerDelete(id){
            this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                this.deleteByIdProduct(id)
                .then((res)=>{
                    this.$notify({
                    title: '成功',
                    message: res.statusText,
                    type: 'success'
                    });
                    this.queryProduct(this.params);
                })
                .catch(res=>{
                    this.$notify({
                    title: '失败',
                    message: "不能删除该产品",
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
        //编辑
        handlerEdit(row){
            this.title = "修改产品";
            this.findAllCategory();
            this.product = Object.assign({},row);
            this.openModal();
        },
        //详情按钮
        handlerDetail(row){
        //将当前行员工的数据传入到状态机中
        this.saveProductDetail(row);
        //将当前waiter通过路由将id传过去
        this.$router.push("/waiters/detail/p")
        },
    },
    computed:{
        ...mapState("products",["visible","message"]),
        ...mapState("products",{
            productList:"list"
        }),
        ...mapState("categorys",{
            categoryList:"allList"
        })
    },
    created(){
        this.queryProduct(this.params);
    }
}
</script>
<style scoped>
.btns {
    margin-top: 1em;
    margin-left: 1em;
}
.tables {
    margin-left: 1em;
}
</style>