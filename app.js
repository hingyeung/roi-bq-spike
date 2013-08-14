var express = require("express")
  , roi = require('./routes/roi');
 
var app = express();
app.use(express.logger());

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/app');
  //app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/app'));
  app.use(app.router);
  app.engine('html', require('ejs').renderFile);
});

app.get('/', function(request, response) {
  response.render('index.html')
});
app.get('/roi/list/datasets', roi.listDatasets);
app.get('/roi/top10actions', roi.getTop10BusinessWithMostActions);
app.get('/roi/10RandomBusinessNames', roi.getTenRandomBusinessNames);
app.get('/roi/allActions/:businessName', roi.getAllActionsForBusiness);
app.get('/roi/allImpressions/:businessName', roi.getAllImpressionsForBusiness);


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
