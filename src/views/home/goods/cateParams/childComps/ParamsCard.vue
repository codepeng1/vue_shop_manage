<template>
  <el-card class="box-card">
    <!-- 警告区域 -->
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      show-icon
      :closable="false"
    >
    </el-alert>

    <!-- 选择商品分类区域 -->
    <el-row class="cat_opt">
      <el-col>
        <span>选择商品分类：</span>
        <!-- 级联选择器 -->
        <el-cascader
          v-model="selectCateKeys"
          :options="categoryList"
          :props="cascaderProps"
          @change="handleChange()"
        ></el-cascader>
      </el-col>
    </el-row>

    <!-- tabs 标签页区域 -->
    <el-tabs v-model="activeTabsName" @tab-click="handleClick()">
      <el-tab-pane label="动态参数" name="many">
        <el-button
          type="primary"
          size="small"
          :disabled="addBtnDisabled"
          @click="addDialogVisible = true"
          >添加参数</el-button
        >

        <!-- 动态参数表格区域 -->
        <el-table :data="paramsOrAttributes" border stripe>
          <!-- 展开行 -->
          <el-table-column type="expand">
            <template v-slot="scope">
              <!-- 循环渲染tag标签 -->
              <el-tag
                v-for="(item, index) in scope.row.attr_vals"
                :key="index"
                closable
                @close="handleClosed(index, scope.row)"
                >{{ item }}</el-tag
              >
              <!-- 输入文本框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.tagInputVisible"
                v-model="scope.row.tagInputValue"
                ref="saveTagInputRef"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <!-- 添加按钮 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delParams(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button
          type="primary"
          size="small"
          :disabled="addBtnDisabled"
          @click="addDialogVisible = true"
          >添加属性</el-button
        >

        <!-- 静态属性表格区域 -->
        <el-table :data="paramsOrAttributes" border stripe>
          <!-- 展开行 -->
          <el-table-column type="expand">
            <template v-slot="scope">
              <!-- 循环渲染tag标签 -->
              <el-tag
                v-for="(item, index) in scope.row.attr_vals"
                :key="index"
                closable
                @close="handleClosed(index, scope.row)"
                >{{ item }}</el-tag
              >
              <!-- 输入文本框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.tagInputVisible"
                v-model="scope.row.tagInputValue"
                ref="saveTagInputRef"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <!-- 添加按钮 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delParams(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加参数的对话框 -->
    <el-dialog
      ref="addDialogRef"
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="addDialogClosed()"
    >
      <!-- 添加参数的表单 -->
      <el-form
        ref="addFormRef"
        :rules="addFormRules"
        :model="addForm"
        label-width="100px"
      >
        <el-form-item :label="titleText + '：'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数的对话框 -->
    <el-dialog
      ref="editDialogRef"
      :title="'编辑' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="editDialogClosed()"
    >
      <!-- 添加参数的表单 -->
      <el-form
        ref="editFormRef"
        :rules="editFormRules"
        :model="editForm"
        label-width="100px"
      >
        <el-form-item :label="titleText + '：'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editParams()"
          :disabled="editConfirmBtnDisabled"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  getGoodsCategoryList,
  getCateParams,
  addParams,
  editParams,
  delParams,
} from 'network/home/goods.js'

import { removeDataById } from 'common/util.js'

export default {
  name: 'ParamsCard',
  data() {
    return {
      // 商品分类列表数据
      categoryList: [],
      // 保存用户选择的商品分类id数组
      selectCateKeys: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 当前被选中的标签页名称
      activeTabsName: 'many',
      // 保存三级商品分类的id
      cate_id: 0,
      // 保存动态参数或静态属性
      paramsOrAttributes: [],
      // 控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单
      addForm: {
        attr_name: '',
      },
      // 添加参数表单的规则验证对象
      addFormRules: {
        attr_name: [
          {
            required: true,
            whitespace: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 15,
            message: '长度在 1 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 控制编辑参数对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑参数表单的规则验证对象
      editFormRules: {
        attr_name: [
          {
            required: true,
            whitespace: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 15,
            message: '长度在 1 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 编辑参数的表单
      editForm: {
        attr_name: '',
      },
      // 参数名称，用于判断用户是否未进行编辑
      oldAttrName: '',
      // 控制编辑参数中的确定按钮是否禁用
      editConfirmBtnDisabled: false,
      // 参数的id
      attrId: 0,
    }
  },
  computed: {
    // tabs标签页中的添加按钮是否禁用
    addBtnDisabled() {
      return this.selectCateKeys.length !== 3
    },
    // 通过判断当前面板，返回动态参数或静态属性
    titleText() {
      return this.activeTabsName === 'many' ? '动态参数' : '静态属性'
    },
  },
  created() {
    // 请求商品分类列表数据
    this.getCategoryList()
  },
  methods: {
    // 获取商品分类列表数据
    async getCategoryList() {
      const res = await getGoodsCategoryList()
      if (res.meta.status !== 200)
        return this.$message.error('商品分类列表请求失败')

      // 将商品分类列表数据保存到data中
      this.categoryList = res.data
    },
    // 商品分类级联选择器选中时触发
    handleChange() {
      // 如果用户选择的不是三级分类
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        this.paramsOrAttributes = []
        return
      }

      // 数组最后一个值就是选中的三级商品分类id，将其保存到data中
      this.cate_id = this.selectCateKeys[this.selectCateKeys.length - 1]
      // 获取分类参数列表
      this.getCateParams()
    },
    // tabs标签页点击时触发
    handleClick() {
      // 如果selectCateKeys数组长度不等于3，说明用户还没有选择三级分类
      if (this.selectCateKeys.length !== 3) return

      this.getCateParams()
    },
    // 获取分类参数列表
    async getCateParams() {
      const res = await getCateParams(this.cate_id, this.activeTabsName)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      // 服务器返回的attr_vals参数值是一个字符串，所以要分割为数组
      res.data.forEach((item) => {
        // 如果有参数值就通过 , 号切割为数组，如果没有值，直接返回[]数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 控制文本框的显示与隐藏
        item.tagInputVisible = false
        // 文本框输入的值
        item.tagInputValue = ''
      })
      // 把分类参数列表保存到data中
      this.paramsOrAttributes = res.data
    },
    // 监听添加参数对话框的关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addParams() {
      // 表单预验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return

        // 发送添加参数的请求
        const res = await addParams(
          this.cate_id,
          this.addForm.attr_name,
          this.activeTabsName
        )

        this.addDialogVisible = false
        if (res.meta.status !== 201) return this.$message.error('参数添加失败!')

        // 添加参数成功
        this.getCateParams()
        return this.$message.success('参数添加成功!')
      })
    },
    // 监听编辑参数对话框的关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听编辑参数按钮的点击
    showEditDialog(paramsInfo) {
      this.editDialogVisible = true
      this.editForm.attr_name = paramsInfo.attr_name
      this.attrVals = paramsInfo.attr_vals
      // 将参数名称保存起来，用于判断用户是否未修改
      this.oldAttrName = paramsInfo.attr_name
      // 将参数的attr_id保存到data中
      this.attrId = paramsInfo.attr_id
    },
    // 修改参数
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        // 判断用户是否未修改参数名称
        if (this.oldAttrName === this.editForm.attr_name) {
          this.editConfirmBtnDisabled = true
          return this.$message({
            type: 'warning',
            message: '未修改参数!',
            duration: 1800,
            onClose: () => {
              this.editConfirmBtnDisabled = false
            },
          })
        }

        // 发送修改参数的网络请求
        const res = await editParams(
          this.cate_id,
          this.attrId,
          this.editForm.attr_name,
          this.activeTabsName,
          this.attrVals.join(',')
        )
        this.editDialogVisible = false
        if (res.meta.status !== 200) return this.$message.error('修改参数失败!')

        // 修改参数成功
        this.getCateParams()
        return this.$message.success('修改参数成功!')
      })
    },
    // 删除参数
    delParams(attrid) {
      const idObj = {
        cat_id: this.cate_id,
        attrid,
      }
      // 发送删除参数的网络请求
      removeDataById(idObj, delParams, this.getCateParams)
    },
    // 当tag标签中的文本框失去焦点或按下回车键时触发
    async handleInputConfirm(row) {
      const val = row.tagInputValue.trim()
      // 隐藏input并将value值置为空
      row.tagInputVisible = false
      row.tagInputValue = ''
      // 如果用户输入的空字符串
      if (val === '') return

      // 添加参数值
      row.attr_vals.push(val)
      // 发送编辑提交参数的网络请求并携带参数值
      const res = await editParams(
        this.cate_id,
        row.attr_id,
        row.attr_name,
        this.activeTabsName,
        row.attr_vals.join(',')
      )
      if (res.meta.status !== 200) return this.$message.error('添加参数值失败!')
    },
    // 当tag标签中的添加按钮被点击时触发
    showInput(row) {
      row.tagInputVisible = true
      // 数据变化后，等DOM渲染之后再执行
      this.$nextTick(() => {
        this.$refs.saveTagInputRef.focus()
      })
    },
    // 删除参数值
    async handleClosed(index, row) {
      row.attr_vals.splice(index, 1)
      // 发送编辑提交参数的网络请求并携带参数值
      const res = await editParams(
        this.cate_id,
        row.attr_id,
        row.attr_name,
        this.activeTabsName,
        row.attr_vals.join(',')
      )
      if (res.meta.status !== 200) return this.$message.error('删除参数值失败!')
    },
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>