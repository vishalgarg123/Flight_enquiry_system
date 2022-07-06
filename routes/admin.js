var express = require('express');
var router = express.Router();
var pool=require("./pool")
var LocalStorage=require("node-localstorage").LocalStorage;
var localstorage=new LocalStorage('./scratch');
/* GET users listing. */
router.get('/admin', function(req, res, next) {
  res.render("loginpage",{msg: ''})
})

router.get('/adminlogout', function(req, res, next) {
    localstorage.clear()
    res.render("loginpage",{msg: ''})
  })



router.post('/checkadminlogin', function(req, res, next) {
    pool.query("select * from admins where (emailid=? or mobileno=?) and password=?",[req.body.userid,req.body.userid,req.body.password],function(error,result){

if(error)
{ res.render("loginpage",{msg: "SERVER ERROR...."})
    }
else
{ if(result.length==1)
    { localstorage.setItem('admin',JSON.stringify({emailid:result[0].emailid,mobileno:result[0].mobileno}))
        res.render("Dashboard",{result:result[0]})
    }
    else{
        res.render("loginpage",{msg:"Invalid userID/Password"})
    }


}

    })
})
  

module.exports = router;
