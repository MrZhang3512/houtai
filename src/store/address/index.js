//地址仓库

import {get} from '../../utils/axios'

const address = {
    //开启命名空间
    namespaced: true,
    state(){
        return {
            addresslist: {},//查询echarts用到的地址信息
            
        }
    },
    mutations:{
        //重置addresslist
        resetAddresslist(state,addresslist){
            state.addresslist = addresslist;
        }
    },
    actions:{
        //查询所有地址
        findAllAddress({commit}){
            return get('/address/findAll')
            .then(res=>{
                //将顾客的省份筛选出来
                let arr = res.data.map(item=>item.province.replace(/(["省"]|["市"])/,""));
                commit('resetAddresslist',arr)
            })
        }
    }

}

export default address;