/**
 * Created by johan on 25/03/15.
 */
//
// Johan Coppieters - jan 2013 - Cody CMS
//

var cody = require('cody');
var express = cody.express;
var path = require("path");

cody.server = express();
var bodyParser = cody.bodyParser;
var expressSession = cody.expressSession;
var multer = cody.multer;

// add i18n
var i18n = cody.i18n;
i18n.configure({
    locales:['zh-cn', 'en'],
    directory: __dirname + '/locales',
    defaultLocale: 'en'
});
cody.server.use(i18n.init);

// use the new 4.x middleware
cody.server.use(bodyParser.json());
cody.server.use(expressSession({secret: 'a secret', cookie: { maxAge: 60*60*1000 }}));
cody.server.use(bodyParser.urlencoded({ extended: true }));
cody.server.use(multer().any());


// startup a routing for all static content of cody (images, javascript, css) if local
if (__dirname.indexOf("Development") != -1) {
  console.log("Starting static cody file server for local development");
  cody.server.get("/cody/static/*", function (req, res) {
      var fileserver = new cody.Static(req, res, "", "");
      fileserver.serve();
  });
}

cody.config = require(path.join(__dirname, "config.json"));
cody.config.controllers = require(path.join(__dirname, "controllers/"));
cody.startWebApp(cody.server, cody.config,
  function() {
    console.log("Loaded " + cody.config.name + " web app....");
    var portNr = cody.config.port;
    cody.server.listen(portNr);
    console.log('Listening on port ' + portNr);
  }
);


if (!process.stderr.isTTY) {
    process.on('uncaughtException', function (err) {
        console.error('Uncaught exception : ' + err.stack);
    });
}
