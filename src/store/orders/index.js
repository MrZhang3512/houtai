import { get } from "../../utils/axios";
import moment from 'moment'
export default{
    namespaced:true,
    state:{
        orders:[],//订单信息
        orderOptArray:[]//订单echarts图表数据
    },
    getters:{
        //通过状态筛选不同的订单
        filterOrdersByStatus(state){
            return (status)=>{
                return state.orders.filter((item)=>{
                    return item.status===status;
                })
            }
        }
    },
    mutations:{
        //重置订单信息
        resetOrders(state,orders){
            state.orders=orders;
        },
        //重置orderOptArray
        resetOrderOptArray(state,orderOptArray){
            state.orderOptArray = orderOptArray;
        }
    },
    actions:{
        findAllOrders({commit}){
            return get("/order/findAll").then((result)=>{
                    //将订单的时间的月份获取到
                    let OrderTime = [];
                    result.data.forEach(item=>{
                        //通过判断获取到2020年的数据
                        if(new Date(item.orderTime).getFullYear() == "2020"){
                            OrderTime.push(new Date(item.orderTime).getMonth()+1)
                            commit('resetOrderOptArray',OrderTime);
                        }
                    });
                    //对日期进行重置
                    result.data.forEach((item)=>{
                        item.orderTime=moment(item.orderTime).format('YYYY-MM-DD HH:mm:ss')
                    })
                    commit('resetOrders',result.data)
                })
        },
        //派单
        sendOrder(context,order){
            return get('/order/sendOrder',order);
        }
    }
}