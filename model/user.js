

var Model = require('./Model');

var Id = null;
var Email = null;
var Username = null;
var Password = null;
var Name = null;
var Apikey = null;


// class fields

class User extends Model{
   constructor(){  
      super();
   }

   

   get id (){return Id;}
   set id (value){Id = value;}
   get email (){return this.Email;}
   set email (value){Email = value;}
   get username (){return Username;}
   set username (value){Username = value;}
   get password (){return Password;}
   set password (value){Password = value;}
   get name (){return Name;}
   set name (value){Name = value;}
   get apikey (){return Apikey;}
   set apikey (value){Apikey = value;}


}

module.exports = User;