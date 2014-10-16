
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'caltrain' })
  tweets =req.app.get('tweets');
};



