import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 这里定义非菜单栏的路由
const commonRoutes = [
  // 登录页面
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue')
  },
  //财务账套管理
  {
    path: '/FinanceAccountBooks',
    component: () => import('@/views/accountBooks/FinanceAccountBooks.vue')
  },
  {
    path:'/Store',
    component: () => import('@/views/store/Store.vue')
  }


]

/* 这里定义菜单栏的路由 */
export const menuRoutes = [
  // 首页
  {
    path: '/home',
    component: () => import('@/layout/Layout.vue'),
    meta: { title: '首页', menu: true, icon: 'el-icon-s-platform', role: ['财务', '管理员'] },
    children: [
      {
        // 等价于取父亲的path
        path: '',
        meta: { title: '首页', menu: true },
        component: () => import('@/views/home/Home.vue')
      }
    ]
  },

  //凭证管理
  {
    path: '/voucher',
    component: () => import('@/layout/Layout.vue'),
    meta: { title: '凭证管理', menu: true, icon: 'el-icon-postcard', role: ['财务', '管理员'] },
    children: [
      {
        // 等价于取父亲的path
        path: '/voucher/Voucher',
        component: () => import('@/views/voucher/Voucher'),
        meta: { title: '新增凭证' },
      },
      {
        // 等价于取父亲的path
        path: '/voucher/VoucherTotal',
        component: () => import('@/views/voucher/VoucherTotal'),
        meta: { title: '凭证管理' },
      },
      {
        // 等价于取父亲的path
        path: '/voucher/CheckVoucher',
        component: () => import('@/views/voucher/CheckVoucher'),
        meta: { title: '查看凭证' },
      },

      {
        path: '/voucher/VoucherWord',
        component: () => import('@/views/voucher/VoucherWord'),
        meta: { title: '凭证字' },
      },
      {
        path: '/voucher/Summary',
        component: () => import('@/views/voucher/Summary'),
        meta: { title: '常用摘要' },
      },
      {
        path: '/voucher/AccountingAccount',
        component: () => import('@/views/voucher/AccountingAccount'),
        meta: { title: '会计科目' }
      }

    ]
  },

   //系统管理
   {
    path:'/system',
    component: () => import('@/layout/Layout.vue'),
    meta: { title: '系统管理', menu: true, icon: 'el-icon-s-tools', role: ['管理员'] },
    children: [
      {
        path: '/System',
        component: () => import('@/views/system/System'),
        meta: { title: '员工管理' },
      },
      {
        path: '/Role',
        component: () => import('@/views/system/Role'),
        meta: { title: '角色管理' },
      },
      {
        path: '/Dish',
        component: () => import('@/views/dish/Dish'),
        meta: { title: '菜品大类管理' },
      }
    ]
  },
  // 个人中心
  {
    path: '/personal',
    component: () => import('@/layout/Layout.vue'),
    meta: { title: '个人中心', menu: true, icon: 'el-icon-user', role: ['财务', '管理员','服务员'] },
    children: [
      {
        // 等价于取父亲的path
        path: '',
        meta: { title: '个人中心', menu: true },
        component: () => import('@/views/personal/Personal.vue')
      }
    ]
  },
 /* 订单管理 */
  {
    path: '/order',
    component: () => import('@/layout/Layout.vue'),//页面布局已设置不要更改
    meta: { title: '订单', menu: true, icon: 'el-icon-bank-card', role: ['服务员','管理员'] },
    children: [
      {
        path: '/Order',
        meta: { title: '下单界面', menu: true },
        component: () => import('@/views/order/Order'),
      },
      {
        path: '/Order2',
        meta: { title: '订单管理', menu: true },
        component: () => import('@/views/order/Order2'),
      }
    ]
  },
  /* 工资管理 */
  //财务端工资管理
  {
    path: '/Salary',
    component: () => import('@/layout/Layout.vue'),//页面布局已设置不要更改
    meta: { title: '工资管理', menu: true, icon: 'el-icon-bank-card', role: ['财务', '管理员'] },
    children: [
      {
        path: '',
        meta: { title: '工资表', menu: true },
        component: () => import('@/views/salary/Salary.vue'),
      },

    ]
  },
  //员工工资管理
  {
    path: '/PersonalSalary',
    component: () => import('@/layout/Layout.vue'),
    meta: { title: '工资管理', menu: true, icon: 'el-icon-bank-card', role: ['员工'] },
    children: [
      {
        path: '',
        meta: { title: '工资表', menu: true },
        component: () => import('@/views/salary/PersonalSalary.vue'),
      },

    ]
  },

  /* 报销管理 */
  //财务报销管理
  {
    path: '/financeReimbursement',
    component: () => import('@/layout/Layout.vue'),
    meta: { title: '报销管理', menu: true, icon: 'el-icon-coin', role: ['财务', '管理员'] },
    children: [
      {
        path: '',
        meta: { title: '报销管理', menu: true },
        component: () => import('@/views/reimbursement/FinanceReimbursement.vue'),
      },
    ]
  },
  //员工报销请求
  {
    path: '/personalReimbursement',
    component: () => import('@/layout/Layout.vue'),
    meta: { title: '用户报销', menu: true, icon: 'el-icon-bank-card', role: ['员工'] },
    children: [
      {
        path: '',
        meta: { title: '用户报销' },
        component: () => import('@/views/reimbursement/PersonalReimbursement.vue'),
      },

    ]
  },
  //老板报销审核
  {
    path: '/bossReimbursement',
    component: () => import('@/layout/Layout.vue'),
    meta: { title: '报销审核', menu: true, icon: 'el-icon-bank-card', role: ['管理员'] },
    children: [
      {
        path: '',
        meta: { title: '报销审核' },
        component: () => import('@/views/reimbursement/BossReimbursement.vue'),
      },
    ]
  },

  // /* 固定资产折旧管理 */
  // //财务固定资产管理
  // {
  //   path: '/FinanceDepreciation',
  //   component: () => import('@/layout/Layout.vue'),
  //   meta: { title: '固定资产折旧管理', menu: true, icon: 'el-icon-office-building', role: ['财务', '管理员'] },
  //   children: [
  //     {
  //       path: '',
  //       meta: { title: '固定资产折旧明细' },
  //       component: () => import('@/views/fixedasset/FinanceDepreciation.vue'),
  //     }
  //   ]
  // },
  // //用户固定折旧申请
  // {
  //   path: '/personalDepreciation',
  //   component: () => import('@/layout/Layout.vue'),
  //   meta: { title: '资产折旧申请', menu: true, icon: 'el-icon-office-building', role: ['员工'] },
  //   children: [
  //     {
  //       path: '',
  //       meta: { title: '申请固定资产折旧' },
  //       component: () => import('@/views/fixedasset/PersonalDepreciation.vue'),
  //     }
  //   ]
  // },
  // //老板端固定资产折旧审批
  // {
  //   path: '/BossFixedasset',
  //   component: () => import('@/layout/Layout.vue'),
  //   meta: { title: '固定资产折旧审核', menu: true, icon: 'el-icon-office-building', role: ['管理员'] },
  //   children: [
  //     {
  //       path: '',
  //       meta: { title: '审核资产折旧申请' },
  //       component: () => import('@/views/fixedasset/BossDepreciation.vue'),
  //     }
  //   ]
  // },

  // //期末结转
  // {
  //   path: '/carryover',
  //   component: () => import('@/layout/Layout.vue'),
  //   meta: { title: '期末结转', menu: true, icon: 'el-icon-s-marketing', role: ['财务', '管理员'] },
  //   children: [
  //     {
  //       path: '',
  //       meta: { title: '期末结转' },
  //       component: () => import('@/views/carryover/CarryOver'),
  //     },
  //   ]
  // },

   {
    path:'/dishSales',
    component:() => import('@/layout/Layout.vue'),
    meta:{ title: '菜品销量统计',menu: true,icon: 'el-icon-s-marketing', role: ['财务','管理员']},
    children: [
      {
        path:'',
        meta: { title: '菜品销量统计' },
        component: () => import('@/views/dishSales/dishSales.vue'),
      },
    ]
  },

  //员工中心
  // {
  //   path: '/personalCenter',
  //   component: () => import('@/layout/Layout.vue'),
  //   meta: { title: '个人中心', menu: true, icon: 'el-icon-s-tools', role: ['员工'] },
  //   children: [
  //     {
  //       path: '',
  //       meta: { title: '个人中心' },
  //       component: () => import('@/views/system/PersonalCenter.vue'),
  //     },

  //   ]
  // },
]

const router = new VueRouter({
  routes: [
    ...commonRoutes,
    ...menuRoutes,
    {
      path: '/*',
      component: () => import('@/views/error/error.vue')
    }
  ]
})

export default router
