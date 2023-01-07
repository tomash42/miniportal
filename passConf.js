const LocalStrategy = require('passport-local').Strategy;

const {pool} = require('./dbConfig');
const bcrypt = require('bcrypt');
const e = require('connect-flash');
const passport = require('passport');

function initialize(){
    console.log("initialize");

    const authenticateUser = (login, password,done) =>{

        console.log(login, password);
  
        pool.query(

            `select * from account where userlogin = $1`,
            [`${login}`],
          
            (err,res)=>{
           
                if(err){
                    throw err;
                }
    
                console.log(res.rows);
            
                
                if(res.rows.length>0){
                    const user = res.rows[0];
                

                    bcrypt.compare(password, user.userpassword,(err,isMatch)=>{
                        if(err){
                            console.log(err)
                        }
                        if(isMatch){
                            console.log(' haslo ok ')
                            
                            return done(null, user,{message:'Password is incorrect'});

                        }    
                        else{
                            //password is incorect
                            console.log('zle haslo')
                            return done(null,false, {message:'Password is incorrect'});
                        }
                    });
                }else{
                    return done(null,false, {
                        message : " No user with that login"
                        
                    })
                }
            }
    
        )/* start pool query */
    }/* auth */

    passport.use(
        new LocalStrategy(
            {usernameField: "login", passwordField:"password"},
            authenticateUser
        )
    );
    passport.serializeUser((user,done)=>done(null,user.id))

    passport.deserializeUser((id,done) => {
        pool.query(`SELECT * FROM account WHERE id = $1`, [id], (err, results) => {
          if (err) {
        
            return done(err);
          }
          console.log(`ID is ${results.rows[0].id}`);
         
          return done(null, results.rows[0]);
        });
      });

}/* fun init */


module.exports = initialize;


