<template>
  <el-card class="box-card">
    <!-- 添加角色按钮区域 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="addRoleVisible = true"
          >添加角色</el-button
        >
      </el-col>
    </el-row>

    <!-- 角色列表区域 -->
    <el-table :data="RolesList" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template v-slot="scope">
          <el-row
            class="rights_row vertical_center"
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
          >
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="delRightsById(scope.row, item1.id)">{{
                item1.authName
              }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级和三级权限 -->
            <el-col :span="19">
              <el-row
                class="rights_row second_rights vertical_center"
                v-for="(item2, i2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="delRightsById(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    type="warning"
                    closable
                    v-for="(item3, i3) in item2.children"
                    :key="item3.id"
                    @close="delRightsById(scope.row, item3.id)"
                  >
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <!-- 索引列 -->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template v-slot="scope">
          <!-- 编辑按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditRoleDialog(scope.row.id)"
            >编辑
          </el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delRoleById(scope.row.id)"
            >删除</el-button
          >
          <!-- 分配权限按钮 -->
          <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
            @click="showSetRightsDialog(scope.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色(Add Role)"
      :visible.sync="addRoleVisible"
      :close-on-click-modal="false"
      width="50%"
      @close="addRoleDialogClosed()"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色(Edit Role)"
      :visible.sync="editRoleVisible"
      :close-on-click-modal="false"
      width="50%"
      @close="editRoleDialogClosed()"
    >
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button
          ref="editButtonRef"
          type="primary"
          @click="editRole()"
          :disabled="editThrottle"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限(Set Rights)"
      :visible.sync="setRightsDialogVisible"
      :close-on-click-modal="false"
      width="50%"
      @close="setRightsDialogClosed()"
    >
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button
          ref="RightsButtonRef"
          type="primary"
          @click="allotRights()"
          :disabled="isAllotDisable"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  getRolesList,
  addNewRole,
  getRoleById,
  editRoleInfo,
  removeRoleById,
  removeRightsById,
  getRightsList,
  allotRights,
} from 'network/home/power.js'

import { removeDataById } from 'common/util.js'

export default {
  name: 'RolesCard',
  data() {
    return {
      // 角色列表
      RolesList: [],
      // 控制添加角色对话框的显示与隐藏
      addRoleVisible: false,
      // 添加角色的表单数据
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      // 添加角色的规则验证对象
      addRoleFormRules: {
        roleName: [
          {
            required: true,
            whitespace: true,
            message: '请输入角色名称',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 控制编辑角色对话框的显示与隐藏
      editRoleVisible: false,
      // 编辑角色的表单数据
      editRoleForm: {},
      // 编辑角色的规则验证对象
      editRoleFormRules: {
        roleName: [
          {
            required: true,
            whitespace: true,
            message: '请输入角色名称',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 控制编辑角色对话框中的确认按钮是否禁用
      editThrottle: false,
      // 编辑角色表单的备份，用于和最新的编辑角色表单作对比
      oldRole: {},
      // 控制分配权限对话框的显示与隐藏
      setRightsDialogVisible: false,
      // 所有权限列表数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      // 默认选中的节点ID值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: 0,
      // 保存当前所有全选中和半选中的权限id值字符串
      oldRids: '',
      // 分配权限中的确定按钮是否禁用
      isAllotDisable: false,
    }
  },
  created() {
    // 请求角色列表数据
    this.getRolesList()
  },
  methods: {
    // 获取角色列表数据
    async getRolesList() {
      const res = await getRolesList()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.RolesList = res.data
    },
    // 监听添加角色对话框的关闭
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 添加角色
    addRole() {
      // 表单预验证
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return
        // 发送添加角色的网络请求
        const res = await addNewRole(this.addRoleForm)
        this.addRoleVisible = false
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)

        // 角色添加成功，重新刷新角色列表
        this.getRolesList()
        this.$message.success('角色添加成功!')
      })
    },
    // 监听编辑角色按钮的点击
    async showEditRoleDialog(id) {
      // 通过id去请求角色信息
      const res = await getRoleById(id)
      if (res.meta.status !== 200)
        return this.$message.error('角色信息请求失败!')

      this.editRoleForm = res.data
      Object.keys(res.data).map((key) => (this.oldRole[key] = res.data[key]))
      this.editRoleVisible = true
    },
    // 监听编辑角色对话框的关闭
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 编辑角色
    editRole() {
      // 表单预验证
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return

        // 将最新的编辑表单的数据与备份数据进行比较，判断用户是否未修改任何角色信息
        const isEdit = Object.keys(this.oldRole).map(
          (key) => this.editRoleForm[key] === this.oldRole[key]
        )

        // 如果isEdit数组的值全为true说明用户没有修改信息
        if (isEdit.indexOf(false) === -1) {
          this.editThrottle = true
          return this.$message({
            type: 'warning',
            message: '请先修改角色信息！',
            duration: 2000,
            onClose: () => {
              this.editThrottle = false
            },
          })
        }
        if (this.editRoleForm.roleDesc === '') this.editRoleForm.roleDesc = ' '
        // 发送编辑角色的网络请求
        const res = await editRoleInfo(this.editRoleForm)
        this.editRoleVisible = false

        if (res.meta.status !== 200) return this.$message.error('修改角色失败!')

        this.getRolesList()
        this.$message.success('角色信息修改成功!')
      })
    },
    // 根据id删除对应的角色
    delRoleById(id) {
      removeDataById(id, removeRoleById, this.getRolesList)
    },
    // 根据id删除角色对应权限
    async delRightsById(role, rightId) {
      const allId = {
        roleId: role.id,
        rightId,
      }

      // 删除成功返回当前角色下最新的权限数据,删除取消返回undefined
      const data = await removeDataById(allId, removeRightsById)
      /**
       * 这里不需要getRolesList()重新渲染整个角色列表,
       * 只需要将响应的数据赋值给当前角色下的children就可以了，
       * 因此展开列表不会合拢，增强用户体验
       */
      if (data !== undefined) role.children = data
    },
    // 监听分配权限按钮的点击
    async showSetRightsDialog(role) {
      this.roleId = role.id
      // 获取所有权限列表数据
      const res = await getRightsList('tree')
      if (res.meta.status !== 200)
        return this.$message.error('权限列表请求失败!')

      this.rightsList = res.data

      // 递归获取三级权限的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightsDialogVisible = true

      // 等DOM渲染好之后再执行
      this.$nextTick(() => {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys(),
        ]
        // 保存当前所有全选中和半选中的权限id值字符串用于判断用户是否未修改任何权限
        this.oldRids = keys.join(',')
      })
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性,则是三级权限
      if (!node.children) return arr.push(node.id)

      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭
    setRightsDialogClosed() {
      this.defKeys = []
    },
    // 给角色授权
    async allotRights() {
      // 获取当前所有全选中和半选中的权限id值
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // 将数组转换成以 , 号分割的字符串
      const rids = keys.join(',')

      // 验证用户是否未修改任何权限
      if (this.oldRids === rids) {
        this.isAllotDisable = true
        return this.$message.warning({
          message: '未修改任何权限!',
          duration: 1500,
          onClose: () => {
            this.isAllotDisable = false
          },
        })
      }

      // 发送分配权限的网络请求
      const res = await allotRights(this.roleId, rids)
      if (res.meta.status !== 200)
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500,
        })

      this.getRolesList()
      this.setRightsDialogVisible = false
      this.$message.success({
        message: res.meta.msg,
        duration: 1500,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.rights_row {
  border-bottom: 1px solid #eee;
  .el-tag {
    margin: 10px;
  }
}

.rights_row:first-child {
  border-top: 1px solid #eee;
}

.second_rights:first-child {
  border-top: none;
}

.second_rights:last-child {
  border-bottom: none;
}

.vertical_center {
  display: flex;
  align-items: center;
}
</style>