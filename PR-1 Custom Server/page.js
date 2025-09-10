const http = require('http');

const port = 5000;

const fs = require('fs');

const requestHandler = (request, response) => {

    let fileName = "";

    switch (request.url) {
        case '/':
            fileName = 'index.html';
            break;
        case '/about':
            fileName = 'about.html';
            break;
        case '/blog':
            fileName = 'blog.html';
            break;
        case '/contact':
            fileName = 'contact.html';
            break;
        case '/product':
            fileName = 'product.html';
            break;
        default:
            fileName = '404.html';
    }

    fs.readFile(fileName, (error, result) => {
        if (error) {
            console.log(error);
            return false;
        }
        response.end(result);
    })
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`Server is running on port ${port}`);
})