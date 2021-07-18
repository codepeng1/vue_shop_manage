<template>
  <el-card class="box-card">
    <!-- 搜索与添加区域 -->
    <el-row :gutter="40">
      <el-col :span="9">
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUserlist"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserlist"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true"
          >添加用户</el-button
        >
      </el-col>
    </el-row>
    <!-- 用户列表区域 -->
    <el-table :data="userlist" border stripe>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="userStateChanged(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.id)"
          >
          </el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delUserById(scope.row)"
          ></el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加用户的对话框 -->
    <el-dialog
      ref="dialog"
      title="添加用户(Add User)"
      :visible.sync="addDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog
      title="编辑用户(Edit User)"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="editDialogClosed()"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  getUserlist,
  setUserState,
  addNewUser,
  getUserById,
  editUserinfo,
  removeUserById,
} from 'network/home.js'

export default {
  name: 'UsersCard',
  data() {
    // 验证邮箱的规则
    let checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      return regEmail.test(value)
        ? callback()
        : callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    let checkMobile = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      return regMobile.test(value)
        ? callback()
        : callback(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索关键字
        query: '',
        // 请求的页码
        pagenum: 1,
        // 每页显示的数据条数
        pagesize: 2,
      },
      // 用户列表
      userlist: [],
      // 数据总条数
      total: 0,
      // 控制添加用户框的显示与隐藏
      addDialogVisible: false,
      // 控制编辑用户对话框的显示与隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加表单的规则验证对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 状态按钮节流阀
      switchThrottle: false,
      // 编辑用户的表单数据
      editForm: {},
      // 编辑表单的规则验证对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    // 请求用户列表数据
    this.getUserlist()
  },
  methods: {
    async getUserlist() {
      const res = await getUserlist(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error(this.meta.msg)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserlist()
    },
    // 监听pagenum改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getUserlist()
    },
    // 监听switch开关状态的改变
    async userStateChanged(userinfo) {
      if (this.switchThrottle) return (userinfo.mg_state = !userinfo.mg_state)
      const res = await setUserState(userinfo)
      this.switchThrottle = true
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error({
          message: res.meta.msg,
          onClose: () => {
            this.switchThrottle = false
          },
        })
      }
      this.$message.success({
        message: res.meta.msg,
        onClose: () => {
          this.switchThrottle = false
        },
      })
    },
    // 监听添加用户对话框的关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加新用户
    addUser() {
      // 表单预验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 发送添加用户的网络请求
        const res = await addNewUser(this.addForm)
        // 添加失败
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        // 添加成功后，关闭提示框并重新请求用户列表数据
        this.addDialogVisible = false
        this.getUserlist()
        this.$message.success('用户添加成功！')
      })
    },
    // 监听编辑按钮的点击
    async showEditDialog(id) {
      // 根据传入的id去请求用户数据
      const res = await getUserById(id)

      if (res.meta.status !== 200)
        return this.$message.console.error('查询用户失败!')

      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听编辑用户对话框的关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑用户
    editUser() {
      // 表单预验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        // 发送编辑用户的网络请求
        const res = await editUserinfo(this.editForm)
        // 编辑失败
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // 编辑成功后，关闭提示框并重新请求用户列表数据
        this.editDialogVisible = false
        this.getUserlist()
        this.$message.success('用户信息编辑成功！')
      })
    },
    // 根据id删除对应的用户
    async delUserById(info) {
      // 弹框询问用户是否确认删除数据
      const confirmRes = await this.$confirm(
        `此操作将永久删除用户 ${info.username}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      // 确认返回confirm, 取消返回cancel
      if (confirmRes === 'confirm') {
        // 发送删除用户的请求
        const res = await removeUserById(info.id)
        if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
        this.getUserlist()
        this.$message({
          type: 'success',
          message: '删除用户成功！!',
          duration: 1500,
        })
      } else {
        this.$message({
          type: 'info',
          message: '已取消删除',
          duration: 1500,
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(184, 148, 148, 0.2);
}

.el-table {
  font-size: 12px;
  margin-top: 17px;
}
</style>