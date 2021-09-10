<template>
  <div class="app-container voyager">
    <div class="container-fluid">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="14">
          <el-row type="flex" align="middle">
            <el-col type="flex" :span="18">
              <h1 class="page-title"><i class="el-icon-picture" /> 资讯列表</h1>
              <router-link
                to="/article/add"
                class="btn btn-success btn-add-new"
              >
                <i class="voyager-plus" /> <span>增加</span>
              </router-link>
              <!-- <a v-if="permissions.create" @click.prevent.stop="edit(0)" class="btn btn-success btn-add-new">
                <i class="voyager-plus" /> <span>{{ $t('table.add') }}</span>
              </a> --> </el-col>
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

                      <th>标题</th>

                      <th>缩略图</th>

                      <th>排序</th>
                      <th>是否推荐</th>
                      <th>是否置顶</th>
                      <th>状态</th>
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
                      <td>
                        {{ item.title }}<br/>
                        {{ item.subTitle }}
                      </td>

                      <td>
                        <a
                          :href="item.coverPic"
                          target="_blank"
                        ><img
                          :src="item.coverPic"
                          width="80"
                        ></a>
                      </td>

                      <td>
                        {{ item.sort }}
                      </td>
                      <td>
                        {{ item.recommend!=0?'推荐':'未推荐' }}
                      </td>
                      <td>
                        {{ item.top!=0?'置顶':'未置顶' }}
                      </td>

                      <td>
                        <span v-if="item.status===0">正常</span>
                        <span v-else-if="item.status===1">待发布</span>
                        <span v-else-if="item.status===100">已删除</span>
                      </td>
                      <td>
                        {{ item.createTime }}
                      </td>

                      <!-- <td>
                        {{ formatDate(item.createdAt) }}
                      </td> -->

                      <td class="no-sort no-click bread-actions">
                        <!-- <a class="btn btn-sm btn-info" @click="statistics_pop(item.id)">修改排序</a> -->
                        <a
                          :title="'删除'"
                          class="btn btn-sm btn-danger pull-right delete"
                          @click.prevent.stop="delete_article(item)"
                        >
                          <i class="voyager-trash" />
                          <span class="hidden-xs hidden-sm">
                            删除
                          </span>
                        </a>
                        <a
                          :title="item.top==1?'取消置顶':'置顶'"
                          class="btn btn-sm btn-info pull-right delete"
                          @click.prevent.stop="click_top(item)"
                        >
                          <i class="el-icon-top" />
                          <span v-if="item.top==1">取消置顶</span>
                          <span v-if="item.top==0">置顶</span>
                        </a>
                        <a
                          :title="item.recommend==1?'取消推荐':'推荐'"
                          class="btn btn-sm btn-success pull-right delete"
                          @click.prevent.stop="click_recommend(item)"
                        >
                          <i class="el-icon-star-on" />
                          <span v-if="item.recommend==1">取消推荐</span>
                          <span v-if="item.recommend==0">推荐</span>
                        </a>

                        <router-link
                          :to="'/article/edit?id=' + item.id"
                          class="btn btn-sm btn-primary pull-right edit"
                        >
                          <i class="el-icon-edit" />
                          <span class="hidden-xs hidden-sm">修改</span>
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <pagination
                  v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.currentPage"
                  :limit.sync="listQuery.pageSize"
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
    <my-modal
      id="modal-sm1"
      ref="myModal1"
      :title="'确认操作吗'"
      @ok="handleOkTop"
    >
      确认操作吗？
    </my-modal>
    <my-modal
      id="modal-sm2"
      ref="myModal2"
      :title="'确认操作吗'"
      @ok="handleOkRecommend"
    >
      确认操作吗？
    </my-modal>
  </div>
</template>

<script>
import { articleTop, articleRecommend, articleList, articleDelete } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Moment from 'moment';
// import draggable from 'vuedraggable';

export default {
  name: 'ArticleList',
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
        currentPage: 1,
        keywords: '',
        pageSize: 20
      },
      topParams: {
        id: 0,
        status: 0
      },
      recommendParams: {
        id: 0,
        status: 0
      },
      permissions: (this.$route.meta && this.$route.meta.permissions) || {}
    }
  },
  created() {
    this.getList();
  },
  methods: {
    click_top(item) {
      this.$refs.myModal1 && this.$refs.myModal1.show(item)
      if (item.top === 1) {
        this.topParams.status = 0
      } else {
        this.topParams.status = 1
      }
    },
    click_recommend(item) {
      this.$refs.myModal2 && this.$refs.myModal2.show(item)
      if (item.recommend === 1) {
        this.recommendParams.status = 0
      } else {
        this.recommendParams.status = 1
      }
    },
    handleOkRecommend(finish, obj) {
      this.recommendParams.id = obj.id
      articleRecommend(this.recommendParams).then(response => {
        const info = response.data
        this.sort_info.id = info.id
        this.sort_info.sort = info.sort
        this.$bvModal.show('modal-sm2')
        finish && finish('success')
        this.getList()
      }).catch(error => {
        console.log(error);
        alert(error.msg)
      })
    },
    handleOkTop(finish, obj) {
      this.topParams.id = obj.id
      articleTop(this.topParams).then(response => {
        const info = response.data
        this.sort_info.id = info.id
        this.sort_info.sort = info.sort
        this.$bvModal.show('modal-sm1')
        finish && finish('success')
        this.getList()
      }).catch(error => {
        alert(error)
      })
    },
    onFilterChange() {
      console.log(this.listQuery)
      this.listQuery.page = 1
      this.getList()
    },
    delete_article(item) {
      this.pcount = item.pcount
      this.$refs.myModal && this.$refs.myModal.show(item)
    },
    handleOk(finish, obj) {
      articleDelete({ id: obj.id })
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
      articleList(this.listQuery).then((response) => {
        this.list = response.data.records
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
