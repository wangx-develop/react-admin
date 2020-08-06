import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import LinkButtom from '../../components/linkButtom'
import {
  reqProducts,
  reqSearchProducts,
  reqUpdateStatus,
} from '../../api/index'
import { PAGE_SIZE } from '../../utils/constants'

/**
 * product的默认子路由组件
 */
const { Option } = Select
class ProductHome extends Component {
  state = {
    products: [], //商品的数组
    total: 0, //商品的总数量
    loading: false,
    searchName: '', //搜索的关键字
    searchType: 'productName', //搜索的方式 根据商品名称搜索 根据商品描述搜索
  }

  // 初始化列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price,
      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          const { status, _id } = product
          return (
            <span>
              <Button
                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
                type="primary"
              >
                {status === 1 ? '下架' : '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </span>
          )
        },
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              {/* 将product对象使用state传寄给目标路由组件 */}
              <LinkButtom
                onClick={() => {
                  this.props.history.push('/product/detail', { product })
                }}
              >
                详情
              </LinkButtom>
              <LinkButtom
                onClick={() => {
                  this.props.history.push('product/addupdate', { product })
                }}
              >
                修改
              </LinkButtom>
            </span>
          )
        },
      },
    ]
  }

  /**
   * 获取指定页码的列表显示
   */
  getProducts = async (pageNum) => {
    this.pageNum = pageNum //保存当前的pageNum
    this.setState({ loading: true })

    const { searchName, searchType } = this.state

    let result
    if (searchName) {
      result = await reqSearchProducts({
        pageNum,
        pageSize: PAGE_SIZE,
        searchName,
        searchType,
      })
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({ loading: false })
    if (result.status === 0) {
      const { list, total } = result.data
      this.setState({ products: list, total })
    }
  }

  updateStatus = async (_id, status) => {
    const result = await reqUpdateStatus(_id, status)
    if (result.status === 0) {
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getProducts(1)
  }

  render() {
    const { products, total, loading, searchType } = this.state

    const title = (
      <span>
        <Select
          defaultValue={searchType}
          style={{ width: 150 }}
          onChange={(value) => {
            this.setState({ searchType: value })
          }}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{ width: 150, margin: '0 15px' }}
          onChange={(e) => {
            this.setState({ searchName: e.target.value })
          }}
        ></Input>
        <button type="primary" onClick={() => this.getProducts(1)}>
          搜索
        </button>
      </span>
    )

    const extra = (
      <Button
        type="primary"
        onClick={() => this.props.history.push('/product/addupdate')}
      >
        <PlusOutlined />
        添加商品
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          loading={loading}
          bordered
          rowKey="_id"
          dataSource={products}
          columns={this.columns}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total: total,
            onChange: (pageNum) => {
              this.getProducts(pageNum)
            },
          }}
        />
      </Card>
    )
  }
}

export default ProductHome
