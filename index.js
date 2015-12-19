
var uuid = require('node-uuid');
var express    = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

//TODO add the following method
/**
 * On all requests add headers
 */
app.all('*', function(req, res,next) {

  console.log("Client at: " + req.headers.origin + " method: " + req.method);
  console.log("req.headers: " + JSON.stringify(req.headers));

  /**
   * Response settings
   * @type {Object}
   */
  var responseSettings = {
    "AccessControlAllowOrigin": req.headers.origin,
    "AccessControlAllowHeaders": "origin, content-type, accept",
    //Set the header name to pass the secretkey
    "AccessControlExposeHeaders": "secretkey"
  };

  /**
   * Headers
   */
  res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
  res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
  res.header("Access-Control-Expose-Headers", responseSettings.AccessControlExposeHeaders);

  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }

});

app.get('/Ping', function (req, res) {
  res.send('Pong');
});

app.post('/login', function (req, res) {

  if(req.body.username == null ||
    req.body.password == null)
    {
      res.status(500);
      res.send('Username & Password are required.')
    }
    else
    {
      //TODO change res.set('secretkey',uuid.v4()); to the following
      var toke = uuid.v4();
      console.log("secretkey: " + toke);
      res.header("secretkey", toke);
      res.send('');
    }
  });

  app.get('/playlists', function (req, res) {

    console.log("req.headers.secretkey: " + req.headers.secretkey);

    if(req.headers.secretkey == null)
    {
      res.status(500);
      res.send('Security Check Failed!')
    }
    else
    {
      var items =
      [{ title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }];
      res.send(JSON.stringify(items));
    }
  });

  var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('YES this is the Example app listening at http://%s:%s', host, port);
  });


/* complete example
app.all('*', function(req, res,next) {

  console.log("Client at: " + req.headers.origin + " method: " + req.method);

  var responseSettings = {
    "AccessControlAllowOrigin": req.headers.origin,
    "AccessControlAllowHeaders": "Content-Type,X-CSRF-secretkey, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",//, secretkey",
    "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
    "AccessControlAllowCredentials": true,
    "AccessControlExposeHeaders": "secretkey"
  };

  res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
  res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
  res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
  res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);
  res.header("Access-Control-Expose-Headers", responseSettings.AccessControlExposeHeaders);

  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }

});
*/