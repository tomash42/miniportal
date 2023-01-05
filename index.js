const express = require('express');
const app = express();
const port = 4444

/* requaied for data base */
const bcrypt = require('bcrypt');
const {pool} = require("./dbConfig");
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const sesion = require('express-session');
const passport = require('passport');


/*  */


/* static files  */
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));

/* end SF */

/* set views */
app.set('views','./view');
app.set('view engine','ejs');
/* end V */

/* use */
app.use(express.urlencoded({extended:false}));

app.use(flash())
app.use(sesion({
 secret: process.env.SESSION_SECRET,
 resave:false,
 saveUninitialized:false
})
)
app.use(passport.session())
app.use(passport.initialize());
app.use(passport.session());

/* end u */

/* get page */
app.get('',(req,res)=>{
    res.render('index',{
        bad_msg : req.flash('bad_msg'),
        success_msg : req.flash('success_msg')});
})

app.get('/list',(req,res)=>{
    res.render('list')
})
app.get('/bad',(req,res)=>{

    res.render('bad')
})
/* post  */
app.post('/',async (req,res)=>
{
try{
    /* 
    rejestracja
    1 - sprawdzam czy wystepuje login 
      1a -jesli nie to tworze konto
    */
let {name,surname, login, password, tel,email,address} = req.body;

  hashPass = await bcrypt.hash(password, 10);
  // Validation passed
  pool.query(
    `SELECT * FROM account
      WHERE userlogin = $1`,
    [login],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results.rows);

      if (results.rows.length > 0) {
        console.log(results.rows);
        const userLogin = req.body;
        req.flash("bad_msg", ` ${userLogin.login} juz istniej`);
        res.redirect("/")
        
      } else {
        //create account
        pool.query(
          `insert into account(username, usersurname,userlogin,userpassword,usertel,usermail,useraddress)
                values('${name}','${surname}','${login}','${hashPass}',${tel},'${email}','${address}')`,
          (err, results) => {
            if (err) {
              throw err;
            }
            console.log(results.rows);
            const userLogin = req.body;
            req.flash("success_msg", `Witaj ${userLogin.login} . Możesz się zalogować`);
            res.redirect("/");
          }
        );
      }
    }
  );
}
catch{
console.log("e")
res.redirect('/')
}
})


 app.post('/ds',passport.authenticate('local',{
successRedirect:'/',
failureRedirect:'/list',
failureFlash:flash
}),
function(req,res,next){
  console.log(res.username);
}) 
/*  */











app.listen(port);