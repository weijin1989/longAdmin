<template>
  <div class="app-container voyager">
    <div class="container-fluid">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="14">
          <el-row type="flex" align="middle">
            <el-col type="flex" :span="18">
              <h1 class="page-title"><i class="el-icon-s-order" /> 订单列表</h1></el-col>
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
          <el-select
            v-model="listQuery.status"
            placeholder="订单状态"
            style="margin-right:20px"
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
                      <th>订单id</th>
                      <th>用户ID</th>
                      <th>收货人</th>
                      <th>快递单号</th>
                      <th>物流公司</th>
                      <th>手机号</th>
                      <th>总花费积分</th>
                      <th>状态</th>
                      <th>兑换时间</th>

                      <th class="actions text-right">
                        操作
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="item in list" :key="'item' + item.id">
                      <td>
                        {{ item.orderId }}
                      </td>
                      <td>
                        {{ item.uid }}
                      </td>
                      <td>
                        {{ item.consigneeName }}
                      </td>

                      <td>{{item.expressNum}} </td>

                      <td>
                        {{ item.expressCompany }}
                      </td>
                      <td>
                        {{ item.mobile }}
                      </td>
                      <td>
                        {{ item.totalPoint }}
                      </td>
                      <td>
                        {{ item.createTime }}
                      </td>

                      <td>
                        {{ item.status==1?'已发货':'未处理' }}
                      </td>

                      <td class="no-sort no-click bread-actions">
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
  </div>
</template>

<script>
import { orderList } from '@/api/order'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Moment from 'moment';
// import draggable from 'vuedraggable';

export default {
  name: 'OrderList',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      filterOptions: [
        { label: '订单状态', value: '' },
        { label: '未处理', value: 0 },
        { label: '已发货', value: 1 }
      ],
      listQuery: {
        currentPage: 1,
        mobile: '',
        startTime: '',
        endTime: '',
        status: '',
        pageSize: 20
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
    onFilterChange() {
      console.log(this.listQuery)
      this.listQuery.page = 1
      this.getList()
    },
    formatDate(date) {
      return Moment(date).format('YYYY-MM-DD HH:mm')
    },
    startQuery() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      orderList(this.listQuery).then((response) => {
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
