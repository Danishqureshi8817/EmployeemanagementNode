var express = require('express')
var router = express.Router()
var pool = require('./pool')
var upload = require('./multer')
var fs = require('fs')
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');

router.get('/employeeinterface',function(req,res){
    try {
        
        var admin = JSON.parse(localStorage.getItem('ADMIN'))
        if(admin==null){
            res.render('loginadmin',{message:''})
        }
    res.render('employeeinterface',{status:null })
    } 
    catch (error) {
        res.render('loginadmin',{message:''})
    }
    
})

router.post('/submit_employee_record',upload.single('picture'),(req,res)=>{

    console.log("BODY:",req.body)
    console.log("FILE:",req.file)

    var name=req.body.firstname+" "+req.body.lastname
    var dob = new Date (req.body.dob)
    pool.query('insert into employees(employeename, dob, gender, address, state, city, emailaddress, contactnumber, picture) values(?,?,?,?,?,?,?,?,?)',[name,dob,req.body.gender,req.body.address,req.body.state,req.body.city,req.body.emailaddress,req.body.contactnumber,req.file.filename],(error,result)=>{
       //note:-req.file.originalname and req.file.filename are equal by default but jab (originalname) se user ke name se imag esave krte hai to vo sirf image ke name mai show hoga but data bade mai file ka hi name jayega..
        if(error)
        {
            console.log(error)
            res.render('employeeinterface',{status:0})
        }
        else{
            console.log('result:'+result)
            res.render('employeeinterface',{status:1})
        }
    })
})


router.get('/display_all_employee',(req,res)=>{
try {
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    if(admin==null){
        res.render('loginadmin',{message:''})
    }
    pool.query('select e.*,(select s.statename from states s where s.stateid=e.state) as sname,(select c.cityname from cities c where c.cityid=e.city) as cname from employees e',(error,result)=>{
        if(error){
            console.log(error)
            res.render("displayemployee",{status:false,result:[]})
        }
        else
        {
            res.render("displayemployee",{status:true,result:result})
        }
    })
} 
catch (error) {
   
    res.render('loginadmin',{message:''})
}
    
})

router.get('/display_by_id',(req,res)=>{
    pool.query('select e.*,(select s.statename from states s where s.stateid=e.state) as sname,(select c.cityname from cities c where c.cityid=e.city) as cname from employees e where e.employeeid=?',[req.query.eid],(error,result)=>{
        if(error){
            console.log(error)
            res.render("displaybyid",{status:false,result:[]})
        }
        else
        {
            res.render("displaybyid",{status:true,result:result[0]})
        }
    })
})

router.post('/edit_employee_record',(req,res)=>{

    console.log("BODY:",req.body)
    
    if(req.body.action=='Edit'){
    var name=req.body.firstname+" "+req.body.lastname
    var dob = new Date (req.body.dob)
    pool.query('update employees set  employeename=?, dob=?, gender=?, address=?, state=?, city=?, emailaddress=?, contactnumber=?  where employeeid=? ',[name,dob,req.body.gender,req.body.address,req.body.state,req.body.city,req.body.emailaddress,req.body.contactnumber,req.body.employeeid],(error,result)=>{
       //note:-req.file.originalname and req.file.filename are equal by default but jab (originalname) se user ke name se imag esave krte hai to vo sirf image ke name mai show hoga but data bade mai file ka hi name jayega..
        if(error)
        {
            console.log(error)
            res.redirect('/employee/display_all_employee')
        }
        else{
            console.log('result:'+result)
            res.redirect('/employee/display_all_employee')
        }
    })
}

  else{
    pool.query('delete from employees where employeeid=?',[req.body.employeeid],(error,result)=>{
        //note:-req.file.originalname and req.file.filename are equal by default but jab (originalname) se user ke name se imag esave krte hai to vo sirf image ke name mai show hoga but data bade mai file ka hi name jayega..
         if(error)
         {
             console.log(error)
             res.redirect('/employee/display_all_employee')
         }
         else{
             console.log('result:'+result)
             res.redirect('/employee/display_all_employee')
         }
     })
  }
})


router.get('/display_picture', function(req, res, next) {
    res.render('displaypicture', { eid:req.query.eid,ename:req.query.ename,picture:req.query.picture});
  });
  

  router.post('/edit_employee_picture',upload.single('picture'),(req,res)=>{

    console.log("BODY:",req.body)
    console.log("FILE:",req.file)

    pool.query('update employees set picture=? where employeeid=?',[req.file.filename,req.body.employeeid],(error,result)=>{
       //note:-req.file.originalname and req.file.filename are equal by default but jab (originalname) se user ke name se imag esave krte hai to vo sirf image ke name mai show hoga but data bade mai file ka hi name jayega..
        if(error)
        {
            console.log(error)
            res.redirect('/employee/display_all_employee')
        }
        else{
            var filepath = (`D:/Node2022-09/Node/employeemanagement/public/images/${req.body.oldpicture}`)
              fs.unlinkSync(filepath)
            console.log('result:'+result)
            res.redirect('/employee/display_all_employee')
        }
    })
})


module.exports = router;