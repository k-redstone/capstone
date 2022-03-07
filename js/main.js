const request = require('request');
const cheerio = require('cheerio');

const session = request.session();

const options = {
  url: 'https://everytime.kr/login',
  headers: {
    'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
  }
}
const log_info = {
  'id' : "che0618",
  'pw' : "hongsuck36"
}
const url = 'https://everytime.kr/login'
const req = session.post(url, log_info)
// const req = session.get('https://everytime.kr/login', headers = headers).content
// const html = req.text
// console.log(html)
const login = request.get('https://everytime.kr')
console.log(login)


request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    // console.log(body)
    // console.log('body:', body)
    // body.querySelector('.input input[name=userid').value = id
    // body.querySelector('.input input[name=password').value = pw
    const $ = cheerio.load(body);
    const lists= $('.input > input[name=userid]')
    // console.log(lists)
  } else {
    console.error('error:', error)
    console.log('statusCode:', response && response.statusCode)
  }
});

// const html = req.text
// console.log(html)