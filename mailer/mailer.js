
const nodemailer = require('nodemailer');
const EmailConfig = require('../config/emailConfig');

class Mailer{


    constructor(){}

     static send(to,subject,message){
       var transporter = nodemailer.createTransport(
            EmailConfig.config
         );

         var mailOptions = {
            from: EmailConfig.config.auth.user,
            to: to,
            subject: subject,
            text: message
          };

         transporter.sendMail(mailOptions, function(error, info){
            return new Promise((resolved,reject)=>{
                if (error) {
                      reject(error);
                    } 
                    else {
                        resolve('Email sent: ' + info.response);
                    }
                })
                
          });
     }


}

module.exports = Mailer;