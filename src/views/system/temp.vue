<template>
  <div class="app-container">
    <!-- 查询的筛选条件-->
      <div class="filter-container">
        <el-select v-model="queryData.zoneId" style="width: 240px" class="filter-item"
         placeholder="园区名字">
         <el-option v-for="z,index in zoneList" :label="z.zoneName" :value="z.zoneId"></el-option>
        </el-select>
      <el-input v-model="queryData.buildingName" placeholder="栋数名称" style="width: 400px;" 
      class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <!--表格-->
    <!--当前页面的表格数据--->
    <el-table
      :data="buildingList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="编号" prop="buildingId"  align="center" width="120" >
        <template slot-scope="{row}">
          <span>{{ row.buildingId }}</span>
        </template>
      </el-table-column>
        <el-table-column label="栋数名称" prop="buildingName"  align="center" width="220">
        <template slot-scope="{row}">
          <span>{{ row.buildingName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="园区名称" prop="zoneName"  align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.zoneName }}</span>
        </template>
      </el-table-column>
      <!--表格内部的按钮-->
      <el-table-column :label="$t('table.actions')" align="center" width="240" 
      class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger"
           @click="handleDelete(row)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页数据--->
    <pagination v-show="total>0" :total="total" :page.sync="queryData.page" 
      :limit.sync="queryData.limit" @pagination="getBuildingList" />
    <!--修改和添加的窗体-->
     <!---添加修改表单位置-->
     <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" 
      label-position="left" label-width="140px" style="width: 400px; margin-left:50px;">
        <el-form-item label="栋数名称" prop="buildingName" >
          <el-input v-model="temp.buildingName"  />
        </el-form-item>
        <el-form-item label="选择园区" prop="zoneId">
        <el-select v-model="temp.zoneId" style="width: 240px" class="filter-item">
         <el-option v-for="z,index in zoneList" :label="z.zoneName" :value="z.zoneId"></el-option>
        </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <!--判断创建还是修改-->
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//   导入 API  zone 接口 请求后端的接口
import { fetchZoneAllList} from '@/api/zone'
//导入   building API 
import { fetchList,deleteBuilding,createBuilding,updateBuilding} from '@/api/building'
//分页组件
import Pagination from '@/components/Pagination' 
export default {
  components: { Pagination },
  data(){
    return {
      //搜索的条件
      queryData:{
        zoneId:undefined,
        buildingName:undefined,
        page:1,
        limit:10
      },
      zoneList:[],//下拉框的数据
      buildingList:[],//表格数据
      total:0, //总条数
      dialogFormVisible: false,//隐藏
      dialogStatus: '',
      textMap: {// 弹出框的头部标题
        update: '修改栋数信息',
        create: '添加栋数信息'
      },
      temp:{//修改添加表单双绑定的数据
        buildingId:undefined,
        buildingName:'',
        zoneId:undefined
      },
      rules: {//表单的验证区域
        zoneId: [{ required: true, message: '园区必选', trigger: 'blur' }],
        buildingName: [{ required: true, message: '总栋名称必填',trigger: 'blur'}]
      },
    }
  },
  created(){   // vue 生命周期的 created 加载data后 渲染 视图前 执行的方法
    //渲染页面前  下拉框 还有表格
    this. getZoneList();    
    this.getBuildingList();
  },
  methods:{//所以函数所在位置
    resetTemp(){  // 每次添加前 先重载表单信息
      this.temp={
        buildingId:'',//不传入 buildingId没有这个属性   null  
        buildingName:'',
        zoneId:''
      }
    },
      getZoneList(){  //请求后端 加载所以园区信息
          fetchZoneAllList().then(response => {
          this.zoneList = response.data
           console.log(this.zoneList );
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      getBuildingList(){//加载表格信息(栋数)
        fetchList(this.queryData).then(response => {
          this.buildingList = response.data.list
          this.total= response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter(){//点击查询按钮  执行函数   查询分页查询
        this.getBuildingList();
      },
      handleCreate(){//点击添加按钮 执行的函数
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData(){//添加窗口打开后 点击确定的按钮 执行的函数
        createBuilding(this.temp).then(response => {
          if(response.code==0){
               //重新查询
               this.getBuildingList();
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
        })
      },
      handleUpdate(row){  // 点击表格里面的修改按钮  执行函数
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData(){ //点修改窗口 里面的确定的按钮
        updateBuilding(this.temp).then(response => {
          if(response.code==0){
               //重新查询
               this.getBuildingList();
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
        })
      },
      handleDelete(row){ //点击表格里面的删除按钮 执行的函数
        deleteBuilding(row.buildingId).then(response => {
          if(response.code==0){
               //重新查询
               this.getBuildingList();
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
      }
  }
}
</script>
