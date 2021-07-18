<template>
  <el-aside :width="asideWidth">
    <!-- 侧边栏折叠盒子 -->
    <div class="toggle_button" @click="toggleCollapse">|||</div>
    <!-- 侧边栏菜单区域 -->
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="activePath"
    >
      <!-- 一级菜单 -->
      <el-submenu
        :index="item.id + ''"
        v-for="item in menuLists"
        :key="item.id"
      >
        <!-- 一级菜单模板 -->
        <template slot="title">
          <i :class="'iconfont ' + iconObj[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>

        <!-- 二级菜单 -->
        <el-menu-item
          :index="'/' + subItem.path"
          v-for="subItem in item.children"
          :key="subItem.id"
          @click="saveNavState('/' + subItem.path)"
        >
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ subItem.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'HomeAside',
  data() {
    return {
      iconObj: {
        125: 'icon-user',
        103: 'icon-tijikongjian',
        101: 'icon-shangpin',
        102: 'icon-danju',
        145: 'icon-baobiao',
      },
      // 左侧菜单是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  props: {
    menuLists: {
      type: Array,
      default() {
        return []
      },
    },
  },
  computed: {
    asideWidth() {
      return this.isCollapse ? '64px' : '200px'
    },
  },
  methods: {
    // 切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath', activePath)
    },
  },
}
</script>

<style lang="less" scoped>
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.iconfont {
  margin-right: 11px;
}

.toggle_button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 25px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.25em;
  cursor: pointer;
}
</style>