<template>
  <div class="app-container voyager">
    <div class="container-fluid">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="14">
          <el-row type="flex" align="middle">
            <el-col type="flex" :span="18">
              <h1 class="page-title"><i class="el-icon-user" /> 用户列表</h1>
            </el-col>
          </el-row>
        </el-col>
        <el-col type="flex" :span="6" align="middle">
            <el-date-picker
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :picker-options="pickerOptions0"
              type="daterange"
              placeholder="选择时间范围"
              @change="onTimeChange"
            >
              >
            </el-date-picker>
        </el-col>
        <el-col type="flex" :span="6" align="middle">
          <el-input
            v-model="listQuery.nickname"
            placeholder="请输入昵称搜索"
          >
          </el-input>
        </el-col>
        <el-col type="flex" :span="6" align="middle">
            <el-input
              v-model="listQuery.mobile"
              placeholder="请输入手机号搜索"
            >
            <template slot="append">
              <div
                class="header-search-btn" @click="startQuery"
              >
                搜索
              </div>
            </template>
            </el-input>
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

                      <th>头像</th>
                      <th>昵称</th>
                      <th>用户名</th>
                      <th>用户姓名</th>
                      <th>用户性别</th>
                      <th>用户等级</th>
                      <th>手机</th>
                      <th>已使用积分/总积分</th>
                      <th>注册时间</th>
                      <th>认证时间</th>
                      <th class="actions text-right">
                        操作
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="item in list" :key="'item' + item.id">
                      <td>
                        {{ item.uid }}
                      </td>
                      <td>
                        <a
                          :href="item.avatar"
                          target="_blank"
                        ><img
                          :src="item.avatar"
                          width="80"
                        ></a>
                      </td>
                      <td>
                        {{ item.nickname }}
                      </td>
                      <td>
                        {{ item.username }}
                      </td>
                      <td>
                        {{ item.profile.realname }}
                      </td>
                      <td>
                        {{ item.profile.mobile }}
                      </td>
                      <td>
                        {{ item.usedPoint }}/{{ item.totalPoint }}
                      </td>
                      <td>
                        {{ item.regTime }}
                      </td>
                      <td>
                        {{ item.certifiedTime }}
                      </td>

                      <td class="no-sort no-click bread-actions">
                        <a
                          :title="item.status==1?'取消禁用':'禁用'"
                          class="btn btn-sm btn-info pull-right delete"
                          @click.prevent.stop="click_status(item)"
                        >
                          <i class="el-icon-top" />
                          <span v-if="item.status==1">取消禁用</span>
                          <span v-if="item.status==0">禁用</span>
                        </a>

                        <router-link
                          :to="'/user/edit?id=' + item.uid"
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
      id="modal-sm1"
      ref="myModal1"
      :title="'确认操作吗'"
      @ok="handleOkDisable"
    >
      确认操作吗？
    </my-modal>
  </div>
</template>

<script>
import { userList, disableAccount } from '@/api/users'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Moment from 'moment';
// import draggable from 'vuedraggable';

export default {
  name: 'UserList',
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      listQuery: {
        currentPage: 1,
        nickname: '',
        mobile: '',
        startTime: '',
        endTime: '',
        pageSize: 20
      },
      disableParams: {
        uid: 0,
        status: 0
      },
      permissions: (this.$route.meta && this.$route.meta.permissions) || {}
    }
  },
  created() {
    this.getList();
  },
  methods: {
    onTimeChange(t) {
      this.listQuery.startTime = this.formatDate(t[0], 'YYYY-MM-DD')
      this.listQuery.endTime = this.formatDate(t[1], 'YYYY-MM-DD')
    },
    click_disable(item) {
      this.$refs.myModal1 && this.$refs.myModal1.show(item)
      if (item.status === 1) {
        this.topParams.status = 0
      } else {
        this.topParams.status = 1
      }
    },
    handleOkDisable(finish, obj) {
      this.topParams.id = obj.id
      disableAccount(this.topParams).then(response => {
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
    formatDate(date, type) {
      return Moment(date).format(type)
    },
    startQuery() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      userList(this.listQuery).then((response) => {
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
