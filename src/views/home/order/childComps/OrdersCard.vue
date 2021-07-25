<template>
  <el-card class="box-card">
    <!-- 搜索框区域 -->
    <el-row :gutter="40">
      <el-col :span="9">
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getOrderList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getOrderList"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>

    <!-- 订单表格区域 -->
    <el-table :data="orderList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column
        label="订单编号"
        prop="order_number"
        width="250px"
      ></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
        <template v-slot="scope">
          <el-tag type="success" v-if="scope.row.pay_status === '1'"
            >已付款</el-tag
          >
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="下单时间" prop="create_time"> </el-table-column>
      <el-table-column label="操作" width="180px">
        <template v-slot="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditOrderDialog()"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-location"
            size="mini"
            @click="showLogisticsDialog()"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页码区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址(Edit Address)"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="editDialogClosed()"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度(Logistics Process)"
      :visible.sync="LogisticsDialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in logisticsInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </el-card>
</template>

<script>
import { getOrderList, checkLogistics } from 'network/home/order.js'
import { dateFormat } from 'common/util.js'
import cityData from 'common/citydata.js'

export default {
  name: 'OrdersCard',
  data() {
    return {
      // 获取订单列表的数据对象
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示的条数
        pagesize: 10,
      },
      // 订单列表数据
      orderList: [],
      // 订单数据总条数
      total: 0,
      // 控制修改地址对话框的显示与隐藏
      editDialogVisible: false,
      // 修改地址表单对象
      addressForm: {
        address1: '',
        address2: '',
      },
      // 修改地址表单的规则验证对象
      addressFormRules: {
        address1: [
          {
            required: true,
            message: '请选择省市区县',
            trigger: 'blur',
          },
        ],
        address2: [
          {
            required: true,
            message: '请填写详细地址',
            trigger: 'blur',
          },
        ],
      },
      // 省市区县数据对象
      cityData,
      // 控制物流进度对话框的显示与隐藏
      LogisticsDialogVisible: false,
      // 仅供测试的物流信息数组
      logisticsInfo: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: '',
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context:
            '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: '',
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context:
            '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: '',
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: '',
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: '',
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: '',
        },
      ],
    }
  },
  created() {
    // 请求订单列表数据
    this.getOrderList()
  },
  methods: {
    // 获取订单列表数据
    async getOrderList() {
      const res = await getOrderList(this.queryInfo)
      if (res.meta.status !== 200)
        return this.$message.error('订单列表获取失败!')

      // 将商品对象中的创建时间格式化
      res.data.goods.forEach((item) => {
        item.create_time = dateFormat(item.create_time, '-')
      })

      // 将请求到的数据保存到data中
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听pagenum的改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    // 监听修改地址按钮的点击
    showEditOrderDialog() {
      this.editDialogVisible = true
    },
    // 修改地址对话框被关闭时
    editDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 监听物流按钮的点击
    async showLogisticsDialog() {
      this.LogisticsDialogVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-bottom: 15px;
}
</style>