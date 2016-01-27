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
        destinationString = 'destinationString=Seattle,WA',
        arrivalDate = 'arrivalDate=10/10/2016',
        departureDate = 'departureDate=10/11/2016',
        currencyCode = 'currencyCode=USD',
        numberOfResults = 'numberOfResults=10',
        room1 = 'room1=2',
        url = 'http://api.ean.com/ean-services/rs/hotel/v3/list?'+ apiKey +'&'+ minorRev +'&'+ locale +'&'+ cid +'&'+ sig +'&'+ destinationString +'&'+ arrivalDate +'&'+ departureDate +'&'+ currencyCode +'&'+ numberOfResults +'&'+ room1 +''

    request({url:url}, function (error, response, body) {
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
