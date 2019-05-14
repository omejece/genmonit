var Connection = require('../connection/connect');

class DB{
    static Query(query){
            if(Connection.state === 'disconnected'){
              Connection.connect();
            }
           console.log(query);
    
           return new Promise((resolve,reject)=>{
              Connection.query(query,(err,rows,fields)=>{
                   try{
                    if(err){
                       reject(err);
                     }else{
                        resolve(rows);
                     }
                   }catch(err){
                     reject(err);
                   }
               });
           })
           
       }
}

module.exports = DB;