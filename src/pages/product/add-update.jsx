import React, { Component } from 'react'
import { message, Card, Form, Input, Cascader, Upload, Button } from 'antd'
import LinkButton from '../../components/linkButtom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import PictureWall from './pictures-wall'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api/index'
import RichTextEditor from './richtexteditor'

/**
 * product的添加和更新的子路由组件
 */

const { Item } = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {
  state = {
    options: [],
  }
  constructor(props) {
    super(props)
    //创建保存ref标识的标签对象的容器
    this.pw = React.createRef()
    this.edit = React.createRef()
  }

  initOptions = async (categorys) => {
    // 根据category生成options数组
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }))

    //如果是一个二级分类商品的更新
    const { isUpdate, product } = this
    const { pCategoryId } = product
    if (isUpdate && pCategoryId !== '0') {
      //获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      //生成二级下拉列表的options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      const targetOption = options.find((c) => c.value === pCategoryId)

      targetOption.children = childOptions
    }

    this.setState({ options })
  }

  /**
   * 获取一级/二级分类列表并显示
   */
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.initOptions(categorys)
      } else {
        //二级列表
        return categorys
      }
    }
  }

  //自定义验证
  validatePrice = (rule, value) => {
    if (value * 1 > 0) {
      return Promise.resolve()
    } else {
      return Promise.reject('价格必须大于0')
    }
  }

  submit = async () => {
    try {
      const values = await this.refs.form.validateFields()

      //搜集数据，并封装成product对象
      const { name, desc, price, categoryIds } = values
      let pCategoryId, categoryId
      if (categoryIds.length === 1) {
        pCategoryId = '0'
        categoryId = categoryIds[0]
      } else {
        pCategoryId = categoryIds[0]
        categoryId = categoryIds[1]
      }
      const imgs = this.pw.current.getImgs()
      const detail = this.edit.current.getDetail()

      const product = {
        name,
        desc,
        price,
        imgs,
        detail,
        pCategoryId,
        categoryId,
      }

      //如果是更新，需要添加_id
      if (this.isUpdate) {
        product._id = this.product._id
      }
      console.log(product)

      //调用接口请求函数添加/更新
      const result = await reqAddOrUpdateProduct(product)

      //根据结果提示
      if (result.status === 0) {
        message.success(`${this.isUpdate ? '更新' : '保存'}商品成功！`)
        this.props.history.goBack()
      } else {
        message.error(`${this.isUpdate ? '更新' : '保存'}商品失败！`)
      }
    } catch (errorInfo) {
      message.error(errorInfo.errorFields[0].errors[0])
    }
  }

  loadData = async (selectedOptions) => {
    //得到选择的option对象
    const targetOption = selectedOptions[0]
    //显示loading
    targetOption.loading = true

    //根据选中的分类，请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false
    if (subCategorys && subCategorys.length > 0) {
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      targetOption.children = childOptions
    } else {
      //当前分类没有二级分类
      targetOption.isLeaf = true
    }

    // 更新option状态
    this.setState({
      options: [...this.state.options],
    })
  }

  componentDidMount() {
    this.getCategorys('0')
  }

  componentWillMount() {
    //取出携带的state
    const product = this.props.location.state
    //保存是否是更新的标识
    this.isUpdate = !!product
    //保存商品（如果没有，保存的是{}空对象）
    this.product = product ? product.product : {}
  }

  render() {
    const { isUpdate, product } = this

    const { pCategoryId, categoryId, imgs, detail } = product
    const categoryIds = [] //用来接收级联分类ID的数组
    if (isUpdate) {
      if (pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 2 }, //左侧label的宽度
      wrapperCol: { span: 8 }, //指定右侧包裹的宽度
    }

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <ArrowLeftOutlined style={{ fontSize: 20 }}></ArrowLeftOutlined>
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )

    return (
      <div>
        <Card title={title}>
          <Form
            {...formItemLayout}
            ref="form"
            initialValues={{
              name: product.name,
              desc: product.desc,
              price: product.price,
              categoryIds: categoryIds,
            }}
          >
            <Item
              label="商品名称"
              name="name"
              rules={[{ required: true, message: '请输入商品名称!' }]}
            >
              <Input placeholder="请输入商品名称"></Input>
            </Item>
            <Item
              label="商品描述"
              name="desc"
              rules={[{ required: true, message: '请输入商品描述!' }]}
            >
              <TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                placeholder="请输入商品描述"
              ></TextArea>
            </Item>
            <Item
              label="商品价格"
              name="price"
              rules={[
                { required: true, message: '请输入商品价格!' },
                { validator: this.validatePrice },
              ]}
            >
              <Input
                type="number"
                addonAfter="元"
                placeholder="请输入商品价格"
              ></Input>
            </Item>
            <Item label="商品分类" name="categoryIds">
              <Cascader
                options={this.state.options} /*需要显示的列表数据数组 */
                loadData={
                  this.loadData
                } /**当选择某个列表项，加载下一级列表的监听回调 */
              />
            </Item>
            <Item label="商品图片">
              <PictureWall ref={this.pw} imgs={imgs}></PictureWall>
            </Item>
            <Item
              label="商品详情"
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 20 }}
            >
              <RichTextEditor ref={this.edit} detail={detail}></RichTextEditor>
            </Item>
            <Item>
              <Button type="primary" onClick={this.submit}>
                提交
              </Button>
            </Item>
          </Form>
        </Card>
      </div>
    )
  }
}

export default ProductAddUpdate

/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
使用ref
1. 创建ref容器: thi.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
3. 通过ref容器读取标签元素: this.pw.current
 */
