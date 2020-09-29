<template>
    <div class="app-container">
        <!-- 返回上一页按钮 -->
        <el-page-header @back="goBack" content="详情页面">
        </el-page-header>
        <!-- /返回上一页按钮 -->
        <!-- 个人信息卡片 -->
        <el-card class="box-card">
            <div v-if="detail.type === 'waiter'">
                <!-- 头像 -->
                <div class="demo-basic--circle">
                <div class="block"><el-avatar shape="square" :size="100" :src="detail.imgPhoto"></el-avatar></div>
                </div>
                <!-- /头像 -->
                <span >员工用户名：{{detail.username}}</span><br>
                <span >员工真实姓名：{{detail.realname}}</span><br>
                <span >性别：{{detail.gender}}</span><br>
                <span>状态:{{detail.status}}</span><br>
                <span >身份证号码：{{detail.idCard}}</span><br>
                <span >员工电话号：{{detail.telephone}}</span><br>
                <span >银行卡号：{{detail.bankCard}}</span><br>
                <span >QQ：{{detail.qq}}</span><br>
                <span >微信：{{detail.wxid}}</span><br>
                <span >注册时间：{{detail.registerTime}}</span><br>
                <span >微信：{{detail.wxid}}</span><br>
                <el-tag type="success">账户余额:{{detail.money}}</el-tag>
            </div>
            <div v-else-if="detail.name">
                <!-- 产品图片 -->
                <div class="demo-basic--circle">
                <div class="block"><el-avatar shape="square" :size="100" :src="detail.photo"></el-avatar></div>
                </div>
                <!-- /头像 -->
                <span >产品名称：{{detail.name}}</span><br>
                <span >价格：<el-tag type="info">{{detail.price}}</el-tag></span><br>
                <span >描述：{{detail.description}}</span><br>
                <span>状态:{{detail.status}}</span><br>
                <span >所属栏目：{{detail.category.name}}</span><br>
            </div>
        </el-card>
        <!-- /个人信息卡片 -->
    </div>
</template>
<script>
import waiters from '@/store/waiters';
import {mapActions,mapState} from 'vuex';
// 导入moment.js库
import moment from 'moment'
export default {
    data(){
        return {
            detail:{},//详情
        }
    },
    created(){
        //获取到路由传参
        let id = this.$route.params.id;
        console.log(id)
        switch(id){
            case 'w':
                this.detail = this.waiterDetail;
                this.detail.registerTime = moment(this.waiterDetail.registerTime).format('MMMM Do YYYY, h:mm:ss a');
                break;
            case 'p':
                this.detail = this.productDetail;
                break;
        }
    },
    computed:{
        //员工信息
        ...mapState('waiters',['waiterDetail']),
        //产品信息
        ...mapState('products',['productDetail'])

    },
    methods:{
        //返回按钮
        goBack(){
            this.$router.go(-1)
        }
    },
   
}
</script>