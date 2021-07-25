<template>
  <el-card class="box-card">
    <!-- 搜索与添加区域 -->
    <el-row :gutter="40">
      <el-col :span="9">
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getGoodsList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getGoodsList"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAddPage()">添加商品</el-button>
      </el-col>
    </el-row>

    <!-- 商品表格区域 -->
    <el-table :data="goodsList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column
        label="商品价格"
        prop="goods_price"
        width="95px"
      ></el-table-column>
      <el-table-column
        label="商品重量"
        prop="goods_weight"
        width="70px"
      ></el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="160px">
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template v-slot="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.goods_id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delGoods(scope.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页码区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 编辑商品对话框 -->
    <el-dialog
      title="编辑商品(Edit Goods)"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="goodsInfo"
        :rules="goodsInfoRules"
        ref="goodsInfoRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="goodsInfo.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍">
          <el-input v-model="goodsInfo.goods_introduce"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input-number
            :min="1"
            v-model="goodsInfo.goods_price"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input-number
            :min="1"
            v-model="goodsInfo.goods_number"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input-number
            :min="1"
            v-model="goodsInfo.goods_weight"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editGoods()"
          :disabled="editBtnDisabled"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  getGoodsList,
  delGoods,
  getGoodsInfoById,
  editGoods,
} from 'network/home/goods.js'
import { removeDataById, dateFormat } from 'common/util.js'

export default {
  name: 'GoodsCard',
  data() {
    return {
      // 获取商品列表数据的对象
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示的条数
        pagesize: 10,
      },
      // 商品列表数据
      goodsList: [],
      // 商品总条数
      total: 0,
      // 格式化后的创建时间
      addTime: '',
      // 控制编辑商品对话框的显示与隐藏
      editDialogVisible: false,
      // 保存编辑商品信息
      goodsInfo: {
        goods_id: 0,
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_introduce: '',
      },
      // 编辑商品的规则验证对象
      goodsInfoRules: {
        goods_name: [
          {
            required: true,
            whitespace: true,
            message: '请输入商品名称',
            trigger: 'blur',
          },
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur',
          },
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur',
          },
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur',
          },
        ],
      },
      // 深拷贝的编辑商品信息对象
      copyGoodsInfo: {},
      // 编辑对话框中的确定按钮是否禁用
      editBtnDisabled: false,
    }
  },
  created() {
    // 请求商品列表数据
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const res = await getGoodsList(this.queryInfo)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败！')

      // 将商品对象中的创建时间格式化
      res.data.goods.forEach((item) => {
        item.add_time = dateFormat(item.add_time, '-')
      })
      // 把请求到的数据保存到data中，方便后续使用
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听pagenum的改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    // 删除商品
    delGoods(id) {
      removeDataById(id, delGoods, this.getGoodsList)
    },
    // 跳转到添加商品页面
    goAddPage() {
      this.$router.push('/goods/add')
    },
    // 监听编辑商品按钮的点击
    async showEditDialog(id) {
      // 通过id请求商品数据
      const res = await getGoodsInfoById(id)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品信息失败！')

      // 请求成功
      // 把商品信息对象中需要的信息进行赋值操作
      Object.keys(this.goodsInfo).map(
        (key) => (this.goodsInfo[key] = res.data[key])
      )
      // 深拷贝一份商品信息，用于验证用户是否修改任何值
      this.copyGoodsInfo = JSON.parse(JSON.stringify(this.goodsInfo))
      this.editDialogVisible = true
    },
    // 编辑商品
    editGoods() {
      // 表单预验证
      this.$refs.goodsInfoRef.validate(async (valid) => {
        if (!valid) return

        // 验证用户是否未修改任何值
        const result = Object.keys(this.goodsInfo).map(
          (key) => this.goodsInfo[key] === this.copyGoodsInfo[key]
        )
        console.log(result)
        if (result.indexOf(false) === -1) {
          this.editBtnDisabled = true
          return this.$message({
            type: 'warning',
            message: '请先修改商品信息!',
            duration: 1500,
            onClose: () => (this.editBtnDisabled = false),
          })
        }

        // 发送编辑商品的网络请求
        const res = await editGoods(this.goodsInfo)
        this.editDialogVisible = false

        if (res.meta.status !== 200)
          return this.$message.error('修改商品信息失败!')

        // 请求成功
        this.getGoodsList()
      })
    },
  },
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>