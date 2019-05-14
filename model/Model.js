


var Connection = require('../connection/connect');
var bcrypt = require('bcrypt');


// class fields

class Model{
   constructor(){ 
   }




   // inserting records
   static Create(params){
      if(Connection.state === 'disconnected'){
         Connection.connect();
       }
      var date = new Date();
      var timestamp = `${date.getFullYear()}-${1+date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      var model = this.name.toLocaleLowerCase()+'s';
      var id = null;
      var keys = Object.keys(params);
      
      var query1 = '';
      var query2 = '';
      var index = 0;
      for(index in keys){
          if(index == 0){
            query1 +=`${keys[index]}`;
            query2 +=`"${params[keys[index]]}"`;
          }else{
            query1 +=`,${keys[index]}`;
            query2 +=`,"${params[keys[index]]}"`;
          }
      }
      query1 +=`,created`;
      query2 +=`,"${timestamp}"`;

      var query = `INSERT INTO ${model}(${query1})
        VALUES(${query2})`;

        console.log(query);
       
        return new Promise(function(resolve, reject){
         try{
               Connection.query(query,(err,rows,fields)=>{
                     if(err){
                        reject(err);
                     }
                     else{
                        query = `SELECT * FROM ${model} WHERE created = "${timestamp}"`;
                        try{
                           Connection.query(query,(err,rows,fields)=>{
                              
                              if(err){
                                 reject(err);
                              }else{
                                 let prop = 0;
                                 for(prop in rows){
                                    id = rows[prop].id;
                                    resolve(id);
                                 }
                              }
                           });
                        }catch(err){
                           throw err;
                        }
                       
                     }
                     
               });
            }catch(err){
               console.log('sns');
            }

        });
      

   }


   

   // deleting records
   static deleteAll(){
    var model = this.name.toLocaleLowerCase()+'s';
      if(Connection.state === 'disconnected'){
         Connection.connect();
      }
      var query = `DELETE * FROM ${model}` ;
      console.log(query);

      return new Promise((resolve,reject)=>{
         Connection.query(query,(err,rows,fields)=>{
            
              try{
               if(err){
                  reject(err);
                }else{
                   resolve(1);
                }
              }catch(err){
                reject(err);
              }
          });
      })
      
      
   }


 static deleteWhere(values){
   var query1 = '';
   var index = 0;
   var model = this.name.toLocaleLowerCase()+'s';
   for(index in values){
         var keys = Object.keys(values[index]);
         var prop = 0;
         for(prop in keys){
               if(index > 0){
                  query1 += 'OR ';
               }
               else{
                  if(prop > 0 && prop < (keys.length)){
                     query1 += 'AND '; 
                  }
               }
               query1 += `${keys[prop]} = "${values[index][keys[prop]]}" `;
            
         }
      }

      if(Connection.state === 'disconnected'){
         Connection.connect();
       }
      var query = `DELETE FROM ${model}  WHERE ${query1}` ;
      console.log(query);

      return new Promise((resolve,reject)=>{
         Connection.query(query,(err,rows,fields)=>{
            
              try{
               if(err){
                  reject(err);
                }else{
                   resolve(1);
                }
              }catch(err){
                reject(err);
              }
          });
      })
      
      
   }


 static findWhere(values){
      var query1 = '';
      var index = 0;
      var model = this.name.toLocaleLowerCase()+'s';
     for(index in values){
         var keys = Object.keys(values[index]);
         var prop = 0;
         for(prop in keys){
            if(index > 0){
               query1 += 'OR ';
            }
            else{
               if(prop > 0 && prop < (keys.length)){
                  query1 += 'AND '; 
               }
            }
            query1 += `${keys[prop]} = "${values[index][keys[prop]]}" `;
         }
      }

      
      if(Connection.state === 'disconnected'){
         Connection.connect();
       }
      var query = `SELECT * FROM ${model} WHERE  ${query1}` ;
       console.log(query);
      return new Promise((resolve,reject)=>{
         try{
            Connection.query(query,(err,rows,fields)=>{
               
               if(err){
                  reject(err);
               }else{
                let prop = 0;
                var userArray = [];
                for(prop in rows){
                   var row = rows[prop];
                   userArray.push(row);
                }

                resolve(userArray);
               }
            });
         }catch(err){

         }
      });
      

   }



   static count(values){
      var query1 = '';
      var index = 0;
      console.log('sjnjs');
      var model = this.name.toLocaleLowerCase()+'s';
     for(index in values){
         var keys = Object.keys(values[index]);
         var prop = 0;
         for(prop in keys){
            if(index > 0){
               query1 += 'OR ';
            }
            else{
               if(prop > 0 && prop < (keys.length)){
                  query1 += 'AND '; 
               }
            }
            query1 += `${keys[prop]} = "${values[index][keys[prop]]}" `;
         }
      }

      
      if(Connection.state === 'disconnected'){
         Connection.connect();
       }
      var query = `SELECT *  FROM ${model}  WHERE  ${query1}` ;
      console.log(query);

      return new Promise((resolve,reject)=>{
         try{
            Connection.query(query,(err,rows,fields)=>{
               
               if(err){
                  reject(err);
               }else{
                  if(rows.length > 0){
                     resolve(rows.length);
                  }else{

                     resolve(0);
                  }
                  
               }
            });
         }catch(err){

         }
      });
      

   }

  

 static all(values=null){ 
    var model = this.name.toLocaleLowerCase()+'s';
    var query1 = '';
    if(values){
      var query1 = `ORDER BY ${values[0]} ${values[1]}`;
    }
    if(Connection.state === 'disconnected'){
      Connection.connect();
    }
    var query = `SELECT * FROM ${model} ${query1}`;
    return new Promise((resolve,reject)=>{
      try{
         Connection.query(query,(err,rows,fields)=>{
            
               if(err){
                  reject(err);
               }
               else{
                  let prop = 0;
                  var userArray = [];
                  for(prop in rows){
                     var row = rows[prop];
                     userArray.push(row);
                  }

                  resolve(userArray);
               }
         });
       }catch(err){
         reject(err);
       }
    });
    
 }


   static updateWhere(values){
      var query1 = '';
      var query2 = '';
      var index = 0;
      var model = this.name.toLocaleLowerCase()+'s';
      for(index in values){
            var keys = Object.keys(values[index]);
            var prop = 0;
            for(prop in keys){
               if(index == 2){
                  if(prop > 0 && prop < (keys.length)){
                     query2 += ', '; 
                  }
                  query2 += `${keys[prop]} = "${values[index][keys[prop]]}" `;
               }else{
                  if(index > 0){
                     query1 += 'OR ';
                  }
                  else{
                     if(prop > 0 &&  prop < (keys.length)){
                        query1 += 'AND '; 
                     }
                  }
                  query1 += `${keys[prop]} = "${values[index][keys[prop]]}" `;
               }
            }
         }

         if(Connection.state === 'disconnected'){
            Connection.connect();
          }
         var query = `UPDATE ${model} SET  ${query2} WHERE ${query1}` ;
         console.log(query);

         return new Promise((resolve,reject)=>{
            Connection.query(query,(err,rows,fields)=>{
               
                 try{
                  if(err){
                     reject(err);
                   }else{
                      resolve(20);
                   }
                 }catch(err){
                   reject(err);
                 }
             });
         })
         
         
   }

   
   static authenticate(req,params){
      var model = this.name.toLocaleLowerCase()+'s';
      var keys = Object.keys(params);
      var query1 = '';
      var prop = 0;
      var password = '';
      for(prop in keys){
         if(keys[1] != 'password'){
             throw 'require password as the second parameter';
         }else{
            password = params['password'];

            if(prop == 0){
               query1 += `${keys[prop]} = "${params[keys[prop]]}"`;
            }else{
               query1 += `AND ${keys[prop]} = "${params[keys[prop]]}"`;
            }
         }
      }
      
      if(Connection.state === 'disconnected'){
         Connection.connect();
       }
      var query = `SELECT * FROM ${model} WHERE ${query1} LIMIT 1` ;

      return new Promise((resolve,reject)=>{
         Connection.query(query,(err,rows,fields)=>{
            
              try{
               if(err){
                  reject(err);
                }else{
                   if(rows.length > 0){
                     resolve(true);
                   }else{
                     resolve(false);
                   }
                   
                }
              }catch(err){
                reject(err);
              }
          });
      });
      
      

   }


   static apiAuthenticate(params){
      
      var model = this.name.toLocaleLowerCase()+'s';
      var keys = Object.keys(params);
      var query1 = '';
      var prop = 0;
      var password = '';
      
      for(prop in keys){
         if(keys[1] != 'password'){
             throw 'require password as the second parameter';
         }else{
            password = params['password'];
           if(prop != 1){
            if(prop == 0){
               query1 += `${keys[prop]} = "${params[keys[prop]]}"`;
            }else{
               query1 += `AND ${keys[prop]} = "${params[keys[prop]]}"`;
            }
           }
            
         }
      }
      
      if(Connection.state === 'disconnected'){
         Connection.connect();
       }

      var query = `SELECT * FROM ${model} WHERE ${query1} LIMIT 1` ;

      console.log(query);
      return new Promise((resolve,reject)=>{
         Connection.query(query,(err,rows,fields)=>{
             
              try{
               if(err){
                  reject(err);
                }else{
                   if(rows.length > 0){
                      if(bcrypt.compareSync(password,rows[0]['password'])){
                        resolve(rows[0]);
                      }else{
                        resolve(null);
                      }
                   }else{
                     resolve(null);
                   }
                   
                }
              }catch(err){
                reject(err);
              }
          });
      });
      
      

   }




  
  


}



module.exports = Model;

