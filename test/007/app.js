/**
 * Created by PhpStorm
 * Description: next..
 * User: JinwenLong
 * Author: longjinwen
 * Email: 204084802@qq.com
 * Date: 2020/4/5
 * Time: 2:13 下午
 */

const http = require('http');

http.createServer(function (request, response) {
  console.log('url：' + request.url);
  switch (request.url) {
    case '/':
      response.writeHead(200,
        {'Content-Type': 'text/html; charset=UTF-8'}
      );
      response.end(`<html>
        <head><link rel="stylesheet" href="/app.css"></head>
        <body>hello</body>
        </html>`);
      break;
    case '/app.css':
      response.writeHead(200,
        {
          'Content-Type': 'text/css; charset=UTF-8',
          'Cache-Control': 'max-age=10'
        }
      );
      response.end(`body{background:blue}`);
      break;
    default:
      response.writeHead(404, {});
      response.end(`404`);
      break;
  }
}).listen(3001);


