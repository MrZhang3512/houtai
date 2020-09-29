<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <h3>{{name}}</h3>
      <!-- 分割线 -->
      <el-divider content-position="left"></el-divider>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  data(){
    return {
      name:"后台管理系统"
    }
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
</style>
