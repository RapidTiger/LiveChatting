var http = require('http');
var url = require('url');

var server = http.createServer(function(request,response){
    // 1. 실제 요청한 주소전체를 콘솔에 출력
    console.log(request.url);
    var parsedUrl = url.parse(request.url);
    // 2. parsing 된 url 중에 서버URI에 해당하는 pathname 만 따로 저장
    var resource = parsedUrl.pathname;
    console.log('resource path=%s',resource);

    // 3. 리소스에 해당하는 문자열이 아래와 같으면 해당 메시지를 클라이언트에 전달
    if(resource == '/address'){
        response.writeHead(200, {'Content-Type':'text/html'});
        response.end('address<br><a href="http://localhost:8088/phone">phone</a>');
    }else if(resource == '/phone'){
        response.writeHead(200, {'Content-Type':'text/html'});
        response.end('000-0000-0000<br><a href="http://localhost:8088/name">name</a>');
    }else if(resource == '/name'){
        response.writeHead(200, {'Content-Type':'text/html'});
        response.end('name<br><a href="http://localhost:8088/">404</a>');
    }else{
        response.writeHead(404, {'Content-Type':'text/html'});
        response.end('404 Page Not Found<br><a href="http://localhost:8088/address">address</a>');
    }

});

// 4. 서버 포트 80번으로 변경.
server.listen(8088, function(){
    console.log('Server is running...');
});