<template>
  <el-card class="box-card">
    <!-- 添加分类按钮区域 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="showCateDialog()">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <tree-table
      class="tree_table"
      :data="categoryList"
      :columns="columns"
      :selection-type="false"
      border
      :expand-type="false"
      show-index
      index-text="#"
      :show-row-hover="false"
    >
      <!-- 是否有效模板 -->
      <template slot="isOk" slot-scope="scope">
        <i
          class="el-icon-success"
          style="color: rgb(0, 255, 98)"
          v-if="!scope.row.cat_deleted"
        ></i>
        <i class="el-icon-error" style="color: rgb(255, 0, 55)" v-else></i>
      </template>
      <!-- 排序模板 -->
      <template slot="order" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1"
          >二级</el-tag
        >
        <el-tag size="mini" type="warning" v-else>三级</el-tag>
      </template>
      <template slot="operation" slot-scope="scope">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          @click="showEditCateDialog(scope.row.cat_id)"
          >编辑</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="delCate(scope.row.cat_id)"
          >删除</el-button
        >
      </template>
    </tree-table>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 15, 30]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加分类对话框 -->
    <el-dialog
      ref="addCateDialogRef"
      title="添加分类(Add Category)"
      :visible.sync="addCateDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="addCateDialogClosed()"
    >
      <!-- 添加分类的表单 -->
      <el-form
        ref="addCateFormRef"
        :rules="addCateRules"
        :model="addCateForm"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascaderProps"
            clearable
            change-on-select
            @change="parentCateChanged()"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      ref="editCateDialogRef"
      title="修改分类(Edit Category)"
      :visible.sync="editCateDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="editCateDialogClosed()"
    >
      <!-- 编辑分类的表单 -->
      <el-form
        ref="editCateFormRef"
        :rules="editCateFormRules"
        :model="editCateForm"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editCate()"
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
  getParentCateList,
  addCategories,
  getCategoryById,
  editCategory,
  delCategoryById,
} from 'network/home/goods.js'

import { removeDataById } from 'common/util.js'

export default {
  name: 'CategoriesCard',
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类列表数据
      categoryList: [],
      // 商品分类的总数据条数
      total: 0,
      // 表格各列的配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 表示当前列定义为模板列
          type: 'template',
          // 模板名称
          template: 'isOk',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation',
        },
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类等级，默认添加一级分类
        cat_level: 0,
      },
      // 添加分类表单的规则验证对象
      addCateRules: {
        cat_name: [
          {
            required: true,
            whitespace: true,
            message: '请输入分类名称',
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
      // 选中的父级分类的id数组
      selectKeys: [],
      // 保存父级分类列表数据
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 控制编辑分类对话框的显示与隐藏
      editCateDialogVisible: false,
      // 编辑分类表单的规则验证对象
      editCateFormRules: {
        cat_name: [
          {
            required: true,
            whitespace: true,
            message: '请输入分类名称',
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
      // 编辑分类的表单
      editCateForm: {
        // 分类的id
        id: 0,
        cat_name: '',
      },
      oldCatName: '',
      // 编辑分类对话框的确定按钮是否禁用
      editConfirmBtnDisabled: false,
    }
  },
  created() {
    // 请求商品分类列表数据
    this.getGoodsCategoryList()
  },
  methods: {
    // 获取商品分类列表数据
    async getGoodsCategoryList() {
      const res = await getGoodsCategoryList(this.queryInfo)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类列表失败！')

      // 把请求到的数据保存到data中，方便后续使用
      this.categoryList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsCategoryList()
    },
    // 监听pagenum的改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsCategoryList()
    },
    // 监听添加分类按钮的点击
    showCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 监听添加分类对话框的关闭
    addCateDialogClosed() {
      this.selectKeys = []
      this.addCateForm.cat_name = ''
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const res = await getParentCateList()
      if (res.meta.status !== 200)
        return this.$message.error('父级分类列表请求失败!')

      this.parentCateList = res.data
    },
    // 选择项发生变化触发
    parentCateChanged() {
      // 如果没有选中任何父级分类
      if (this.selectKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        // 用户删除了选择项，就表示要添加一级分类
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类
    addCategory() {
      // 表单预验证
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return

        // 发送添加分类的网络请求
        const res = await addCategories(this.addCateForm)
        if (res.meta.status !== 201)
          return this.$message.error('添加分类失败！')

        this.getGoodsCategoryList()
        this.addCateDialogVisible = false
        return this.$message.success('添加分类成功！')
      })
    },
    // 监听修改分类对话框的关闭
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 监听编辑分类按钮的点击
    async showEditCateDialog(id) {
      this.editCateDialogVisible = true
      // 根据id请求分类信息
      const res = await getCategoryById(id)
      if (res.meta.status !== 200)
        return this.$message.error('分类信息请求失败!')

      // 将请求到的分类信息保存到编辑表单中
      this.editCateForm.id = res.data.cat_id
      this.editCateForm.cat_name = res.data.cat_name

      // 用于验证用户是否修改了值
      this.oldCatName = res.data.cat_name
    },
    // 编辑分类
    editCate() {
      // 表单预验证
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return

        // 验证用户是否修改了分类名称
        if (this.oldCatName === this.editCateForm.cat_name) {
          this.editConfirmBtnDisabled = true
          return this.$message({
            type: 'warning',
            message: '未修改分类名称!',
            duration: 1800,
            onClose: () => {
              this.editConfirmBtnDisabled = false
            },
          })
        }

        // 发送编辑分类的网络请求
        const res = await editCategory(this.editCateForm)
        // 无论请求成功和失败，都要关闭对话框
        this.editCateDialogVisible = false

        // 请求失败
        if (res.meta.status !== 200) this.$message.error('编辑分类失败!')

        // 请求成功
        this.getGoodsCategoryList()
        this.$message.success('编辑分类成功!')
      })
    },
    // 删除分类
    delCate(id) {
      removeDataById(id, delCategoryById, this.getGoodsCategoryList)
    },
  },
}
</script>

<style lang="less" scoped>
.tree_table {
  margin: 18px 0;
}
</style>