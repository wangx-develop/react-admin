import React, { Component } from 'react'
import { Card, List } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButtom from '../../components/linkButtom'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqGetCategoryName } from '../../api/index'

const Item = List.Item
/**
 * product的详情子路由组件
 */
class ProductDetail extends Component {
  state = {
    cName1: '', //一级分类名称
    cName2: '', //二级分类名称
  }

  async componentDidMount() {
    if (typeof this.props.location.state == 'undefined') {
      this.props.history.push('/product')
    } else {
      //得到当前商品的分类id
      const { pCategoryId, categoryId } = this.props.location.state.product

      if (pCategoryId === '0') {
        //一级分类下的商品
        const result = await reqGetCategoryName(categoryId)

        const cName1 = result.data.name
        this.setState({ cName1 })
      } else {
        /*
   //通过多个await方式发送多个请求:后面一个请求是在前一个请求成功返回后才发送
   //二级分类下的商品
   const result1 = await reqGetCategoryName(pCategoryId) //获取一级分类列表

   const cName1 = result1.data.name
   const result2 = await reqGetCategoryName(categoryId) //获取二级分类列表
   const cName2 = result2.data.name
*/

        //一次性发送多个请求，只有都成功了，才正常处理
        const results = await Promise.all([
          reqGetCategoryName(pCategoryId),
          reqGetCategoryName(categoryId),
        ])
        const cName1 = results[0].data.name
        const cName2 = results[1].data.name
        this.setState({ cName1, cName2 })
      }
    }
  }

  render() {
    console.log(typeof this.props.location.state == 'undefined')
    if (typeof this.props.location.state == 'undefined') {
      this.props.history.push('/product')
      return <div></div>
    } else {
      // 读取携带过来的state数据
      const {
        name,
        desc,
        price,
        detail,
        imgs,
      } = this.props.location.state.product

      const { cName1, cName2 } = this.state

      const title = (
        <span>
          <LinkButtom>
            <ArrowLeftOutlined
              style={{ color: 'green', marginRight: 15, fontSize: 20 }}
              onClick={() => {
                this.props.history.goBack()
              }}
            />
          </LinkButtom>

          <span>商品详情</span>
        </span>
      )

      return (
        <Card title={title} className="product-detail">
          <List>
            <Item>
              <span className="left">商品详情:</span>
              <span>{name}</span>
            </Item>
            <Item>
              <span className="left">商品描述:</span>
              <span>{desc}</span>
            </Item>
            <Item>
              <span className="left">商品价格:</span>
              <span>{price}</span>
            </Item>
            product-img
            <Item>
              <span className="left">所属分类:</span>
              <span>
                {cName1} {cName2 ? '-->' + cName2 : ''}
              </span>
            </Item>
            <Item>
              <span className="left">商品图片:</span>
              <span>
                {imgs.map((img) => (
                  <img
                    key={img}
                    className="product-img"
                    src={BASE_IMG_URL + img}
                    alt=""
                  />
                ))}
              </span>
            </Item>
            <Item>
              <span className="left">商品详情:</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: detail,
                }}
              ></span>
            </Item>
          </List>
        </Card>
      )
    }
  }
}

export default ProductDetail
