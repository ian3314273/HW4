var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 使用SQLIE3 操作數據庫 打開在db/ssd_sqlite.db的資料庫並確認是否成功打開
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/SSD_sqlite.db', (err)=>{
    if(err){
        console.error(err.message);
    }else{
        console.log('Connected to the ssd_sqlite database.');
    }
});
// 若ssd_price table不存在則建立ssd_price table
db.serialize(()=>{
    db.run('CREATE TABLE IF NOT EXISTS ssd_price (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price INTEGER)');
});

// 用get在/api/searchbetween取得兩個日期之間的資料
app.get('/api/searchbetween', (req, res)=>{
    const start = req.query.start;
    const end = req.query.end;
    db.all('SELECT * FROM ssd_price WHERE date BETWEEN ? AND ?', start, end, (err, rows)=>{
        if(err){
            console.error(err.message);
        }else{
            res.json(rows);
        }
    });
});
module.exports = app;
