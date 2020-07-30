import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
} from '@ant-design/icons'

const menuList = [
  {
    title: '首页', // 菜单标题名称
    key: '/home', // 对应的 path
    icon: PieChartOutlined, // 图标名称
  },
  {
    title: '商品',
    key: '/products',
    icon: MailOutlined,
    children: [
      // 子菜单列表
      {
        title: '品类管理',
        key: '/category',
        icon: AppstoreOutlined,
      },
      {
        title: '商品管理',
        key: '/product',
        icon: MenuUnfoldOutlined,
      },
    ],
  },
  {
    title: '用户管理',
    key: '/user',
    icon: PieChartOutlined,
  },
  {
    title: '角色管理',
    key: '/role',
    icon: PieChartOutlined,
  },
  {
    title: '图形图表',
    key: '/charts',
    icon: PieChartOutlined,
    children: [
      {
        title: '柱形图',
        key: '/charts/bar',
        icon: PieChartOutlined,
      },
      {
        title: '折线图',
        key: '/charts/line',
        icon: PieChartOutlined,
      },
      {
        title: '饼图',
        key: '/charts/pie',
        icon: PieChartOutlined,
      },
    ],
  },
]
export default menuList
