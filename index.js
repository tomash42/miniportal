const express = require('express');
const app = express();
const port = process.env.PORT||5555

/* requaied for data base */
const bcrypt = require('bcrypt');
const {pool} = require("./dbConfig");
const flash = require('express-flash');
const sesion = require('express-session');
const passport = require('passport');
const initializePassport = require("./passConf");
const { authenticate } = require('passport');
initializePassport(passport);


/* static files  */
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));

/* end SF */

/* set views */
app.set('views','./view');
app.set('view engine','ejs');
/* end V */

/* app use */
app.use(express.urlencoded({extended:false}));


app.use(sesion({
 secret: process.env.SESSION_SECRET,
 resave:false,
 saveUninitialized:false
})
)

app.use(passport.initialize());
app.use(passport.session())
app.use(flash())
/* end u */

/* app get page */
app.get('/',checkAuthenticated,(req,res)=>{
  console.log("bez logowania")
    res.render('index',{
        bad_msg : req.flash('bad_msg'),
        success_msg : req.flash('success_msg')});
})
app.get('/log',checkAuthenticated,(req,res)=>{
  console.log("bez logowania")
    res.render('index',{
        bad_msg : req.flash('bad_msg'),
        success_msg : req.flash('success_msg')});
})



app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



/* display post  */
app.get('/list',async (req,res)=>{
  try{
    await pool.query(`	SELECT userlogin, q1, q2,q3post FROM account a join post p on a.id = p.id ORDER BY userlogin; `,
      (err, results) => {
        if (err) {
          throw err;
          //console.log()
        }
        return res.render('list',{post : results.rows})
        });
  }catch{
    console.log("err")
  }
    
})
/* end display post */

app.get('/panel',checkNotAuthenticated,(req,res)=>{
  console.log(req.user);
  res.render('blog',{user:req.user.userlogin});
})



/* app post */

/*registry new user and check if already exist user  */
app.post('/',async (req,res)=>
{  
try{
  let {name,surname, login, password, tel,email,address} = req.body;
  hashPass = await bcrypt.hash(password, 10);

  
 await pool.query(
    `SELECT * FROM account WHERE userlogin = $1`,[login],
    (err, results) => {
      if (err) {
        throw err;
        //uwaga byl consollog
      }
      console.log(results.rows);
      if (results.rows.length > 0) {
        const userLogin = req.body;
        req.flash("bad_msg", ` ${userLogin.login} juz istnieje`);
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
          });
      }
    });
} catch {
  console.log("err")
  res.redirect('/')
  }
})
/* End registry  */




/* send question and save 
!!!!!make a redirect if user has  previously  added post!!!!!
*/
app.post('/question',async (req,res)=>{
try{
let {cat,dog, textarea} = req.body;
await  pool.query(
  `insert into post(id, q1,q2,q3post) values('${req.user.id}','${cat}','${dog}','${textarea}')`,
  (err, results) => {
    if (err) {
      console.log(err);
    }else {
      res.redirect("/list");
    }
  });
} catch {
  console.log("err")
  res.redirect('/')
  }
})
/* end send queston  */

app.post('/log',passport.authenticate('local',{
successRedirect:'/panel',
failureRedirect:'/',
failureFlash:true
}),
function(req,res,next){
  console.log(res.username);
}) 





function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/panel");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {

  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}


app.listen(port);