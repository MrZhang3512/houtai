//waiters仓库

import {post, get ,post_array} from '../../utils/axios'
const waiters = {
    //开启命名空间
    namespaced: true,
    state(){
        return {
            list: {},//分页查询的信息
            waiterDetail: {},//单个顾客的信息
            allList:[]//所有的员工
        }
    },
    mutations:{
        //重置list
        reestList(state,list){
            state.list = list;
        },
        //重置waiterDetail
        resetWaiterDetail(state,waiterDetail){
            state.waiterDetail = waiterDetail;
        },
        //重置allList
        resetAllList(state,allList){
            state.allList = allList;
        }
        
    },
    actions:{
        //分页查询waiter
        fetchData({commit},params){
            post('/waiter/query',params)
            .then(res=>{
                //提交突变,改变list
                commit('reestList',res.data);
            })
        },
        //新增员工
        saveOrUpdate(context,data){
            return post("/waiter/saveOrUpdate",data);
        },
        //删除
        deleteById(context,id){
            return get("/waiter/deleteById",{id})
        },
        //批量删除
        deleteByBatch(context,ids){
            return post_array('/waiter/batchDelete',{ids})
        },
        //保存员工详细信息
        saveWaiterDetail(context,waiterDetail){
            context.commit('resetWaiterDetail',waiterDetail);
        },
        //查询所有的员工
        findAll({commit}){
            get('/waiter/findAll')
            .then(res=>{
                commit('resetAllList',res.data);
                console.log(res.data)
            })
        }
        
        
    }

}

export default waiters;