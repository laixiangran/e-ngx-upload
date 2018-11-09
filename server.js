const express = require('express');     //主体
const body = require('body-parser');    //接收普通POST数据
const multer = require('multer');       //接收文件POST数据
const fs = require('fs');

let app = express();
app.listen(8088);
console.log('http://localhost:8088');

//中间件
app.use(body.urlencoded({extended: false}));

let multerObj = multer({dest: './example/upload/'});
app.use(multerObj.any());

// 上传分片
app.post('/upload', (req, res) => {
    if (req.headers['origin'] == 'null' || req.headers['origin'].startsWith('http://localhost')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    if (!req.files[0].filename) {
        res.end();
    } else {
        res.send(req.files[0].filename)
    }
});

// 合并文件
app.post('/merge', (req, res) => {
    let arr = [];
    let count = 0;

    // read stream
    loop(arr, req.body.chunks.split(','), count, callback);

    function callback(buf) {
        fs.writeFile(`upload/file/${req.body.md5}`, buf, (err) => {
            if (err) {
                console.log(err);
                res.send('error');
            } else {
                console.log(`创建-${req.body.md5}...成功`);
                res.send('success');
            }
        })
    }

    function loop(arr, chunk, count, fn) {
        if (count < chunk.length) {
            let filename = chunk[count];
            // read chunk
            arr.push(fs.readFileSync(`upload/${filename}`));
            count++;
            fs.unlinkSync(`upload/${filename}`);
            loop(arr, chunk, count, fn);
        } else {
            // return buffer
            fn(Buffer.concat(arr))
        }
    }
});

// 静态文件托管
app.use(express.static('./demo/'));
