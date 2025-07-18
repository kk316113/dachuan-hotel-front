const http = require('http');
const querystring = require('querystring');
const my_result = []

let server = http.createServer((req, res) => {
  let post = '';
  req.on('data', function (chunk) {
    post += chunk;
  });

  req.on('end', function () {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8'
    })
    post = querystring.parse(post);
    console.log('post-data:', post);
    if (post) {
      let result = {
        code: 200,
        // msg: "server error"
        data: my_result
      }
      res.end(JSON.stringify(result));
    } else {
      let result = {
        code: '0',
        msg: '没有接受到数据'
      }
      res.end(JSON.stringify(result));
    }
  });
});
server.listen(8886)
