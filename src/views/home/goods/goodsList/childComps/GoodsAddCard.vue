<template>
  <el-card class="box-card">
    <!-- 提示区域 -->
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon
      :closable="false"
    >
    </el-alert>

    <!-- 步骤条区域 -->
    <el-steps
      :space="200"
      :active="+activeIndex"
      finish-status="success"
      align-center
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <!-- tab栏区域 -->
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-position="top"
    >
      <el-tabs
        :before-leave="beforeTabLeave"
        v-model="activeIndex"
        tab-position="left"
        @tab-click="tabclicked()"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品分类" prop="goods_cate">
            <!-- 级联选择器 -->
            <el-cascader
              v-model="addForm.goods_cat"
              :options="categoryList"
              :props="cascaderProps"
              @change="handleChange()"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input-number
              :min="1"
              v-model="addForm.goods_price"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input-number
              :min="1"
              v-model="addForm.goods_weight"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input-number
              :min="1"
              v-model="addForm.goods_number"
            ></el-input-number>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item
            :label="item.attr_name"
            v-for="item in paramsList"
            :key="item.attr_id"
          >
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                :label="val"
                v-for="(val, index) in item.attr_vals"
                :key="index"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item
            :label="item.attr_name"
            v-for="item in attributesList"
            :key="item.attr_id"
          >
            <el-input v-model="item.attr_vals.join(',')"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            ref="uploadRef"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headerObj"
            :on-success="handleSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-button
            size="small"
            type="danger"
            class="removeImg"
            @click="removeAllImg"
            >一键清空</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 基于vue的富文本编辑器组件 -->
          <quill-editor class="quill-editor" />
          <!-- 添加商品 -->
          <el-button
            type="primary"
            class="addBtn"
            @click="addGoods()"
            :disabled="addGoodsBtnDisabled"
            >添加商品</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览(Preview Picture)"
      :visible.sync="imgDialogVisible"
      width="50%"
    >
      <img :src="previewImgURL" alt="" />
    </el-dialog>
  </el-card>
</template>

<script>
import {
  getGoodsCategoryList,
  getCateParams,
  addGoods,
} from 'network/home/goods.js'
import QuillEditor from 'components/content/QuillEditor.vue'

export default {
  components: { QuillEditor },
  name: 'GoodsAddCard',
  data() {
    return {
      // 步骤条当前被激活项索引
      activeIndex: '0',
      // 添加商品表单数据对象
      addForm: {
        // 商品名称
        goods_name: '',
        // 商品价格
        goods_price: 1,
        // 商品重量
        goods_weight: 1,
        // 商品数量
        goods_number: 1,
        // 商品所属的分类数组
        goods_cat: [],
        // 商品图片的数组
        pics: [],
        // 商品介绍
        goods_introduce: '',
      },
      // 添加商品表单规则验证对象
      addFormRules: {
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
      // 商品分类列表数据
      categoryList: [],
      // 指定基本信息中级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 节流阀
      throttle: false,
      // 保存动态参数列表
      paramsList: [],
      // 保存静态属性列表
      attributesList: [],
      // 图片要上传到的后台API地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件内部没有用axios，所以要手动添加headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 控制预览图片对话框的显示与隐藏
      imgDialogVisible: false,
      // 预览图片的URL地址
      previewImgURL: '',
      // 添加商品按钮是否禁用
      addGoodsBtnDisabled: false,
    }
  },
  computed: {
    // 动态获取vux中的值赋值给商品介绍
    content() {
      return this.$store.state.editorContent
    },
  },
  watch: {
    content() {
      this.addForm.goods_introduce = this.content
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
      this.$refs.addFormRef.resetFields()
      this.addForm.pics = []
      this.$refs.uploadRef.clearFiles()
      this.$store.commit('editContent', '')
      // 如果用户选择的不是三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      } else {
        this.getCateParams('many')
        this.getCateParams('only')
      }
    },
    // 切换标签页之前执行的钩子函数
    beforeTabLeave(activeName, oldActiveName) {
      if (this.throttle) return false
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.throttle = true
        this.$message({
          type: 'error',
          message: '请先选择商品分类!',
          duration: 1500,
          onClose: () => {
            this.throttle = false
          },
        })
        return false
      }
    },
    // 当tabs标签页被点击时触发
    tabclicked() {},
    // 获取分类参数列表
    async getCateParams(activeTabsName) {
      const cat_id = this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
      const res = await getCateParams(cat_id, activeTabsName)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      // 服务器返回的attr_vals参数值是一个字符串，所以要分割为数组
      res.data.forEach((item) => {
        // 如果有参数值就通过 , 号切割为数组，如果没有值，直接返回[]数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
      })
      // 把分类参数列表保存到data中
      activeTabsName === 'many'
        ? (this.paramsList = res.data)
        : (this.attributesList = res.data)
    },
    // 图片预览效果
    handlePreview(file) {
      this.previewImgURL = file.url
      this.imgDialogVisible = true
    },
    // 移除图片
    handleRemove(file) {
      // 1.获取即将删除的图片临时路径
      // 2.找到临时路径在pic数组中的索引值
      // 3.根据索引值删除对应的图片信息对象
      this.addForm.pics.splice(
        this.addForm.pics.findIndex(
          (x) => x.pic === file.response.data.tmp_path
        ),
        1
      )
    },
    // 图片上传成功执行的钩子函数
    handleSuccess(response) {
      // 2.将图片信息对象保存到pics数组中
      this.addForm.pics.push({
        pic: response.data.tmp_path,
      })
    },
    // 一键删除所有的商品图片
    removeAllImg() {
      this.$refs.uploadRef.clearFiles()
      this.addForm.pics = []
    },
    // 添加商品
    addGoods() {
      // 表单预验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.addGoodsBtnDisabled = true
          return this.$message({
            type: 'error',
            message: '请填写必要的表单项',
            onClose: () => (this.addGoodsBtnDisabled = false),
          })
        }

        // 处理商品图片数组
        this.addForm.pics.forEach(
          (item) => (item.pic = '/' + item.pic.replace('\\', '/'))
        )
        // 将动态参数和静态属性中的参数值用 ,号连接
        this.paramsList.forEach((item) => {
          item.attr_value = item.attr_vals.join(',')
        })
        this.attributesList.forEach((item) => {
          item.attr_value = item.attr_vals.join(',')
        })
        // 合并动态参数和静态属性数组
        const attrs = [...this.paramsList.concat(this.attributesList)]
        // 解构赋值
        const {
          goods_name,
          goods_cat,
          goods_price,
          goods_number,
          goods_weight,
          goods_introduce,
          pics,
        } = this.addForm
        // 整合商品信息
        const goodsInfo = {
          goods_name,
          goods_cat: goods_cat.join(','),
          goods_price,
          goods_number,
          goods_weight,
          goods_introduce: goods_introduce
            .replace('<p>', '')
            .replace('</p>', ''),
          pics,
          attrs,
        }
        // 发送添加商品的网络请求
        const res = await addGoods(goodsInfo)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)

        // 添加商品成功
        this.$router.push('/goods')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}

.el-checkbox {
  margin: 0 15px 0 0 !important;
}

.el-dialog {
  img {
    width: 100%;
  }
}

.addBtn {
  margin-top: 20px;
}

.removeImg {
  margin-top: 15px;
}
</style>