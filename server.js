var restify = require('restify');
var request = require('request');
var crypto = require('crypto');


var server = restify.createServer({
  name: 'docker-api',
  version: '1.0.0'
});

// = Middleware
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

// = API: List Machines
server.get('/api/v1/list', function (req, res, next) {

    var apiKeyNew = '70303auc6h8hqutunreio3u8pl';
    var timeStamp = Math.floor(Date.now() / 1000);
    var shared = "adfgo2dqlsv14";
    var newSig = crypto.createHash('md5').update(apiKeyNew + shared + timeStamp).digest("hex");

    var apiKey = 'apiKey=70303auc6h8hqutunreio3u8pl',
        minorRev = 'minorRev=28',
        locale = 'locale=en_US',
        cid = 'cid=490388',
        sig = 'sig='+ newSig +'',

        /*
          * these variables need to be set from the angular call
          * assuming in angular you keep the request but just to /api/v1/list
          * instead and pull the json response from that...duh rest...
        */
        destinationString = 'destinationString=Seattle,WA',
        arrivalDate = 'arrivalDate=10/10/2016',
        departureDate = 'departureDate=10/11/2016',
        room1 = 'room1=2',
        /*
          * just those variables, rest can stay in server side
        */

        currencyCode = 'currencyCode=USD',
        numberOfResults = 'numberOfResults=5',
        url = 'http://api.ean.com/ean-services/rs/hotel/v3/list?'+ apiKey +'&'+ minorRev +'&'+ locale +'&'+ cid +'&'+ sig +'&'+ destinationString +'&'+ arrivalDate +'&'+ departureDate +'&'+ currencyCode +'&'+ numberOfResults +'&'+ room1 +''

    request({url:url, json:true}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //set content type to json for restify to work properly res = restify
            res.send(body);
        }
    });
    return next();
});

// = Start Server
server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
