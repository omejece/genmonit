

var uniqid = require('uniqid');
var bcrypt = require('bcrypt');
var User = require('../model/user');
var Subscription = require('../model/subscription');
var Vercode = require('../model/vercode');
var Device = require('../model/device');
var DeviceList = require('../model/devicelist');
var FConsumption = require('../model/fconsumption');
var Runtime = require('../model/runtime');
var Payment = require('../model/payment');
var Ctrack = require('../model/ctrack');
var Mailer = require('../mailer/mailer');
var DB = require('../DB/DB');


class ApiController{
  
   static apiLogin(req, res, next){
      
      let myReq;
      if(req.method == 'POST'){
        myReq = req.body;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }
      User.apiAuthenticate({email:myReq.email,password:myReq.password}).then((result,err)=>{
        
          if(err){
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({status:25,message:err}));
          }
          else{
             if(result){
              res.setHeader('Content-Type', 'application/json');
              var context = {id:result.id,email:result.email,name: result.name,username:result.username,apikey:result.apikey};
              res.send(JSON.stringify(context));
             }else{
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({status:27,message:'invalid login details'}));
             }
          }
      });
       
    }


    static userExist(req, res, next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.body;
        }
        else if(req.method == 'GET'){
          myReq = req.query;
        }

        User.findWhere([{'email': myReq.email},{'password': myReq.password}]).then((result,err)=>{
            if(err){
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({status:25,message:err}));
            }else{
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({status:20,message:'successfull',result:result}));
            }
        });
    }



    static updateUser(req, res, next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.body;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }
      
      var password = bcrypt.hashSync(myReq.password,10);

        User.updateWhere([{'email': myReq.email},{},{username:myReq,password:password}]).then((result,err)=>{
            if(err){
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({status:25,message:err}));
            }else{
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({status:20,message:'Updated successfully'}));
            }
        });
    }



    static sendCode(req, res, next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.body;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }
      var context = [{email:myReq.email},{}];
      var code = Math.floor(Math.random() * 1000000000);
      Vercode.count(context).then((result,err)=>{
          if(err){
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({status:25,message:err}));
          }
          else{
              context = [{email:myReq.email},{},{code:code}];
              if(parseInt(result) > 0){
                return Vercode.updateWhere(context).then((result,err)=>{
                  if(err){
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({status:25,message:err}));
                  }else{
                   return Mailer.send(myReq.email,'verification code',`Your Verification code is ${code}`)
                  }
                 }).then((response,err2)=>{
                  if(err2){
                   res.setHeader('Content-Type', 'application/json');
                   res.end(JSON.stringify({status:25,message:err}));
                  }else{
                   res.setHeader('Content-Type', 'application/json');
                   res.end(JSON.stringify({status:20,message:'code sent successfully'}));
                  }
               });
              }
              else{
                context = {email:myReq.email,code:code};
                return Vercode.Create(context).then((result,err)=>{
                  if(err){
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({status:25,message:err}));
                  }else{
                     Mailer.send(myReq.email,'verification code',`Your Verification code is ${code}`)
                    
                  }
                 }).then((response,err2)=>{
                  if(err2){
                   res.setHeader('Content-Type', 'application/json');
                   res.end(JSON.stringify({status:25,message:err}));
                  }else{
                   res.setHeader('Content-Type', 'application/json');
                   res.end(JSON.stringify({status:20,message:'code sent successfully',result:response}));
                  }
               });
              }
          }
      });
   }

    

    static newUser(req, res, next){
          let myReq;
          if(req.method == 'POST'){
            myReq = req.body;
          }

          else if(req.method == 'GET'){
            myReq = req.query;
          }

          Vercode.count([{email: myReq.email,code:myReq.code}]).then((result,err)=>{
            if(err){
              throw err
            }else{
               console.log(result);
               if(result > 0){
                  User.findWhere([{email: myReq.email},{}]).then((result,err)=>{
                    if(err){
                      throw err
                    }else{
                      if(result.length > 0){
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({status:21,message:'This user already exist'}));
                      }else{
                        var password = bcrypt.hashSync(myReq.password,10);
                        var apikey = uniqid() ;
                        var context = {name:myReq.name,email:myReq.email,username:myReq.username,password:password,apikey:apikey};
                        
                        User.Create(context)
                        .then((result,err)=>{
                            if(err){
                              res.setHeader('Content-Type', 'application/json');
                              res.send(JSON.stringify({status:25,message:err}));
                            }else{
                              context = {apikey:apikey,enddate:myReq.enddate};
                             return Subscription.Create(context).then((result,err)=>{
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify({status:20,message:'you have successfully registered'}));
                              });
                            }
                            
                        });
        
                        
                     }
                    }
                  });
               }else{
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:26,message:'Invalid verification code'}));
               }
            }
          });   
      }


    



    static newDevice(req, res, next){
        let myReq;
        console.log('sjnjs');
        if(req.method == 'POST'){
          myReq = req.body;
        }

        else if(req.method == 'GET'){
          myReq = req.query;
        }
       
       DeviceList.count([{duid:myReq.deviceuid,status:0},{}]).then((result,err)=>{
             if(err){
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({status:25,message:err}));
             }
            else{
               if(result > 0){
                 return Device.Create({
                   name: myReq.name,
                   apikey: myReq.apikey,
                   duid: myReq.deviceuid,
                   gauge: 0,
                   flowrate: 0,
                   control: 0,
                   status: 0
                 }).then((resolve,reject)=>{
                    if(reject){
                      res.setHeader('Content-Type', 'application/json');
                      res.send(JSON.stringify({status:25,message:reject}));
                    }
                    else{
                      return DeviceList.updateWhere([{duid:myReq.deviceuid},{},{status:1,apikey:myReq.apikey}]);
                    }
                 }).then(()=>{
                      return Ctrack.Create({duid:myReq.deviceuid});
                 }).then(()=>{
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status:20,message:'Device successfully added'}));
                 })
                 
               }
               else{
                  
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({status:28,message:'invalid device or device in use'}));
               } 
              
             }
       });
    }


    


    static getDevice(req, res, next){
          let myReq;
          if(req.method == 'POST'){
            myReq = req.body;
          }

          else if(req.method == 'GET'){
            myReq = req.query;
          }
         Device.findWhere([{apikey:myReq.apikey,duid:myReq.deviceuid},{}]).then((result,err)=>{
             if(err){
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({status:25,message:err}));
             }
             else{
                if(result.length > 0){
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({status:20,result:result}));
                }else{
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({status:29,message:"No device found"}));
                }
             }
         });
    }



    static allDevice(req, res, next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.body;
      }

      else if(req.method == 'GET'){
        myReq = req.query;
      }
     Device.findWhere([{apikey:myReq.apikey},{}]).then((result,err)=>{
         if(err){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:err}));
         }
         else{
            if(result.length > 0){
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({status:20,result:result}));
            }else{
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({status:29,message:"No device found"}));
            }
         }
     });
}
    
   

    static updateDevice(req, res, next){
          let myReq;
          if(req.method == 'POST'){
            myReq = req.body;
          }

          else if(req.method == 'GET'){
            myReq = req.query;
          }
         Device.updateWhere([{duid:myReq.deviceuid},{},{name:myReq.name}]).then((result,err)=>{
             if(err){
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({status:25,message:err}));
             }else{
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({status:20,message:"Device successfully updated"}));
             }
         });
    }


   static deleteDevice(req, res, next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.body;
        }

        else if(req.method == 'GET'){
          myReq = req.query;
        }


        Device.deleteWhere([{duid:myReq.deviceuid}]).then((result,err)=>{
          if(err){
           res.setHeader('Content-Type', 'application/json');
           res.send(JSON.stringify({status:25,message:err}));
          }else{
            DeviceList.updateWhere([{duid:myReq.deviceuid},{},{status:0,apikey:''}]);
          }
      }).then((resolve,reject)=>{
          if(reject){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({status:25,message:err}));
          }else{
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({status:20,message:"Device successfully removed"}));
          }
      });

   }


 static allDeviceRuntime(req, res, next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.body;
        }

        else if(req.method == 'GET'){
          myReq = req.query;
        }
      DB.Query(`SELECT * FROM runtimes WHERE apikey="${myReq.apikey}" AND datetaken >="${myReq.fromdate}" AND datetaken <="${myReq.todate}"`)
      .then((result,err)=>{
        if(err){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:err}));
        }else{
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:20,result:result}));
        }
      });
 }


 static deviceRuntime(req, res, next){
    let myReq;
    if(req.method == 'POST'){
      myReq = req.body;
    }

    else if(req.method == 'GET'){
      myReq = req.query;
    }
  DB.Query(`SELECT * FROM runtimes WHERE apikey="${myReq.apikey}" AND duid="${myReq.deviceuid}" AND datetaken >="${myReq.fromdate}" AND datetaken <="${myReq.todate}"`)
  .then((result,err)=>{
    if(err){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({status:25,message:err}));
    }else{
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({status:20,result:result}));
    }
  });
}


  static deviceFConsumption(req, res, next){
    let myReq;
    if(req.method == 'POST'){
      myReq = req.body;
    }

    else if(req.method == 'GET'){
      myReq = req.query;
    }
  DB.Query(`SELECT * FROM fconsumptions WHERE apikey="${myReq.apikey}" AND duid="${myReq.deviceuid}" AND datetaken >="${myReq.fromdate}" AND datetaken <="${myReq.todate}"`)
  .then((result,err)=>{
    if(err){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({status:25,message:err}));
    }else{
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({status:20,result:result}));
    }
  });
  }


  static allDeviceFConsumption(req, res, next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.body;
        }

        else if(req.method == 'GET'){
          myReq = req.query;
        }
      DB.Query(`SELECT * FROM fconsumptions WHERE apikey="${myReq.apikey}" AND datetaken >="${myReq.fromdate}" AND datetaken <="${myReq.todate}"`)
      .then((result,err)=>{
        if(err){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:err}));
        }else{
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:20,result:result}));
        }
      });
  }




  static makeSubscription(req, res, next){
    
    let myReq;
    if(req.method == 'POST'){
      myReq = req.body;
    }

    else if(req.method == 'GET'){
      myReq = req.query;
    }

    if(! myReq.amount || ! myReq.enddate || isNaN(myReq.amount)){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({status:30,message:"Invalid input"}));
     }
    var date = new Date();
      var timestamp = `${date.getFullYear()}-${1+date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    Payment.Create({apikey:myReq.apikey,amount:myReq.amount,datetaken:timestamp}).then((result,err)=>{
       if(err){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({status:25,message:err}));
       }else{
          Subscription.updateWhere([{apikey:myReq.apikey},{},{enddate:myReq.enddate}]);
       }
    }).then((resolve,reject)=>{
        if(reject){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:err}));
        }else{
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:20,message:"subscription successful"}));
        }
    });
  
}





}

module.exports = ApiController;