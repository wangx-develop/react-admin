import React, { Component } from 'react'
import { Form, Input } from 'antd'
// import PropTypes from 'prop-types'

const Item = Form.Item

// 添加分类的form组件
class AddForm extends Component {
  state = {
    roleName: '',
  }
  constructor(props) {
    super(props)
    this.form = React.createRef()
  }

  setInput = (e) => {
    e.persist()
    this.setState({ roleName: e.target.value })
  }

  render() {
    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 }, //左侧label的宽度
      wrapperCol: { span: 15 }, //指定右侧包裹的宽度
    }

    return (
      <Form {...formItemLayout} ref={this.form}>
        <Item
          name="roleName"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称!' }]}
        >
          <Input
            onChange={(e) => {
              this.setInput(e)
            }}
            placeholder="请输入角色名称"
          ></Input>
        </Item>
      </Form>
    )
  }
}

export default AddForm
