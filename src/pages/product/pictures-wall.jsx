import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants'

/**
 * 用于组件上传
 */
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * {
        uid: '-1',  //每个file有一个唯一的id
        name: 'image.png',  //图片文件名
        status: 'done',   //图片状态 done-已上传 uploading-上传中 removed-已删除
        url:
          'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',//图片地址
      },
 */

class PicturesWall extends Component {
  state = {
    previewVisible: false, //是否显示大图
    previewImage: '', //大图的url
    previewTitle: '',
    fileList: [],
  }
  constructor(props) {
    super(props)

    let fileList = []
    // 如果传入imgs属性
    const { imgs } = this.props

    if (imgs && imgs.length > 0 && imgs[0].length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img,
      }))
    }

    this.state = {
      previewVisible: false, //是否显示大图
      previewImage: '', //大图的url
      previewTitle: '',
      fileList, //所有已上传的图片
    }
  }

  //隐藏modal
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    //指定file对应的大图
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }

  /**
   *获取所有已上传图片文件名的数组
   */
  getImgs = () => {
    return this.state.fileList.map((file) => file.name)
  }

  /**
   * file:当前操作的图片文件(上传/删除)
   * fileList所有已上传图片的数组
   */
  handleChange = async ({ file, fileList }) => {
    //一旦上传成功,将当前上传的file的信息修正(name,url)
    if (file.status === 'done') {
      console.log(fileList)
      const result = file.response //{data: {name: "image-1596445913627.jpg", url: "http://localhost:5000/upload/image-1596445913627.jpg"}status: 0}

      if (result.status === 0) {
        message.success('上传图片成功！')
        const { name, url } = result.data

        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url

        //和下面意思一样
        // fileList[fileList.length - 1].name = name
        // fileList[fileList.length - 1].url = url
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') {
      // 删除图片
      const result = await reqDeleteImg(file.name)
      console.log(result)
      if (result.status === 0) {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }
    //操作(上传/删除)过程中，更新filelist
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div>Upload</div>
      </div>
    )
    return (
      <div>
        <Upload
          action="/manage/img/upload" /*上传的地址 */
          accept="image/*" /*只接收图片格式 */
          listType="picture-card"
          name="image" /*请求参数名 */
          fileList={fileList} /*所有已上传图片文件对象的数组 */
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
export default PicturesWall
