//customers仓库

import {post, get ,post_array} from '../../utils/axios'

const customers = {
    //开启命名空间
    namespaced: true,
    state(){
        return {
            list: {}//分页查询的信息
        }
    },
    mutations:{
        //重置list
        reestList(state,list){
            state.list = list;
        }
    },
    actions:{
        //分页查询customer
        fetchData({commit},params){
            post('/customer/query',params)
            .then(res=>{
                //提交突变,改变list
                commit('reestList',res.data);
            })
        },
        //新增顾客
        saveOrUpdate(context,data){
            return post("/customer/saveOrUpdate",data);
        },
        //删除
        deleteById(context,id){
            return get("/customer/deleteById",{id})
        },
        //批量删除
        deleteByBatch(context,ids){
            return post_array('/customer/batchDelete',{ids})
        }
    }

}

export default customers;