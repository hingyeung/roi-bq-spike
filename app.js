var express = require("express")
  , http = require('http')
  , roi = require('./routes/roi');
 
var app = express();
app.use(express.logger());

// Configuration

app.configure(function(){
  app.set('port', process.env.VCAP_APP_PORT || 3000);
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
app.get('/roi/10RandomBusinessNames', roi.getTenRandomBusinessNames);
app.get('/roi/impressions/channel/:businessName', roi.getRecentImpressionsForBusinessPerChannel);
app.get('/roi/interactions/channel/:businessName', roi.getRecentInteractionsForBusinessPerChannel);
app.get('/roi/impressions/average/channel', roi.getAverageImpressionsPerChannel);
app.get('/roi/interactions/average/channel', roi.getAverageInteractionsPerChannel);
app.get('/roi/interactions/:businessName/:book/:year/:month', roi.getInteractionForBusinessByBook);
app.get('/roi/interactions/:businessName/:book', roi.getRecentInteractionsForBusinessByBook);
app.get('/roi/interactions/:businessName', roi.getRecentInteractionsForBusiness);
app.get('/roi/interactionsPerBook/:businessName/:state/:year/:month', roi.getInteractionsPerBook);
app.get('/roi/impressionsPerChannel/:businessName/:book/:year/:month', roi.getImpressionsPerChannelByBook);
app.get('/roi/impressions/:businessName/:book', roi.getAllRecentImpressionsForBusinessByBook);
app.get('/roi/impressions/:businessName', roi.getAllRecentImpressionsForBusiness);
app.get('/roi/impressionsPerBook/:businessName/:state/:year/:month', roi.getImpressionsPerBook);
app.get('/roi/searchImpressionLocations/:businessName/:limit', roi.getSearchImpressionsByLocation);
app.get('/roi/searchImpressionTimes/:businessName', roi.getDirectImpressionsByTime);


// var port = process.env.PORT || 5000;
// app.listen(port, function() {
//   console.log("Listening on " + port);
// });

module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
