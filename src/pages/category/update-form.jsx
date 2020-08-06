import React, { Component } from 'react'
import { Form, Input } from 'antd'

const Item = Form.Item

// 添加分类的form组件
class UpdateForm extends Component {
  setCategoryName = (e) => {
    e.persist()

    this.setState({ setCategoryName: e.target.value })
  }
  render() {
    const categoryName = this.props.categoryName

    return (
      <Form
        key={categoryName}
        ref="editForm"
        initialValues={{ categoryName: categoryName }}
      >
        <Item
          name="categoryName"
          rules={[{ required: true, message: '请输入分类名称!' }]}
        >
          <Input
            onChange={(e) => this.setCategoryName(e)}
            placeholder="请输入分类名称"
          ></Input>
        </Item>
      </Form>
    )
  }
}

export default UpdateForm
