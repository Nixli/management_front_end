<template>
  <aside :style="{ width: '200px' }">
    <!-- <el-switch v-model="res" active-color="#13ce66" inactive-color="#ff4949">
    </el-switch> -->

    <!-- <el-row class="block-col-2">

      <el-dropdown trigger="click" @command="switchAccount" v-if="role == '财务'">
        <span class="el-dropdown-link">
          {{ bookName }}<i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown" style="margin-top: -10px;">
          <el-dropdown-item command="a">切换账套</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown trigger="click" @command="switchAccount" v-else-if="role == '老板'">
        <span class="el-dropdown-link">
          {{ bookName }}<i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown" style="margin-top: -10px;">
          <el-dropdown-item command="a">切换账套</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <span v-else>{{ bookName }}</span>
    </el-row> -->


    <el-menu :default-active="comCurIndex" router background-color="#304156" :collapse="!isopen">
      <!-- 插槽 -->
      <template v-for="route in activeMenuRoutes">


        <!-- 当route只有一个孩子的时候 -->
        <el-menu-item v-if="route.children.length === 1" :key="route.path" :index="route.path">
          <i :class="route.meta.icon || 'el-icon-menu'"></i>
          <span slot="title">{{ route.meta.title }}</span>
        </el-menu-item>

        <!-- 当route的孩子大于1 -->
        <el-submenu v-else :key="route.path" :index="route.path">
          <template slot="title">
            <i :class="route.meta.icon || 'el-icon-location'"></i>
            <span>{{ route.meta.title }}</span>
          </template>
          <el-menu-item v-for="child in route.children" :key="child.path" :index="child.path">{{ child.meta.title
          }}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>

  </aside>
</template>

<script>
import { menuRoutes } from '@/router/index'
import { Icon } from 'element-ui'
export default {
  data() {
    return {
      // isopen为true代表展开   isopen为false代表关闭
      // collapse为true代表收起  false代表展开
      res: true,
      isopen: true,
      // 当前定位项
      curIndex: '',
      menuRoutes,
      role: localStorage.getItem('role'),
      bookID:localStorage.getItem('bookID'),
      bookName:localStorage.getItem('bookName')
    };
  },
  methods: {
    handelWindowResize() {
      // 得到尺寸
      let width = document.body.offsetWidth;
      if (width < 800)
        this.isopen = false;
      else
        this.isopen = true;
    },
    switchAccount() {
      // 使用 $router.push 进行路由导航
      this.$router.push('/FinanceAccountBooks');
    }
  },
  created() {
    // 执行一次
    // this.curIndex = this.$route.path
  },
  // 在某一个生命周期中
  mounted() {
    // 页面加载完，不管窗口有没有发生变化，都要计算一次
    this.handelWindowResize();
    // 1. 监听窗口尺寸变化
    window.addEventListener('resize', this.handelWindowResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handelWindowResize);
  },
  computed: {
    activeMenuRoutes() {
      let role = localStorage.getItem('role');
      if (role) {
        return this.menuRoutes.filter(item => {
          return (item.meta.role || []).includes(role);
        });
      }
      else {
        return this.menuRoutes;
      }
    },
    // 1. 因为页面中用到了comCurIndex，所以一进页面计算属性会计算一次，然后把计算之后的值给comCurIndex
    // 2. 每次页面的切换，$route都发生变化，计算属性都会重新执行
    comCurIndex() {
      return this.$route.path;
    }
  },
  watch: {
    // 一进页面执行一次$route的监听事件
    // $route: function(newVal, oldVal) {
    //   console.log('地址发生变化了')
    //   console.log(newVal.path)
    //   this.curIndex = newVal.path
    // }
    $route: {
      handler: function (route) {
        this.curIndex = route.path;
      },
      deep: true,
      immediate: true
    }
  },
  components: { Icon }
}
</script>

<style lang="scss" scoped>
aside {
  color: #fff;
  width: 200px;
  background-color: #304156;
  transition: all .5s;
  height: 100vh;
  overflow-y: scroll;
  flex-shrink: 0;

  .el-menu {
    border-right: none;
  }

  .el-switch {
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .el-menu-item {
    color: #fff;
  }

  .switch-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  // 如果element的一些样式覆盖不了，你就在其前面加上 /deep/
  ::v-deep .el-submenu__title {
    color: #fff;
  }

  ::v-deep .el-menu-item.is-active {
    color: #409EFF;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #FFF;
    font-size: 18px;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .el-icon-arrow-down {
    font-size: 18px;
  }

  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .block-col-2 {
    width: auto;
    height: 50px;
    display: flex;
    justify-content: center;
    text-align: center;
    margin-top: 20px;
  }
}
</style>