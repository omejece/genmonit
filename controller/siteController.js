
const EventEmitter = require('events')

class SiteController extends EventEmitter{
  
   static index(req, res, next){
        res.render('index', { title: 'my' });
    }

   

}

module.exports = SiteController;