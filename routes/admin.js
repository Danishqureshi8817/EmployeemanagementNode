var express = require('express');
var router = express.Router();
var pool = require('./pool')
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');

/* GET home page. */
router.get('/adminlogin', function(req, res, next) {
  res.render('loginadmin', { message: ' '});
});

router.post('/checkadminlogin', function(req, res, next) {

    pool.query('select * from admins where (emailid=? or mobileno=?) and password=?',[req.body.email,req.body.email,req.body.password],(error,result)=>{
        if(error)
        {
            res.render('loginadmin',{message:'Server Error.....'})
        }
        else
        {
            if(result.length==1){
            localStorage.setItem('ADMIN',JSON.stringify(result))
                res.render('board',{result:result})//result[0]
            }
            else{
            res.render('loginadmin',{message:'invalid emailid/mobile number/password'})
            }
        }
    })
  
  });
  
  
  router.get('/logout', function(req, res, next) {
          localStorage.clear()
    res.render('loginadmin', { message: ' '});
  });


module.exports = router;
