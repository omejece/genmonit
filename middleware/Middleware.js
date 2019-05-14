
var Connection = require('../connection/connect');

class Middleware{

    static userApiAuth (req, res, next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.body;
        }
        else if(req.method == 'GET'){
          myReq = req.query;
        }
        if(Connection.state === 'disconnected'){
            Connection.connect();
          }
         var query = `SELECT * FROM users WHERE apikey = "${myReq.apikey}" LIMIT 1` ;
            Connection.query(query,(err,rows,fields)=>{
               if(err){
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({status:25,message:err}));
               }
               else{
                    if (rows.length > 0) {
                         return next();
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({status:21,message:'Not authorized'}));
                    }  
               }
               
                 
             });

          
    };


    static ApiSubAuth (req, res, next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.body;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }
      if(Connection.state === 'disconnected'){
          Connection.connect();
        }
      var query = `SELECT * FROM subscriptions WHERE apikey = "${myReq.apikey}" LIMIT 1` ;
      
      Connection.query(query,(err,rows,fields)=>{
        
        if(err){
           throw err;
        }
        else{
             if (rows.length > 0) {
               var dateTime = rows[0].enddate;
               let dateTimeParts = dateTime.split(/[- :]/); 
               dateTimeParts[1]--;
               const date2 = new Date(...dateTimeParts);
               var date1 = new Date();
               if(date2 > date1){
                  next();
               }
               else{
                 res.setHeader('Content-Type', 'application/json');
                 res.send(JSON.stringify({status:24,message:'Subscription expired'}));
               }
             } 
             else {
                 console.log(query);
                 res.setHeader('Content-Type', 'application/json');
                 res.send(JSON.stringify({status:21,message:'Not authorized'}));
             }  
        }
        
          
      });

        
   }

}

module.exports = Middleware;