var express = require('express');
var router = express.Router();

router.get('/data',function(req,res){
    var result = "";
    var url = "https://maps.googleapis.com/maps/api/place/radarsearch/json?location=42.366029,-71.085838&radius=800&types=restaurant|bakery|bar|cafe&key=AIzaSyCP-j5RWqQPLnhUXt3P4RdUMVqpkz_VKxI";
    https.get(url, function(response) {
        response.on('data', function(data) {
            result += data.toString();
        });
        response.on('end', function() {
            res.send(result);
            res.end();
        });
    });
});

router.get('/',function(req,res,next){
    res.render('index');
    res.end();
});

/* GET login page. */
// router.get('/login', function(req, res) {
//   console.log(req.session.currentUser);
//   if (req.session.currentUser) {
//     res.redirect("/");
//   }
//   else {
//     res.render('login', { title: 'Login' });
//   }  
// });




module.exports = router;
