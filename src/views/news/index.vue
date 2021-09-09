<template>
  <div class="app-container voyager">
    <div class="container-fluid">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="14">
          <el-row type="flex" align="middle">
            <el-col type="flex" :span="18">
              <h1 class="page-title"><i class="el-icon-picture" /> 资讯列表</h1>
              <router-link
                v-if="permissions.create"
                to="/photo-editor/brush_texture/create"
                class="btn btn-success btn-add-new"
              >
                <i class="voyager-plus" /> <span>增加</span>
              </router-link>
              <!-- <a v-if="permissions.create" @click.prevent.stop="edit(0)" class="btn btn-success btn-add-new">
                <i class="voyager-plus" /> <span>{{ $t('table.add') }}</span>
              </a> --> </el-col><el-col type="flex" :span="10" align="middle">
              <el-col
                v-if="filterOptions && filterOptions.length > 0"
                :span="10"
              >
                <el-select
                  v-model="listQuery.sort"
                  placeholder="显示排序"
                  style="margin-right: 20px"
                  @change="onFilterChange"
                >
                  <el-option
                    v-for="item in filterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="page-content browse container-fluid">
      <div class="alerts" />
      <div class="row">
        <div class="col-md-12">
          <div class="panel panel-bordered">
            <div class="panel-body">
              <div class="table-responsive">
                <table id="dataTable" class="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>id</th>

                      <th>笔刷名称</th>

                      <th>缩略图</th>

                      <th>资源包</th>
                      <th>是否为会员资源</th>
                      <th>是否随机</th>

                      <th>排序</th>

                      <th>资源包32位MD5校验值</th>
                      <th>添加时间</th>

                      <th class="actions text-right">
                        操作
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="item in list" :key="'item' + item.id">
                      <td>
                        {{ item.id }}
                      </td>

                      <!-- <td v-if="item.pid==0" @click="onFilterChange(item.id,item.category_name)">
                        <span style="color:#004eff; cursor:pointer ">{{ item.category_name }}</span>
                      </td> -->
                      <!-- <td v-else> -->
                      <td>
                        {{ item.brushTextureTitle }}
                      </td>

                      <td>
                        <a
                          :href="item.brushTextureIcon"
                          target="_blank"
                        ><img
                          :src="
                            item.brushTextureIcon +
                              '?x-oss-process=image/resize,w_50'
                          "
                          width="80"
                        ></a>
                      </td>

                      <td>
                        <a :href="item.brushTextureZip" target="_blank">下载文件</a>
                      </td>
                      <td>
                        {{ item.vipResources===0?'不是':'是' }}
                      </td>
                      <td>
                        {{ item.showTextureRandom===0?'不随机':'随机' }}
                      </td>

                      <td>
                        {{ item.sort }}
                      </td>

                      <td>
                        {{ item.brushTextureZipMd5 }}
                      </td>

                      <td>
                        {{ formatDate(item.createdAt) }}
                      </td>

                      <td class="no-sort no-click bread-actions">
                        <!-- <a class="btn btn-sm btn-info" @click="statistics_pop(item.id)">修改排序</a> -->
                        <a
                          v-if="permissions.delete"
                          id="delete-1"
                          :title="'删除'"
                          class="btn btn-sm btn-danger pull-right delete"
                          data-id="1"
                          @click.prevent.stop="deleteBrushTexture(item)"
                        >
                          <i class="voyager-trash" />
                          <span class="hidden-xs hidden-sm">{{
                            删除
                          }}</span>
                        </a>

                        <router-link
                          :to="'/photo-editor/brush_texture/edit/' + item.id"
                          class="btn btn-sm btn-primary pull-right edit"
                        >
                          <i class="el-icon-aim" />
                          <span class="hidden-xs hidden-sm">修改</span>
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <pagination
                  v-show="total > 0"
                  :total="total"
                  :type.sync="listQuery.type"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="getList"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <my-modal
      id="modal-sm"
      ref="myModal"
      :title="'确认删除'"
      @ok="handleOk"
    >
      确认删除改记录吗？
    </my-modal>
  </div>
</template>

<script>
// import { listBrushTexture, deleteBrushTexture, infoBrushTexture, sortSaveBrushTexture } from '@/api/photo-editor';
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import Moment from 'moment';
// import draggable from 'vuedraggable';

export default {
  name: 'News',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      pid: 0,
      pname: '',
      title: '',
      filterOptions: [
        { label: '上传时间', value: 1 },
        { label: '显示排序', value: 2 }
      ],
      pcount: 0,
      none_img: '/images/default-avatar.png',
      sort_info: {
        id: 0,
        sort: 0
      },
      info: {
        category_name: '',
        pid: 0,
        // bann: '',
        id: 0,
        status: 1
      },
      listQuery: {
        page: 1,
        pid: 0,
        sort: 1,
        keywords: '',
        type: '',
        limit: 20
      },
      permissions: (this.$route.meta && this.$route.meta.permissions) || {}
    }
  },
  created() {
    // this.getList();
  },
  methods: {
    statistics_pop(id) {
      infoBrushTexture(id).then(response => {
        const info = response.data
        this.sort_info.id = info.id
        this.sort_info.sort = info.sort
        this.$bvModal.show('modal-sm1')
      }).catch(error => {
        alert(error)
      })
    },
    saveSort(finish) {
      finish && finish('success')
      sortSaveBrushTexture(this.sort_info)
        .then((data) => {
          this.getList()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onFilterChange() {
      console.log(this.listQuery)
      this.listQuery.page = 1
      this.getList()
    },
    deleteBrushTexture(item) {
      this.pcount = item.pcount
      this.$refs.myModal && this.$refs.myModal.show(item)
    },
    handleOk(finish, obj) {
      deleteBrushTexture({ id: obj.id })
        .then((data) => {
          this.getList()
          finish && finish('success')
        })
        .catch((error) => {
          console.log(error)
          finish && finish('error', error.message)
        })
    },
    formatDate(date) {
      return Moment(date).format('YYYY-MM-DD HH:mm')
    },
    getList() {
      this.listLoading = true
      listBrushTexture(this.listQuery).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.center-right {
  justify-content: flex-end;
  align-items: center;
  position: relative;
  top: 3px;
}
.col-md-6 {
  margin: 0px;
  padding: 0px;
}
</style>
