const getList = (author, keyword) => {
  // 先返回假数据（格式是正确的）
  return [
    {
      id: 1,
      title: '标题A',
      content: '内容A',
      createTime: 1575372992187,
      author: 'jimson'
    },
    {
      id: 2,
      title: '标题B',
      content: '内容B',
      createTime: 1575373045667,
      author: 'jimson'
    }
  ]
}
module.exports = {
  getList
}
