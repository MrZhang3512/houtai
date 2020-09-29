import {post,get} from '../../utils/axios'
export default{
    namespaced:true,

    state:{
        name:"product",
        list:[],//查询产品信息
        visible:false,//模态框是否显示
        productDetail: {}//当个产品的详情
    },
    getters:{

    },
    mutations:{
        //重置list
        resetList(state,list){
            state.list=list;
        },
        //重置visible
        resetVisible(state,visible){
            state.visible=visible;
        },
        //重置title
        resetTitle(state,title){
            state.title=title;1
        },
        //重置message
        resetMessage(state,message){
            state.message=message
        },
        //重置prodduxtDetail
        resetProductDetail(state,productDetail){
            state.productDetail = productDetail;
        }
    },
    actions:{
        //打开模态框
        openModal({commit}){
            commit('resetVisible',true);
        },
        //关闭模态框
        closeModal({commit}){
            commit('resetVisible',false);
        },
        //分页查询产品信息
        query({commit},params){
            post("/product/queryProductCascadeCategory",params).then((result)=>{
                commit("resetList",result.data);
            })
        },
        //保存或更新
        saveOrUpdate({commit,dispatch},product){
             return post("/product/saveOrUpdate",product).then((result)=>{
                //记录反馈信息
                commit('resetMessage',result.statusText);
                //关闭模态框
                dispatch('closeModal');
                
            })
        },
        //删除产品
        deleteById(context,id){
            return get("/product/deleteById",{id})
        },
        //保存员工信息
        saveProductDetail(context,productDetail){
            context.commit('resetProductDetail',productDetail);
        }
    }
}