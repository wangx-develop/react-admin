import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option

// 添加分类的form组件
class addForm extends Component {
  setSelect = (value) => {
    console.log(value)
    this.setState({ formParentId: value })
  }
  setInput = (e) => {
    e.persist()
    this.setState({ formCategoryName: e.target.value })
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     formParentId: nextProps.parentId,
  //     formCategoryName: '',
  //   })
  // }

  render() {
    const { categorys, parentId } = this.props

    return (
      <Form
        key={parentId}
        ref="addForm"
        initialValues={{ categoryId: parentId, categoryName: '' }}
      >
        <Item name="categoryId">
          <Select
            onChange={(e) => {
              this.setSelect(e)
            }}
            style={{ width: '100%' }}
          >
            <Option value="0">一级分类</Option>
            {categorys.map((c) => {
              return (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              )
            })}
          </Select>
        </Item>
        <Item
          name="categoryName"
          rules={[{ required: true, message: '请输入分类名称!' }]}
        >
          <Input
            onChange={(e) => {
              this.setInput(e)
            }}
            placeholder="请输入分类名称"
          ></Input>
        </Item>
      </Form>
    )
  }
}

export default addForm
