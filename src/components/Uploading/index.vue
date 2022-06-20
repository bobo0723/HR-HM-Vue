<template>
  <div>
    <!-- 上传组件 - 来自ElementUI -->
    <!--
      action: 配置上传的有效接口地址 如果是直接上传到我们自己的服务器 这里直接配置就可以
              但是现在我们是上传到三方服务器 用#占个位置 防止组件校验prop出错
      show-file-list: 是否显示上传的列表 单张图片
      on-success: 回调函数 在上传完毕之后自动执行 这个回调函数 如果你添加自定义覆盖 它失去作用
      before-upload： 回调函数  在上传前先做校验 只有校验通过才能执行正式的上传
      http-request: 回调函数  完全自定义上传逻辑 适合不能直接上传给自己的服务器 要通过一些自定义的
      写法上传三方 加上这个之后 组件只负责图片校验 上传的部分它不管了
    -->
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="upload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
      <el-progress v-if="showProgress" class="progress" type="circle" :percentage="percent" />
    </el-upload>
  </div>
</template>

<script>
const COS = require('cos-js-sdk-v5')
const cos = new COS({
  SecretId: 'AKID4zf5GCrFMCm57uRhhQt5zcy4sPfeMo0x', // 身份识别ID
  SecretKey: 'h6E5fy0kDPKyMTDhuqVt0pOghSv72f28' // 身份秘钥
})
export default {
  name: 'UploadImg',
  props: {
    // url: {
    //   type: String,
    //   default: ''
    // },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: '',
      percent: 0,
      showProgress: false
    }
  },
  watch: {
    // url: function() {
    //   this.imageUrl = this.url
    // },
    value: function() {
      this.imageUrl = this.value
    }
  },
  methods: {
    upload(res) {
      if (res.file) {
        // 执行上传操作
        this.showProgress = true
        cos.putObject({
          Bucket: 'bobo-1312458859', /* 存储桶 */
          Region: 'ap-beijing', /* 存储桶所在地域，必须字段 */
          Key: res.file.name, /* 文件名 */
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: res.file, // 上传文件对象
          onProgress: (progressData) => {
            console.log(JSON.stringify(progressData))
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          console.log(err || data)
          // 上传成功之后
          if (data.statusCode === 200) {
            // 回显数据
            this.imageUrl = `https://${data.Location}`
            // 使用事件发送给父组件imageUrl的值
            // this.$emit('get-url', this.imageUrl)
            this.$emit('input', this.imageUrl)
            this.showProgress = false
          }
        })
      }
    },
    beforeAvatarUpload(file) {
      const isPNG = file.type === 'image/png'
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isPNG) {
        this.$message.error('上传头像图片只能是 PNG 格式!')
      }
      if (!isLt20M) {
        this.$message.error('上传头像图片大小不能超过 20MB!')
      }
      return isPNG && isLt20M
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: #fff;
}
</style>
