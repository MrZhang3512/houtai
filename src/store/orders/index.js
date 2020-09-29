import { get } from "../../utils/axios";
import moment from 'moment'
export default{
    namespaced:true,
    state:{
        orders:[]//订单信息
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
        resetOrders(state,orders){
            state.orders=orders;
        }
    },
    actions:{
        findAllOrders({commit}){
            get("/order/findAll").then((result)=>{
                //对日期进行重置
                result.data.forEach((item)=>{
                    item.orderTime=moment(item.orderTime).format('YYYY-MMM-DD HH:mm:ss')
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