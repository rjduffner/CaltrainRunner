
/*
 * GET home page.
 */

exports.index = function(req, res){

  res.render('index', { title: 'Caltrain Runner' , tweets:req.app.get('tweets')})
};



