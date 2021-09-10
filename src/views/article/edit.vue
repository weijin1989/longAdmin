<template>
  <div class="app-container voyager">
    <div class="container-fluid">
      <h1 class="page-title"><i class="el-icon-document" /> 修改文章</h1>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="panel panel-bordered">
          <div class="panel-body">
            <div class="form-group">
              <label>标题</label>
              <input
                v-model="info.title"
                type="text"
                class="form-control"
                name="title"
                placeholder="标题"
                maxlength="40"
                value=""
              >
            </div>
            <div class="form-group">
              <label>副标题</label>
              <input
                v-model="info.subTitle"
                type="text"
                class="form-control"
                name="subTitle"
                placeholder="副标题"
                maxlength="40"
                value=""
              >
            </div>
            <div class="form-group">
              <label>发布时间</label><br/>
              <el-date-picker
                style="width: 100%;z-index:888"
                type="datetime"
                placeholder="请选择"
                v-model="info.publishTime"
                @change="timeChange"
                :format="'yyyy-MM-dd HH:mm:ss'"
                >
                <!-- :picker-options="timeConfig" -->
              </el-date-picker>
            </div>
            <div class="form-group">
              <label>作者ID</label>
              <input
                v-model="info.authorId"
                type="text"
                class="form-control"
                name="authorId"
                placeholder="作者ID"
                maxlength="40"
                value=""
              >
            </div>
            <div class="form-group">
              <label>分类</label><br/>
              <el-select
                  v-model="info.catId"
                  placeholder="选择分类"
                  style="margin-right: 20px"
                >
                  <el-option
                    v-for="item in category"
                    :key="item.id"
                    :label="item.catName"
                    :value="item.id"
                  />
                </el-select>
            </div>
            <div class="form-group">
              <label>跳转链接</label>
              <input
                v-model="info.redirectUrl"
                type="text"
                class="form-control"
                name="redirectUrl"
                placeholder="跳转链接"
                value=""
              >
            </div>
            <div class="form-group">
              <label>排序</label>
              <input
                v-model="info.sort"
                type="text"
                class="form-control"
                name="sort"
                placeholder="排序"
                maxlength="40"
                value=""
              >
            </div>
            <div class="form-group">
              <label>浏览数量</label>
              <input
                v-model="info.viewCount"
                type="text"
                class="form-control"
                name="viewCount"
                placeholder="浏览数量"
                maxlength="40"
                value=""
              >
            </div>
            <div class="form-group">
              <label>状态</label><br>
              <el-radio v-model="info.status" :label="0">正常</el-radio>
              <el-radio v-model="info.status" :label="1">待发布</el-radio>
            </div>
            <div class="form-group">
              <label>文章描述</label>
              
              <textarea v-model="info.description" class="form-control" />
            </div>
            <div class="form-group">
              <label>文章内容</label>
              <div id="content" class="example" style="height: 300px" />
            </div>

            <div class="table-responsive" style="overflow: hidden">
              <div class="form-group" style="position: relative; top: 10px">
                <label>文章图片</label>
                <div class="actions">
                  <el-button type="text" @click="batchAdd">添加图片</el-button>
                </div>
              </div>
              <div>
                <div
                  v-for="(item, index) in batchForm"
                  :key="index"
                  class="binding-item"
                >
                  <el-row class="row-box">
                    <el-col :span="6" class="row-left" style="margin-right: 10px;">
                      <input
                        v-model="item.picName"
                        type="text"
                        class="form-control"
                        name="parameter"
                        placeholder="图片名称"
                        value=""
                      >
                    </el-col>
                    <el-col :span="6" class="row-left" style="margin-right: 10px;">
                      <input
                        v-model="item.url"
                        type="text"
                        class="form-control"
                        name="parameter"
                        placeholder="图片链接（点击时的链接）"
                        value=""
                      >
                    </el-col>
                    <el-col :span="8" class="row-left">
                      <input
                        style="padding:5px"
                        type="file"
                        :name="'image'+index"
                        @change="uploadPic(index)"
                      >&nbsp;&nbsp;&nbsp;
                      <img :src="item.url_path" style="width:50px;background:#d5d5d5;border:1px solid #000">
                    </el-col>
                    <el-col :span="3">
                      <el-row
                        style=" font-size:28px;"
                        type="flex"
                        justify="end"
                      >
                        <span
                          class="el-icon-remove-outline add-btn"
                          @click="batchDel(index)"
                        />

                      </el-row>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="panel panel panel-bordered panel-warning">
          <div class="panel-body">
            <div class="form-group">
              <label for="cover_image">封面图</label>
              <img
                :src="info.coverPicPath != '' ? info.coverPicPath : none_img"
                style="
                  max-width: 100px;
                  height: auto;
                  clear: both;
                  display: block;
                  padding: 2px;
                  border: 1px solid #ddd;
                  margin-bottom: 10px;
                "
              >
              <input
                type="file"
                data-name="coverPic"
                name="coverPic"
                @change="upload('coverPic')"
              >
            </div>
          </div>
        </div>
      </div>

    </div>

    <button
      type="submit"
      class="btn btn-primary pull-right save"
      @click="submit"
    >
      保存
    </button>
  </div>
</template>

<script>
import {
  articleUpdate, articleOne
} from '@/api/article'
import {
  uploadImg, getCategory, uploadEditorImg
} from '@/api/common'
import { Loading } from 'element-ui'
import Moment from 'moment';
import E from 'wangeditor'
import $ from 'jquery'

export default {
  name: 'HelpCreate',
  components: {
    // CKEditor
    // quillEditor,
  },
  data() {
    return {
      Eeditor: null,
      text: '',
      timeConfig: {},
      category: [],
      batchForm: [
        {
          picName: '',
          url: '',
          url_path: '',
          picPath: ''
        }
      ],
      batchFormNum: 0,
      info: {
        authorId: '',
        catId: '',
        coverPic: '',
        coverPicPath: '',
        description: '',
        content: '',
        pics: [],
        publishTime: '',
        redirectUrl: '',
        sort: '',
        status: 0,
        subTitle: '',
        title: '',
        viewCount: 0
      },
      loading: '',
      none_img: '/images/default-avatar.png'
    }
  },
  created() {
  },
  mounted() {
    this.getcategory()
    // this.initTimeConfig();
    this.init()
    const id = this.$route.query.id
    this.getfind(id)
  },
  beforeDestroy() {
    // 销毁编辑器
    this.Eeditor.destroy()
    this.Eeditor = null
  },
  methods: {
    getfind(id) {
      articleOne({ id: id }).then(response => {
        this.info = response.data
        this.Eeditor.txt.html(response.data.content)
        this.batchForm = response.data.pics
        // response.data.pics.forEach((val, index) => {
        //   this.batchForm[index].url_path = val.picPath
        // })
        this.info.coverPicPath = response.data.coverPic
      }).catch(() => {
      })
    },
    /**
     * 添加标签项
     */
    addField() {
      this.counter.push({});
      this.counter_num = this.counter_num + 1;
    },
    // 动态删除批量绑定数据
    batchDel(index) {
      if (this.batchForm.length <= 1) {
        this.batchForm[index].picName = '';
        this.batchForm[index].url = 0;
        this.batchForm[index].picPath = '';
        this.batchForm[index].url_path = '';
        this.batchFormNum = 0;
      }
      else {
        // 先删除当前下标的数据
        this.batchForm.splice(index, 1);
        const num = [];
        // 循环找出所有下标,不找出最大值，不根据顺序删除会报错
        this.batchForm.forEach((item) => {
          num.push(item.index);
        });
        // 查出数组中最大值，赋值给batchFormNum
        this.batchFormNum = Math.max(...num);
      }
    },
    batchAdd() {
      this.batchForm.push({ picName: '', url: '', picPath: '', url_path: '' })
      this.batchFormNum = this.batchForm.length + 1
    },
    getcategory() {
      getCategory({ 'type': 'news' }).then(response => {
        this.category = response.data
      }).catch(() => {
      })
    },
    init() {
      this.Eeditor = new E('#content')
      this.Eeditor.config.showLinkImg = false
      this.Eeditor.config.uploadImgServer = uploadEditorImg()
      this.Eeditor.config.uploadFileName = 'file'
      this.Eeditor.config.height = 500
      this.Eeditor.config.uploadImgMaxLength = 1
      this.Eeditor.config.excludeMenus = [
        'video'
      ]
      this.Eeditor.create()
    },
    change(e) {
      const reader = new FileReader()
      const file = e.target.files[0]
      reader.readAsDataURL(file)
      reader.onload = () => {
        const formData = {
          files: reader.result,
          files_name: file.name
        }
        console.log(formData)
        console.log(this.$refs)
        uploadImg(formData)
          .then((res) => {
            const quills = this.$refs.myTextEditor.quill
            if (res.errno === 0) {
              // const formdata = _.extend({}, this.formdata);
              const length = quills.getSelection().index // 光标位置
              // 插入图片  图片地址
              quills.insertEmbed(length, 'image', res.data.url)
              // 调整光标到最后
              quills.setSelection(length + 1) // 光标后移一位
            }
          })
          .catch((err) => {
            console.error(err)
          })
      };
    },
    upload(name) {
      const fileName = 'image/jpg,image/jpeg,image/gif,image/png'
      const that = this

      this.loading = Loading.service({
        lock: true,
        text: '上传中……',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if ($('input[name=' + name + ']').val()) {
        const file = $('input[name=' + name + ']')[0].files[0]
        if (fileName.indexOf(file.type) === -1) {
          this.showToast('上传文件必须是jpg,gif,png')
          return false
        }
        const formData = new FormData()
        formData.append('file', file)
        const params = formData
        uploadImg(params)
          .then((data) => {
            var img = new Image()
            img.src = data.data.url
            img.onload = function() {
              if (name === 'coverPic') {
                that.info.coverPicPath = data.data.url
                that.info.coverPic = data.data.path
              }
              that.loading.close()
            }
          })
          .catch((error) => {
            alert(error)
          })
      }
    },
    uploadPic(index) {
      const fileName = 'image/jpg,image/jpeg,image/gif,image/png'
      const that = this

      this.loading = Loading.service({
        lock: true,
        text: '上传中……',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if ($('input[name=image' + index + ']').val()) {
        const file = $('input[name=image' + index + ']')[0].files[0]
        if (fileName.indexOf(file.type) === -1) {
          this.showToast('上传文件必须是jpg,gif,png')
          return false
        }
        const formData = new FormData()
        formData.append('file', file)
        const params = formData
        uploadImg(params)
          .then((data) => {
            var img = new Image()
            img.src = data.data.url
            img.onload = function() {
              that.batchForm[index].picPath = data.data.path
              that.batchForm[index].url_path = data.data.url + '?' + Math.ceil(Math.random() * 100)
              that.batchForm[index].picName = that.batchForm[index].picName +' '
              that.loading.close()
              console.log('infoinfo', that.batchForm)
            }
          })
          .catch((error) => {
            alert(error)
          })
      }
    },
    submit() {
      this.doSubmit()
    },
    initTimeConfig () {
      let self = this
      // 开始时间配置
      this.timeConfig = {
          disabledDate (time) {
              if (self.endTime) {
                  return time.getTime() > new 
                  Date(self.endTime).getTime()
              }
          }
      }
    },
    formatDate(date) {
      return Moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    timeChange(val) {
      this.info.publishTime = val
    },
    doSubmit() {
      this.info.pics = []
      // const bafom = []
      this.batchForm.forEach((val, index) => {
        this.info.pics.push(val)
        this.info.pics[index].picName = val.picName.trim()
      })
      // console.log(this.info)
      // return false;
      if (this.info.publishTime) {
        this.info.publishTime = this.formatDate(this.info.publishTime)
      }
      const info = this.info
      // console.log(info)
      // return false;

      if (!info.title) {
        this.showToast('标题不能为空')
        return;
      }

      if (!info.catId) {
        this.showToast('请选择分类')
        return;
      }
      info.content = this.Eeditor.txt.html()

      if (!info.content) {
        this.showToast('文章内容不能为空')
        return;
      }

      console.log(info)
      articleUpdate(info)
        .then((data) => {
          this.$router.push('/article/index')
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  .actions {
    position: absolute;
    right: 0px;
    top: -7px;
  }
  .binding-item{
    margin-bottom:10px;
  }

  .example {
    display: flex;
    flex-direction: column;

    .editor {
      height: 40rem;
      overflow: hidden;
    }

    .output {
      width: 100%;
      height: 20rem;
      margin: 0;
      border: 1px solid #ccc;
      overflow-y: auto;
      resize: vertical;

      &.code {
        padding: 1rem;
        height: 16rem;
      }

      &.ql-snow {
        border-top: none;
        height: 24rem;
      }
    }
  }
</style>
