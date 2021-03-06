const mockjs= require('mockjs');
const { VUE_APP_APIHOST } = process.env;
const mock = {};

mock[`GET ${VUE_APP_APIHOST || ''}/home/articles/dailynew`] = (req, res) => {
  res.send({
    code: 0,
    data: {
      total: mockjs.mock('@integer(1000,10000)'),
      num: mockjs.mock('@integer(10,100)'),
      day: mockjs.mock('@float(-10,15,0,2)'),
      week: mockjs.mock('@float(-10,15,0,2)'),
    },
  });
};

mock[`GET ${VUE_APP_APIHOST || ''}/home/articles`] = (req, res) => {
  res.send({
    code: 0,
    data: mockjs.mock({
      total: 1000,
      currentPage: 1,
      'list|5': [
        {
          category: {
            id: '@integer(1)',
            alias: '@word(4)',
            name: '@cword(4)',
          },
          title: '@ctitle(20,30)',
          id: '@integer(1)',
          addtime: '@datetime',
          'tag|0-3': '@ctitle(4,6),',
          hit: '@integer(100,1000)',
        },
      ],
    }),
  });
};


module.exports = {
  ...mock
};
