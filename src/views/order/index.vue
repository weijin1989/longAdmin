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
              v-model="time"
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
                <table id="dataTable" class="table">
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

                  <tbody v-for="item in list" :key="'item' + item.id" style="border:0;">
                    <tr>
                      <td>
                        <a @click="openGoodsList(item.id)" title="展开已购买商品" style="color:#005ae2">{{ item.orderId }}</a>
                      </td>
                      <td>
                        {{ item.uid }}
                      </td>
                      <td>
                        {{ item.consigneeName }}
                      </td>

                      <td>{{ item.expressNum }} </td>

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
                        <a
                          @click="edit(item)"
                          class="btn btn-sm btn-primary pull-right edit"
                        >
                          <i class="el-icon-edit" />
                          <span class="hidden-xs hidden-sm">修改</span>
                        </a>
                      </td>
                    </tr>
                    <tr class="goods_list" :id="'goods_'+item.id" style="display:none">
                      <td colspan="10" style="padding:0">
                        <table id="dataTable1" class="table ">
                          <thead>
                            <tr>
                              <th>商品id</th>
                              <th>商品名称</th>
                              <th>商品图片</th>
                              <th>所需积分</th>
                              <th>数量</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item1 in item.orderGoodList"  :key="'item1_' + item1.id" style="border:0">
                              <td>{{ item1.goodId }}</td>
                              <td>{{ item1.goodsName }}</td>
                              <td>
                                <a
                                  :href="item1.mainImg"
                                  target="_blank"
                                ><img
                                  :src="item1.mainImg"
                                  width="80"
                                ></a>
                              </td>
                              <td>{{ item1.point }}</td>
                              <td>{{ item1.quantity }}</td>
                            </tr>
                          </tbody>
                        </table>
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
      id="modal-sm2"
      @ok="update_order"
      :title="title"
      modal-append-to-body="false"
    >
        <div class="form-group">
          <label for="current_mood">物流公司</label>
          <input v-model="info.expressCompany" class="form-control" />
        </div>
        <div class="form-group">
          <label for="content">快递单号</label>
          <input v-model="info.expressNum" class="form-control" />
        </div>
        <div class="form-group">
          <label for="content">状态</label><br/>
          <el-radio-group v-model="info.status">
              <el-radio :label="0">
                  未处理
              </el-radio>
              <el-radio :label="1">
                  已发货
              </el-radio>
          </el-radio-group>
        </div>
    </my-modal>
  </div>
</template>

<script>
import { orderList, getOrderInfo, updateOrder } from '@/api/order'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Moment from 'moment';
import $ from 'jquery'
// import draggable from 'vuedraggable';

export default {
  name: 'OrderList',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      title: '',
      time: [],
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
      info: {
        expressCompany: '',
        expressNum: '',
        orderId: '',
        status: ''
      },
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
    this.getList()
  },
  methods: {
    edit(item) {
      this.title = '编辑订单【' + item.orderId + '】'
      this.info.orderId = item.orderId
      this.getInfo()
      this.$bvModal.show('modal-sm2')
    },
    getInfo() {
      getOrderInfo({ orderId: this.info.orderId })
        .then((response) => {
          const data = response.data
          this.info.orderId = data.orderId
          this.info.expressCompany = data.expressCompany
          this.info.expressNum = data.expressNum
          this.info.status = data.status
        })
        .catch(() => {})
    },
    update_order(finish) {
      updateOrder(this.info)
        .then((data) => {
          finish && finish('success')
          this.getList()
        })
        .catch((error) => {
          console.log(error)
          finish && finish('error', error.message)
        })
    },
    openGoodsList(id) {
      const node = $('#goods_' + id)
      if (node.is(':hidden')) {
        node.show()
      } else {
        node.hide()
      }
      // $('.goods_list').hide()
    },
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
