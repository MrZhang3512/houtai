<template>
    <div id="app">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="所有订单" name="所有订单">
                <el-table :data="orders" size="small">
                    <el-table-column label="ID" prop="id"></el-table-column>
                    <el-table-column label="下单时间" prop="orderTime"></el-table-column>
                    <el-table-column label="总价" prop="total"></el-table-column>
                    <el-table-column label="状态" prop="status"></el-table-column>
                    <el-table-column label="顾客id" prop="customerId"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="未支付" name="待支付">
                <el-table :data="filterOrdersByStatus(activeName)" size="small">
                    <el-table-column label="ID" prop="id"></el-table-column>
                    <el-table-column label="下单时间" prop="orderTime"></el-table-column>
                    <el-table-column label="总价" prop="total"></el-table-column>
                    <el-table-column label="状态" prop="status"></el-table-column>
                    <el-table-column label="顾客id" prop="customerId"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="待派单" name="待派单">
                <el-table :data="filterOrdersByStatus(activeName)" size="small">
                    <el-table-column label="ID" prop="id"></el-table-column>
                    <el-table-column label="下单时间" prop="orderTime"></el-table-column>
                    <el-table-column label="总价" prop="total"></el-table-column>
                    <el-table-column label="状态" prop="status"></el-table-column>
                    <el-table-column label="顾客id" prop="customerId"></el-table-column>
                    <el-table-column label="操作">
                        <template v-slot="slot">
                            <a href="" @click.prevent="paidanHandler(slot.row.id)">派单</a>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="待接单" name="待接单">
                <el-table :data="filterOrdersByStatus(activeName)" size="small">
                    <el-table-column label="ID" prop="id"></el-table-column>
                    <el-table-column label="下单时间" prop="orderTime"></el-table-column>
                    <el-table-column label="总价" prop="total"></el-table-column>
                    <el-table-column label="状态" prop="status"></el-table-column>
                    <el-table-column label="顾客id" prop="customerId"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="未服务" name="待服务">
                <el-table :data="filterOrdersByStatus(activeName)" size="small">
                    <el-table-column label="ID" prop="id"></el-table-column>
                    <el-table-column label="下单时间" prop="orderTime"></el-table-column>
                    <el-table-column label="总价" prop="total"></el-table-column>
                    <el-table-column label="状态" prop="status"></el-table-column>
                    <el-table-column label="顾客id" prop="customerId"></el-table-column>
                    <el-table-column label="操作">
                        <template v:slot="slot">
                            <a href="" @click.prevent="to">取消</a>
                        </template>
                        </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="未评价" name="待评价">
                <el-table :data="filterOrdersByStatus(activeName)" size="small">
                    <el-table-column label="ID" prop="id"></el-table-column>
                    <el-table-column label="下单时间" prop="orderTime"></el-table-column>
                    <el-table-column label="总价" prop="total"></el-table-column>
                    <el-table-column label="状态" prop="status"></el-table-column>
                    <el-table-column label="顾客id" prop="customerId"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="已完成" name="已完成">
                <el-table :data="filterOrdersByStatus(activeName)" size="small">
                    <el-table-column label="ID" prop="id"></el-table-column>
                    <el-table-column label="下单时间" prop="orderTime"></el-table-column>
                    <el-table-column label="总价" prop="total"></el-table-column>
                    <el-table-column label="状态" prop="status"></el-table-column>
                    <el-table-column label="顾客id" prop="customerId"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!-- 模态框 -->
            <el-dialog :title="title" :visible="visible" @close="handlerClose">
                <el-select v-model="order_info.waiterId" placeholder="请选择员工">
                    <el-option
                    v-for="(item,index) in waiters"
                    :key="index"
                    :label="item.username"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
                <div slot="footer">
                    <el-button size="small" @click="handlerClose">取消</el-button>
                    <el-button size="small" type="primary" @click="handlerSubmit()">确定</el-button>
                </div>
            </el-dialog>
            <!-- /模态框 -->
    </div>
</template>
<script>
import {mapState,mapActions,mapGetters} from 'vuex'
export default {
    data(){
        return{
            activeName:"所有订单",
            visible:false,
            order:{},
            title:"派单",
            order_info:{}//派单信息
        }
    },
    methods:{
        ...mapActions("orders",["findAllOrders","sendOrder"]),
        ...mapActions('waiters',{
            findALLWaiters:"findAll"
        }),
        //改变tab
        handleClick(tab){
            this.activeName=tab.name;

        },
        //派单
        paidanHandler(orderId){
            this.order_info = {};
            this.order_info.orderId = orderId;
            this.visible=true;

        },
        //关闭模态框
        handlerClose(){
            this.visible=false;
        },
        //模态框确定按钮
        handlerSubmit(){
            this.sendOrder(this.order_info)
            .then(res=>{
                this.$notify({
                    title: '成功',
                    message: res.statusText,
                    type: 'success'
                    });
                    //关闭模态框
                    this.handlerClose();
                    this.findAllOrders();          
                })
                .catch(res=>{
                    this.$notify({
                    title: '失败',
                    message: res,
                    type: 'warning'
                    });
                    this.handlerClose();
                })   
        },

    },
    created(){
        //查找到所有的订单
        this.findAllOrders();
        //查询所有的waiter
        this.findALLWaiters();
    },
    computed:{
        ...mapState("orders",["orders"]),
        ...mapState("waiters",{waiters:"allList"}),
        ...mapGetters("orders",["filterOrdersByStatus"]),
    
    }

}
</script>
<style scoped>

</style>