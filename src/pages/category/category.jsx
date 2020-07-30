import React, { Component } from 'react'
import { Card, Table, Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import LinkButtom from '../../components/linkButtom'
import {
  reqCategorys,
  reqAddCategorys,
  reqUpdateCategorys,
} from '../../api/index'

/**
 * 商品分类路由
 */
class Category extends Component {
  state = {
    loading: false, //是否正在获取中
    categorys: [], //一级分类列表
  }

  //初始化Table所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: () => {
          return (
            <span>
              <LinkButtom>修改分类</LinkButtom>
              <LinkButtom>查看子分类</LinkButtom>
            </span>
          )
        },
      },
    ]
  }

  //异步获取一级分类列表显示
  getCategorys = async () => {
    this.setState({ loading: true })
    const results = await reqCategorys('0')
    this.setState({ loading: false })
    console.log(results)
    if (results.status === 0) {
      const categorys = results.data
      this.setState({ categorys })
    } else {
      message.error('获取分类列表失败')
    }
  }

  //为第一次render准备数据
  componentWillMount() {
    this.initColumns()
  }

  // 执行异步任务
  componentDidMount() {
    //异步发送请求
    this.getCategorys()
  }

  render() {
    //读取数据
    const { categorys, loading } = this.state

    // card的左侧
    const title = '一级分类列表'

    // card的右侧
    const extra = (
      <Button type="primary">
        <PlusOutlined />
        添加
      </Button>
    )

    return (
      <div>
        <Card title={title} extra={extra}>
          <Table
            loading={loading}
            bordered
            rowKey="_id"
            dataSource={categorys}
            columns={this.columns}
            pagination={{ defaultPageSize: 5, showQuickJumper: true }}
          />
          ;
        </Card>
      </div>
    )
  }
}

export default Category
