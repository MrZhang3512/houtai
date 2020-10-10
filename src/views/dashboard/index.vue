<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <h3>{{name}}</h3>
      <!-- 分割线 -->
      <el-divider content-position="left"></el-divider>
      <!-- 图表区 -->
      <div class="myflex">
        <div class="orderNum" ref="orderNum"></div>
        <div class="addressNum" ref="addressNum"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters ,mapState,mapActions} from 'vuex'
// 导入exxcharts
import echarts from "echarts"
// 导入中国地图
import "echarts/map/js/china"

export default {
  name: 'dashboard',
  data(){
    return {
      name:"后台管理系统",
      //orderNum配置项
      OrderOption:{
        title: {
          text: "2020年订单每月销量"
        },
        xAxis: {
          type: 'category',
          nameLocation: 'center', 
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
          type: 'value',
          
        },
        series: [{
            data:[],
            type: 'line',
            label:{
            show:true,
            fontSize:10
          },
        }]
       },
      optiondata1:[0,0,0,0,0,0,0,0,0,0,0,0],//第一个echarts的数据
      optiondata2:[{name: '北京',value: 0 },{name: '天津',value:0 },  
                {name: '上海',value: 0},{name: '重庆',value: 0 },  
                {name: '河北',value: 0 },{name: '河南',value: 0 },  
                {name: '云南',value: 0 },{name: '辽宁',value: 0 },  
                {name: '黑龙江',value: 0 },{name: '湖南',value: 0 },  
                {name: '安徽',value: 0 },{name: '山东',value: 0 },  
                {name: '新疆',value: 0 },{name: '江苏',value: 0 },  
                {name: '浙江',value: 0 },{name: '江西',value: 0 },  
                {name: '湖北',value: 0 },{name: '广西',value: 0 },  
                {name: '甘肃',value: 0 },{name: '山西',value: 0 },  
                {name: '内蒙古',value: 0 },{name: '陕西',value: 0 },  
                {name: '吉林',value: 0 },{name: '福建',value: 0 },  
                {name: '贵州',value: 0 },{name: '广东',value: 0 },  
                {name: '青海',value: 0 },{name: '西藏',value: 0 },  
                {name: '四川',value: 0 },{name: '宁夏',value: 0 },  
                {name: '海南',value: 0 },{name: '台湾',value: 0 },  
                {name: '香港',value: 0 },{name: '澳门',value: 0 }  ],
      //地址的配置信息
      AddressOption:{
        title:{
          text:"客户分布"
        },
        series:[{
          name:"已有客户",
          type: 'map',
          map: 'china',
          label:{
            //控制对应地区的汉字
            show:true,
            color:"#333",
            fontSize:10
          },
          itemStyle:{
            //控制对应地区的样式
            areaColor:"#eee",
            // borderColor:"blue"
          },
          emphasis:{
            //控制鼠标滑过后
            label:{
            color:"#fff",
            fontSize:12
          },
          itemStyle:{
            areaColor:"#83b5e7",
          }
          },
          data:[]
          //用来展示后台传来的数据

        }],
        tooltip:{
        trigger:'item'//鼠标移动到的区域显示数据
        },
        visualMap:[{
         type: 'piecewise', // 定义为分段型 visualMap
         splitNumber:5,//分为几段
         pieces: [
           //分段
            {min: 50}, // 不指定 max，表示 max 为无限大（Infinity）。
            {min: 30, max: 49},
            {min: 20, max: 29},
            {min: 10, max: 19},
            {min: 1, max: 9}
        ],
        // align:"right"//默认为左
        }]
      }
    }
  },
  created(){
    //获取订单的数据
    this.findAllOrders().then(()=>{
      // console.log(this.orderOptArray)
      //统计数据
      this.orderOptArray.forEach(item=>{
        switch(item){
          case 1:this.optiondata1[0]++;break;
          case 2:this.optiondata1[1]++;break;
          case 3:this.optiondata1[2]++;break;
          case 4:this.optiondata1[3]++;break;
          case 5:this.optiondata1[4]++;break;
          case 6:this.optiondata1[5]++;break;
          case 7:this.optiondata1[6]++;break;
          case 8:this.optiondata1[7]++;break;
          case 9:this.optiondata1[8]++;break;
          case 10:this.optiondata1[9]++;break;
          case 11:this.optiondata1[10]++;break;
          case 12:this.optiondata1[11]++;break;
        }
      });
      // console.log(this.optiondata1)
      //为订单图表添加数据
      this.OrderOption.series[0].data = this.optiondata1;
      //设置配置项
      this.orderCharts.setOption(this.OrderOption);
    });
    //查询地址
    this.findAllAddress().then(()=>{
      console.log(this.addresslist)
      this.addresslist.forEach(item=>{
        let name = item;
        this.optiondata2.forEach(item=>{
          if(name === item.name){
            item.value++;
          }
        })
      })
      this.AddressOption.series[0].data = this.optiondata2;
      this.addressCharts.setOption(this.AddressOption);
    })

  },
  mounted(){
    // console.log("mounted",this.$refs.orderNum)
    // 只有在mounted才能获取到dom
    //初始化一个echarts
    this.orderCharts = echarts.init(this.$refs.orderNum);
    this.addressCharts = echarts.init(this.$refs.addressNum);

  },
  computed:{
    ...mapState('orders',["orderOptArray"]),
    ...mapState('address',['addresslist'])
  },
  methods:{
    ...mapActions('orders',["findAllOrders"]),
    ...mapActions('address',['findAllAddress'])
  }
  
 
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
// 使用flex布局
.myflex{
  display: flex;
  justify-content: space-around;
  width: 99%;
  height: 400px;
  .orderNum{
    flex: 1;
  }
  .addressNum{
    flex: 1;

  }
  
}
</style>
