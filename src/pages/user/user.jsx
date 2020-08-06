import React, { Component } from 'react'
import { Card, Button, Table, Modal } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
/**
 * 用户路由
 */
class User extends Component {
  state = {
    users: [],
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
    ]
  }

  componentWillMount() {
    this.initColumns()
  }

  render() {
    const title = <Button type="primary">创建用户</Button>
    const users = this.state.users

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
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
      </Card>
    )
  }
}

export default User
