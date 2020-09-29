//category仓库

import {post, get ,post_array} from '../../utils/axios'

const categorys = {
    //开启命名空间
    namespaced: true,
    state(){
        return {
            list: {},//分页查询的信息
            allList: [],//所有栏目的信息
            treeAllList:[]//树状的栏目信息
        }
    },
    mutations:{
        //重置list
        reestList(state,list){
            state.list = list;
        },
        //重置allList
        resetAllList(state,allList){
            state.allList = allList;
        },
        //重置treeAllList
        resetTreeAllList(state,treeAllList){
            state.treeAllList = treeAllList;
        }
    },
    actions:{
        //分页查询category
        fetchData({commit},params){
            post('/category/query',params)
            .then(res=>{
                //提交突变,改变list
                commit('reestList',res.data);
            })
        },
        //查询所有栏目
        findAll({commit}){
            get("/category/findAll")
            .then(res=>{
                // console.log(res.data)
                commit('resetAllList',res.data);
            })
        },
        //新增栏目
        saveOrUpdate(context,data){
            return post("/category/saveOrUpdate",data);
        },
        //删除
        deleteById(context,id){
            return get("/category/deleteById",{id})
        },
        //批量删除
        deleteByBatch(context,ids){
            return post_array('/category/batchDelete',{ids})
        },
        //查询树枝栏目
        findCategoryTree(context){
             get('/category/findCategoryTree')
            .then(res=>{
                context.commit('resetTreeAllList',res.data);
                console.log(res.data)
            })
        }
    }

}

export default categorys;