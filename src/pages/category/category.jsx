import React, { Component } from 'react'
import { Card, Table, Button, message, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import LinkButtom from '../../components/linkButtom'
import {
  reqCategorys,
  reqAddCategorys,
  reqUpdateCategorys,
} from '../../api/index'
import AddForm from './add-form'
import UpdateForm from './update-form'

/**
 * 商品分类路由
 */
class Category extends Component {
  state = {
    loading: false, //是否正在获取中
    categorys: [], //一级分类列表
    subCategorys: [], //二级分类列表
    parentId: '0', //当前需要显示分类列表的parentId
    parentName: '', //当前需要显示分类列表的名称
    showStatus: 0, //0：都不显示 1：显示添加 2：显示更新
    category: {},
    // addCategoryId: '',
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
        render: (categorys) => {
          return (
            <span>
              <LinkButtom onClick={() => this.showUpdate(categorys)}>
                修改分类
              </LinkButtom>
              {/* 如何向事件函数传递参数：先定义一个匿名函数，
                在函数中调用处理的函数，并传入数据
              */}
              {this.state.parentId === '0' ? (
                <LinkButtom onClick={() => this.showSubCategorys(categorys)}>
                  查看子分类
                </LinkButtom>
              ) : null}
            </span>
          )
        },
      },
    ]
  }

  //异步获取一级或者二级分类列表显示
  // parentId：如果没指定，根据state中的parentId指定查询，如果传值，则按传的值查询
  getCategorys = async (in_parentId) => {
    this.setState({ loading: true })

    const parentId = in_parentId || this.state.parentId

    const results = await reqCategorys(parentId)
    this.setState({ loading: false })

    if (results.status === 0) {
      if (parentId === '0') {
        const categorys = results.data
        this.setState({ categorys })
      } else {
        const subCategorys = results.data
        this.setState({ subCategorys })
      }
    } else {
      message.error('获取分类列表失败')
    }
  }
  //获取指定一级分类的二级分类列表
  showSubCategorys = (categorys) => {
    //更新状态
    this.setState(
      {
        parentId: categorys._id,
        parentName: categorys.name,
      },
      () => {
        //在状态更新后重新render()后执行
        //由于state.parentId修改为了一级分类id，
        // 所以此时获取的是二级分类列表
        this.getCategorys()
      }
    )
  }

  // 响应点击取消：隐藏确定框
  handleCancel = () => {
    this.setState({
      showStatus: '0',
    })
  }

  //显示添加的modal框
  showAdd = () => {
    this.setState({ showStatus: 1 })
  }

  //添加分类
  addCategory = () => {
    this.refs.addForm.refs.addForm
      .validateFields()
      .then(async (value) => {
        console.log(value)

        this.setState({
          showStatus: '0',
        })

        /*
        //this.refs.addForm.refs.addForm.getFieldsValue()可以获取到子组件中的form中的值
        //value的值和this.refs.addForm.refs.addForm.getFieldsValue()的值一样
        const {
          categoryId,
          categoryName,
        } = this.refs.addForm.refs.addForm.getFieldsValue()
        */

        const { categoryId, categoryName } = value

        const result = await reqAddCategorys({
          parentId: categoryId,
          categoryName: categoryName,
        })

        if (result.status === 0) {
          if (categoryId === this.state.parentId) {
            this.getCategorys()
          } else if (categoryId === '0') {
            // 在二级分类列表下添加一级分类项，重新获取一级分类列表，但不需要显示一级分类列表
            this.getCategorys('0')
          }
        }
      })
      .catch((err) => {
        message.error(err.errorFields[0].errors[0])
      })
  }

  //显示修改的modal框
  showUpdate = (category) => {
    //保存分类对象

    this.setState({ category })

    this.setState({ showStatus: 2 })
  }

  //更新分类
  updateCategory = () => {
    this.refs.UpdateForm.refs.editForm
      .validateFields()
      .then(async (value) => {
        console.log(value)
        //隐藏确定框
        this.setState({
          showStatus: '0',
        })

        console.log(value.categoryName)

        const categoryId = this.state.category._id
        const { categoryName } = value

        //发请求更新分类
        const result = await reqUpdateCategorys({ categoryId, categoryName })
        if (result.status === 0) {
          //重新显示分类列表
          this.getCategorys()
        }
      })
      .catch((err) => {
        message.error(err.errorFields[0].errors[0])
      })
  }

  //获取一级分类列表
  showFirstCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: [],
    })
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
    const {
      categorys,
      loading,
      subCategorys,
      parentId,
      parentName,
      showStatus,
      category,
      // addCategoryId,
    } = this.state

    // card的左侧
    const title =
      parentId === '0' ? (
        '一级分类列表'
      ) : (
        <span>
          <LinkButtom onClick={this.showFirstCategorys}>
            一级分类列表
          </LinkButtom>
          <ArrowRightOutlined style={{ marginRight: 10 }} />
          <span>{parentName}</span>
        </span>
      )

    // card的右侧
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
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
            dataSource={parentId === '0' ? categorys : subCategorys}
            columns={this.columns}
            pagination={{ defaultPageSize: 5, showQuickJumper: true }}
          />
          <Modal
            title="添加分类"
            visible={showStatus === 1 ? true : false}
            onOk={this.addCategory}
            onCancel={this.handleCancel}
          >
            <AddForm
              ref="addForm"
              categorys={categorys}
              parentId={parentId}
              // addCategoryId={addCategoryId}
            />
          </Modal>
          <Modal
            title="更新分类"
            visible={showStatus === 2 ? true : false}
            onOk={this.updateCategory}
            onCancel={this.handleCancel}
          >
            <UpdateForm
              ref="UpdateForm"
              categoryName={category.name}
              categoryId={category._id}
            ></UpdateForm>
          </Modal>
        </Card>
      </div>
    )
  }
}

export default Category
