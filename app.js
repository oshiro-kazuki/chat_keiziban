const express = require('express');
const router = express.Router();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//mysqlのデータベース接続
const mysql = require('mysql');
const connection = mysql.createConnection({
  host       : 'localhost',
  user       : 'root',
  password   : 'root',
  database   : 'bulletin',
  charset    : 'utf8',
  dateStrings: 'true',
});

connection.connect((err) => {
  if(err) {
    console.log(`error connecting: ${err.stack}`);
    return;
  }
  console.log('success');
});

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host       : 'localhost',
    user       : 'root',
    password   : 'root',
    database   : 'bulletin',
    charset    : 'utf8',
    dateStrings: 'true',
  }
});

const bookshelf = require('bookshelf')(knex);
const Users = bookshelf.Model.extend({
  tableName: 'users'
});

const Posts = bookshelf.Model.extend({
  tableName: 'posts'
});


//ページ
app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.post('/signup', (req, res) => {
  connection.query(
    'insert into users (name, pass, image) values (?, ?, ?)',
    [req.body.username, req.body.password, req.body.image],
    (error, results) => {
      res.redirect('/');
    }
  )
});


app.get('/account_del/:name', (req, res) => {
  connection.query(
    'SELECT * FROM users WHERE name = ?',
    [req.params.name],
    (error, results) => {
      res.render('acc_del.ejs', {user: results[0]});
    }
  )
});

app.post('/account_delete/:name', (req, res) => {
  connection.query(
    'DELETE u, p FROM users u INNER JOIN posts p ON u.name = p.user_id WHERE u.name =  ?',
    [req.body.name],
    (error, results) =>{
      res.redirect('/');
    }
  )
});

app.post('/login', passport.authenticate(
    'local', 
    {
      failureRedirect: '/',
      successRedirect: '/main',
      session: true,
      failureFlash: true,
      passReqToCallback: true,
    }
  )
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//ログインの入力判定
passport.use('local', new LocalStrategy({
    // Viewのアカウント入力フォームのname属性を指定する
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, username, password, done) => {
    // appのpassport.authenticate()が呼ばれたらここの処理が走る。
    process.nextTick(() => {
      const reqName = req.body.username;
      const reqPass = req.body.password;
      // console.log(`reqName: ${reqName}`, `reqPass: ${reqPass}`);
      
      Users.query({where: {name: reqName}, andWhere: {pass: reqPass}})
      .fetch().then(user => {
        //ログイン成功
        req.session.name = reqName;
        req.session.image = user.attributes.image;
        console.log(`req.session.image: ${req.session.image}`);
        return done(null, user);
      }, err => {
        //ログイン失敗
        console.log(`not login : ${err}`);
        return done(null, false, {message: 'error'});
      }).catch((err) => {
        console.log(`catch:  ${err}`);
        done(err);
      })
    });
  })
);

//認証した際のオブジェクトをシリアライズしてセッションに保存する。
passport.serializeUser((username, done) => {
  console.log('serializeUser');
  done(null, username);
});

//認証したデシアライズしてセッションで使用できる
passport.deserializeUser((username, done) => {
  console.log(`deserializeUser:  ${username}`);
  done(null, {name: username});
});

app.get('/main', (req, res) => {
  connection.query(
    'SELECT p.*, u.image, u.name, LEFT(p.user_id, 8) AS show_user, LEFT(p.user_id, 4) AS not_img FROM posts p INNER JOIN users u ON p.user_id = u.name ORDER BY p.id',
    (error, results) => {
      res.render('main.ejs', {
        tableResult: results,
        userName: req.session.name,
        userImage: req.session.image,
      });
      // console.log(results);
    }
  );
});

app.get('/page_update', (req, res) => {
  res.redirect('/main');
});
  
app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT *, LEFT(user_id, 8) AS show_user, LEFT(user_id, 4) AS not_img FROM posts WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {
        p: results[0],
        userImage: req.session.image,
      });
    }
  );
});

app.get('/post/:name', (req, res) => {
  connection.query(
    'SELECT *, LEFT(name, 8) AS show_user, LEFT(name, 4) AS not_img FROM users WHERE name = ?',
    [req.params.name],
    (error, results) => {
      res.render('post.ejs',{
        user: results[0],
        userName: req.session.name,
        userImage: req.session.image,
      });
    }
  );
});

app.post('/post_insert', (req, res) => {
  connection.query(
    'INSERT INTO posts (user_id, message) VALUES (?, ?)',
    [req.body.user_id, req.body.message],
    (error, results) => {
      res.redirect('/main');
    }
  );
});

// app.get('/post_mult', (req, res) => {
//   connection.query(
//     'SELECT u.name, p.message FROM users u INNER JOIN posts p ON u.name = p.user_id',
//     (error, results) => {
//       res.render('post_mult.ejs', {tableResult: results});
//     }
//   );
// });

// app.post('/post_insert_mult', (req, res) => {
//   connection.query(
//     'INSERT INTO posts (user_id, message) VALUES (?, ?)',
//     [req.body.user_id, req.body.message],
//     (error, results) => {
//       res.redirect('/main');
//     }
//   );
// });

app.post('/post_update/:id', (req, res) => {
  connection.query(
    'update posts set message = ? where id = ?',
    [req.body.message, req.params.id],
    (error, results) => {
      res.redirect('/main');
    }
  );
});

app.post('/post_delete/:id', (req, res) => {
  connection.query(
    'delete from posts where id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/main');
    }
  );
});

app.listen(3000);