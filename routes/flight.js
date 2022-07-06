var express = require('express');
var router = express.Router();
var pool=require("./pool");
var upload=require("./multer");
var LocalStorage=require("node-localstorage").LocalStorage;
var localStorage=new LocalStorage('./scratch');


router.get('/displaybyid', function(req, res, next) {
  pool.query('select F.*,(select S.statename from states  S where S.stateid=F.sourcestateid) as ss,(select S.statename from states  S where S.stateid=F.destinationstateid) as ds,(select C.cityname from city  C where C.cityid=F.sourcecityid) as sc,(select C.cityname from city  C where C.cityid=F.destinationcityid) as dc from flights F where F.flightid=?',[req.query.flightid],function(error,result){

    if(error)
    {
      res.render('displaybyflightid',{data:[]});
    }
    else
    {
      res.render('displaybyflightid',{data:result[0]});
    }
 
  
  });

})

router.get('/displayall', function(req, res, next) {
  var result=JSON.parse(localStorage.getItem('admin'))
  if(!result)
  res.render("loginpage",{msg: ''})

  pool.query('select F.*,(select C.cityname from city  C where C.cityid=F.sourcecityid) as sc,(select C.cityname from city  C where C.cityid=F.destinationcityid) as dc from flights F',function(error,result){

    if(error)
    {
      res.render('displayall',{data:[]});
    }
    else
    {
      res.render('displayall',{data:result});
    }
 
  
  });
 
  });

router.get('/flight', function(req, res, next) {
  var result=JSON.parse(localStorage.getItem('admin'))
  if(result)
  res.render('flightinterface',{msg:''});
  else
  {
    res.render("loginpage",{msg: ''})
  }
});


router.get('/fetchallstates',function(req,res){

  pool.query('select * from states',function(error,result){

   if(error)
   {
     res.status(500).json([])
   }
   else{
     res.status(200).json(result)
   }

  })

})
  
router.get('/fetchallcity',function(req,res){
  pool.query('select * from city where stateid=?',[req.query.stateid],function(error,result){

    if(error)
    {
      res.status(500).json([])
    }
    else{
      res.status(200).json(result)
    }
 
 
 
   })
  })
  
   router.post("/addnewrecord",upload.single('logo'),function(req,res){
   console.log("BODY:",req.body)
   console.log("FILE",req.file)
 
   var fclass
   if(Array.isArray(req.body.fclass))
   fclass=req.body.fclass.join("#")
   else
   fclass=req.body.fclass

   var days
   if(Array.isArray(req.body.fclass))
   days=req.body.days.join("#")
   else
   days=req.body.days
   


 
    pool.query("insert into flights(flightid,companyname,sourcestateid,sourcecityid,destinationstateid,destinationcityid,status,flightclass,sourcetiming,destinationtiming,days,logo)values(?,?,?,?,?,?,?,?,?,?,?,?)",[ req.body.flightid, req.body.companyname,req.body.sourcestate,req.body.sourcecity,req.body.destinationstate,req.body.destinationcity,req.body.status,fclass,req.body.sourcetime,req.body.destime,days,req.file.originalname],function(error,result){
     
      if(error)
    { res.render('flightinterface',{msg: 'Server Error,Record Not Submitted'})
  }
    else
    {
      res.render('flightinterface',{msg: 'Record submitted successfully'})
    }



    })

  })

  

router.post("/editdeleterecord",function(req,res){
  console.log("BODY:",req.body)
  if(req.body.btn=="edit")
  {
  

  var fclass
  if(Array.isArray(req.body.fclass))
  fclass=req.body.fclass.join("#")
  else
  fclass=req.body.fclass

  var  days
  if(Array.isArray(req.body.fclass))
  days=req.body.days.join("#")
  else
  days=req.body.days
  



   pool.query("update flights set companyname=?,sourcestateid=?,sourcecityid=?,destinationstateid=?,destinationcityid=?,status=?,flightclass=?,sourcetiming=?,destinationtiming=?,days=? where flightid=?",[  req.body.companyname,req.body.sourcestate,req.body.sourcecity,req.body.destinationstate,req.body.destinationcity,req.body.status,fclass,req.body.sourcetime,req.body.destime,days,req.body.flightid], function(error,result) {
    
     if(error)
   {  res.redirect("/flight/displayall")
   }
   else
   {   res.redirect("/flight/displayall")
   }



   })
  }
  else
  {
    pool.query("delete from flights  where flightid=?",[req.body.flightid], function(error,result) {
    
      if(error)
    {  res.redirect("/flight/displayall")
    }
    else
    {   res.redirect("/flight/displayall")
    }
 
 
 
    })




  }

  })
  router.get('/showpicture',function(req,res){
    res.render('showpicture',{flightid:req.query.flightid,companyname:req.query.companyname,logo:req.query.logo})
    
     
       })


       router.post("/editpicture",upload.single('logo'),function(req,res){
      
     
     
      
         pool.query("update flights set logo=? where flightid=?",[req.file.originalname,req.body.flightid],function(error,result){


          if(error)
          {  res.redirect("/flight/displayall")
          }
          else
          {   res.redirect("/flight/displayall")
          }






         })
          
          
     
       })









module.exports = router;
