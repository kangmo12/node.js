var fs = require('fs');
var ejs = require('ejs');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host :'localhost',
  post : 3306,
  user : 'root',
  password : 'root',
  database : 'project'
});

var app = express();
http.createServer(app).listen(3308, function(){
  console.log('running');
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//로그인//
app.get('/',function(req,res){
  fs.readFile('./views/login.html','utf8',function(err,data){
    if(err){
      console.log('readFile fail');
    }else{
      res.send(data);
    }
  })
})

app.post('/login',function(req,res){
  var body =req.body;
  var id1 =req.body.id;
  var pwd1 = req.body.pwd;
  connection.query('select * from users where id = ?',[id1],function(err,results,fields){
    if(err){
      res.send('error!!!');
    }else{
//      console.log("the result : ", results);
//      console.log(results[0].pwd);
      if(results.length > 0){
        if(results[0].pwd == pwd1){
          fs.readFile('./views/list.html','utf8',function(err,data){
            if(err){
              console.log('fail');
            }else{
              connection.query('select * from books', function(err,results){
                if(err){
                  console.log('fail!!!');
                }else{
                  res.send(ejs.render(data,{
                    list : results
                  }));
                }
              })
            }
          })
        }else{
          res.redirect('/');
        }
      }else{
        res.redirect('/');
      }
    }
  })
})
//회원 탈퇴//
app.get('/userDelete',function(req,res){
  fs.readFile('./views/user_delete.html','utf8',function(err,data){
    if(err){
      console.log('readFile xxx');
    }else{
      res.send(data);
    }
  })
})
app.post('/userDelete',function(req,res){
  var body = req.body;
  var deleteId =req.body.id;
  var deletePwd=req.body.pwd;
  console.log(deleteId);
  connection.query('select * from users where id = ?',[deleteId],function(err,results,fields){
    if(err){
      res.send('query er');
    }else{
      if(results.length > 0){
        if(results[0].pwd == deletePwd){
          connection.query('delete from users where id =?',[deleteId],function(err,rows){
            if(err){
              console.log('err : ',err.message);
            }else{
              res.redirect('/');
            }
          })
        }else{res.redirect('/');}
      }else{res.redirect('/');}
    }
  })
})
//관리자 로그인 창//
app.get('/admin',function(req,res){
  fs.readFile('./views/admin/ad_log.html','utf8',function(err,data){
    if(err){
      console.log('readFile error');
    }else{
      res.send(data);
    }
  })
})
//관리자 로그인//
app.post('/admin',function(req,res){
  var body =req.body;
  var adId = req.body.ai;
  var adPw = req.body.ap;

  connection.query('select * from admin where ad_id = ?',[adId],function(err,results,fields){
    if(err){
      res.send('error~~~~');
    }else {
      if(results.length > 0){
        if(results[0].ad_pw == adPw){
          fs.readFile('./views/admin/ad_list.html','utf8',function(err,data){
            if(err){
              console.log('fail!@#!');
            }else{
              connection.query('select * from books',function(err,results){
                if(err){
                  console.log('x');
                }else{
                  res.send(ejs.render(data,{
                    data : results
                  }))
                }
              })
            }
          })
        }else{
          res.redirect('/');
        }
      }else{
        res.redirect('/');
      }
    }
  })
})
// 도서 리스트//
/*app.get('/bkList',function(req,res){
  fs.readFile('./views/admin/ad_list.html','utf8',function(err,data){
    if(err){
      console.log('readFile error');
    }else{
      res.send(ejs.render(data,{
        bookList:data
      }))
    }
  })
})
app.post('/bkList',function(req,res){
  fs.readFile('./views/admin/ad_list.html','utf8',function(err,data){
    if(err){
      console.log('readFile err');
    }else{
      connection.query('select * from books',function(err,data){
        if(err){
          console.log('err : ',err.message);
        }else{
          res.send(ejs.render(data,{
            bookList : data
          }));
        }
      })
    }
  })
})*/
//도서 등록 //
app.get('/bkInsert',function(req,res){
  fs.readFile('./views/admin/bk_insert.html', 'utf8',function(err,data){
    if(err){
      console.log('readFile er');
    }else{
      res.send(data)
    }
  })
})

app.post('/bkInsert',function(req,res){
  var body = req.body;
  connection.query('insert into books values(?,?,?,?,?)',
  [body.bk_num, body.bk_name, body.bk_price, body.bk_quan, body.bk_writer],
  function(err, rows){
    if(err){
      console.log('insert fail!!!!!!');
    }else{
      res.redirect('/adlist')
      }
    }
  )
})
//도서 목록//
app.get('/adlist',function(req,res){
  fs.readFile('./views/admin/ad_list.html','utf-8',function(err,data){
    connection.query('select * from books',function(err, result){
      if(err){
        console.log("query!!1")
      }else{
        res.send(ejs.render(data,{
          data : result
        }))
      }
    })
  })
})
//도서 삭제//
app.get('/bkDelete',function(req,res){
  fs.readFile('./views/admin/ad_delete.html', 'utf8',function(err,data){
    if(err){
      console.log('readFile er');
    }else{
      res.send(data)
    }
  })
})
app.post('/bkDelete',function(req,res){
  var body = req.body;
  var bkB = req.body.bkNAM;
  connection.query('delete from books where bk_name=?',[bkB],function(err,rows){
    if(err){
      console.log('delete fail');
    }else{
      res.redirect('/adlist')
    }
  })
})
/*app.get('/ad_list',function(req,res){
  fs.readFile('./views/admin/ad_list.html','utf8',function(err,data){
    if(err){
      console.log('read x');
    }else{
      res.send(data);
    }
  })
})*/

//회원 등록 창//
app.get('/join',function(req,res){
  fs.readFile('./views/join.html','utf8',function(err,data){
    if(err){
      console.log('readFile error');
    }else{
      res.send(ejs.render(data,{
        list:data
      }))
    }
  })
})
//회원 등록//
app.post('/join',function(req,res){
  var body = req.body;

  connection.query('insert into users values(?,?,?,?,?,?,?,?)',
  [body.num, body.id, body.pwd, body.name, body.email, body.phone, body.birth, body.nick],
  function(err,result){
    if(err){
      console.log('insert error',error.message);
    }else{
      res.redirect('/');
    }
  })
})
module.exports = connection;
/*app.post('/join',function(req,res){
  connection.query('select * from users',function(err,result){
    if(err){
      console.log('err');
    }else{
      res.redirect('/');
    }
  })
})
*/
/*app.get('/list',function(req,res){
  fs.readFile('./views/list.html','utf8',function(err, data){
    if(err){
      console.log('readFile error');
    }else{
      res.send(data);
    }
  })
})

app.post('/list',function(req,res){
  fs.readFile('./views/list.html','utf8',function(err,data){
    if(err){
      console.log('readFile err');
    }else{
      connection.query('select * from users',function(err,results){
        if(err){
          console.log('err : ',err.message);
        }else{
          res.send(ejs.render(data,{
            list : results
          }));
        }
      })
    }
  })
})
*/
