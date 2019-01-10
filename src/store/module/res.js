export default {
  state: {
    'res': {
      'id': '',
      'name': '默认资源名称',
      'category': '',
      'categoryList': '',
      'connectType': '0',
      'cacheTable': '',
      'num': 0,
      'createUser': '',
      'createTime': '',
      'status': '0',
      'updateTime': '',
      'schemaFlag': ''
    },

    'resData': {
      'id': '',
      'resId': '',
      'dsId': '',
      'tableName': '',
      'aliasId': '',
      'diy': '',
      'diySql': '',
      'createTime': ''
    },

    'resColList': [],
    'resFilterList': []
  },
  mutations: {

  },
  actions: {},
  getters: {
    procCount: state => {
      let count = 0
      state.resFilterList.forEach(resFilter => {
        resFilter.proc.forEach(proc => {
          count++
        })
      })

      return count
    }
  }
}
