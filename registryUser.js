

const registryuser =  async (req,res)=>
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
          }
        );
      }
    }
  );
}
catch{
console.log("err")
res.redirect('/')
}
}

module.exports = registryuser;