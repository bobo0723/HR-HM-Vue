<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- title -->
    <div class="app-breadcrumb">
      黑马程序员
      <span class="breadBtn">体验版</span>
    </div>
    <div class="right-menu">
      <!-- 切换语言组件 -->
      <lang />
      <!-- 全屏组件 -->
      <full-screen />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 用户头像 -->
          <img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h301gduk7qj20b40b4weo.jpg" class="user-avatar">
          <!-- 用户名称 -->
          <span class="name">{{ userName }}</span>
          <i class="el-icon-caret-bottom" style="color:#fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a target="_blank">
            <el-dropdown-item> 项目地址 </el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="loginOut">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Lang from '@/components/Lang'
import FullScreen from '@/components/FullScreen'
// 如何在vue文件中使用store模块中的数据
// 1. this.$store  如果只有一个数据需要用
// 2. 通过映射方法 mapState mapGetters  同一个组件需要很多数据

// 全局getters
// 作用：类似于基于state的计算属性 可以一定程度简化使用

export default {
  components: {
    Hamburger,
    Lang,
    FullScreen
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userName'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录
    loginOut() {
      // 1.询问用户
      this.$confirm('是否确定退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 2.清空Vuex管理的 用户所有数据（token, 用户信息, Cookie, 重置路由）
        this.$store.commit('user/removeUserInfo')
        // 3.跳转到登录
        this.$router.push({
          path: '/login'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }
  .user-avatar {
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    vertical-align: middle;
  }
  .name {
    color: #fff;
    vertical-align: middle;
    margin-left: 5px;
  }
  .user-dropdown {
    color: #fff;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    display:  flex;
    justify-content: center;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
