const express = require('express');
const app = express();
const port = 4444

/* requaied for data base */
const bcrypt = require('bcrypt');
const {pool} = require("./dbConfig");
const flash = require('express-flash');
const sesion = require('express-session');
const passport = require('passport');
const initializePassport = require("./passConf");
const registryUser = require('./registryUser')



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

/* use */
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

/* get page */
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

app.get('/list',(req,res)=>{
  
    res.render('list')
})
app.get('/panel',checkNotAuthenticated,(req,res)=>{

  console.log(req.user)

    res.render('blog',{user:req.user.userlogin})
})



/* post */

/*registry new user and check if already exist user  */
app.post('/',registryUser)

/* send question */
app.post('/question',(req,res)=>{
  console.log(req.body.yescat)
  pool.query(`select * from account where userlogin = id`,(err,res)=>{
      console.log("------mam---------", +req.user.id + "---konie-----")
    
    })
  res.redirect('/')
})

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