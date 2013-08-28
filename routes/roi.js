'use strict'
var https = require('https')
  , fs = require('fs')
  , bigquery = require('google-bigquery')
  , ROI_PROJECT_ID = 'samuelli.net:roispike'
  , DATA_SET = 'fake_roi_data'
  , bqClient = bigquery({
        "iss": '361723984999@developer.gserviceaccount.com',
        "key": fs.readFileSync('roi-spike-privatekey.pem', 'utf8')
    });

  var randomBetween = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var businessNames;
  // read business name file
  fs.readFile('data/business_names.csv', function(err, data) {
    if (err) {
      console.log('Error: failed to read business_names.csv');
      return;
    }

    businessNames = data.toString().split("\n");
  });


    // bqClient.getProjects(function (err, projs) {
    //     console.log(projs.projects); //list of projects.
    // });

    // bqClient.tables.create({... your table resource ...}, function (err, table){
    //     console.log(table);
    //     console.log(table.tableReference.tableId); //table's id.
    // });

exports.listDatasets = function(req, res){
  bqClient.datasets.getAll(ROI_PROJECT_ID, function(err, datasets) {
    console.log(datasets);
  });
};

exports.getTenRandomBusinessNames = function(req, res) {
  var names = [];
  for (var idx = 0; idx < 10; idx++) {
    names.push(businessNames[randomBetween(0, businessNames.length - 1)]);
  }
  res.send(names);
};

// exports.getAllImpressions = function(req, res) {
//   var bussines = req.params.businessName;
//   var query = "SELECT business, count(*) as impression_count from [' + DATA_SET + '.direct_impressions, ' + DATA_SET + '.search_impressions] WHERE business = " + business + " AND year = 2013 AND month = 8 GROUP BY business"
// };

var bigQueryCallback = function(res) {
  return function(err, resp) {
    if (err) {
      console.log(err);
      res.contentType('application/json');
      res.send(err);
      return;
    }
    console.log(resp);
    res.contentType('application/json');
    res.send(resp);
  };
};

// exports.getTopInteractionWithChannelForBusinessByBook = function(req, res) {
//   var businessName = req.params.businessName
//     , book = req.params.book
//     , year = req.params.year
//     , month = req.params.month
//     , query = 'select channel, action, count(action) as action_count ' +
//       ' from ' + DATA_SET + '.actions ' +
//       ' where business = "' + businessName + '"' +
//       ' and book = "' + book + '" ' +
//       ' and year = ' + year + ' ' +
//       ' and month = ' + month + ' ' +
//       ' group by channel, action ' +
//       ' order by action_count desc ' +
//       ' limit 15 ';
//   console.log(query);

//   bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
// };

exports.getInteractionForBusinessByBook = function(req, res) {
  console.log('getInteractionForBusinessByBook');
  var businessName = req.params.businessName
    , book = req.params.book
    , year = req.params.year
    , month = req.params.month
    , query = 'select action, count(action) as action_count ' +
      ' from ' + DATA_SET + '.actions ' +
      ' where business = "' + businessName + '"' +
      ' and book = "' + book + '" ' +
      ' and year = ' + year + ' ' +
      ' and month = ' + month + ' ' +
      ' group by action ';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};

exports.getRecentInteractionsForBusinessByBook = function(req, res) {
  console.log('getRecentInteractionsForBusinessByBook');
  var toDate = new Date()
    , fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 6);

  var businessName = req.params.businessName
    , book = req.params.book
    , query = 'SELECT year, month, action, count(action) as action_count from [' + DATA_SET + '.actions]' +
    ' WHERE business = "' + businessName + '" ' +
    ' AND book = "' + book + '" ' +
    ' AND timestamp >= TIMESTAMP("' + fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-01") ' +
    ' AND timestamp < TIMESTAMP("' + toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-01") ' +
    ' GROUP BY year, month, action ' +
    ' ORDER BY year, month';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};

exports.getAllImpressionsForBusiness = function(req, res) {
  var businessName = req.params.businessName;
  var query = 'select year,month,count(*) as impression_count ' +
    ' from ' + DATA_SET + '.direct_impressions,' + DATA_SET + '.search_impressions ' +
    ' where business ="' + businessName + '"' +
    ' group by year,month ' +
    ' order by year,month';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
}

exports.getImpressionsByBook = function(req, res) {
  var businessName = req.params.businessName
    , book = req.params.book
    , year = req.params.year
    , month = req.params.month
    , query = 'select channel, count(channel) as impression_count ' +
        ' from ' + DATA_SET + '.search_impressions, ' + DATA_SET + '.direct_impressions ' +
        ' where business = "' + businessName + '" ' +
        ' and year = ' + year + ' and month = ' + month + ' ' +
        ' group by channel';
    console.log(query);

    bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};

exports.getImpressionsPerChannelByBook = function(req, res) {
  var businessName = req.params.businessName
    , book = req.params.book
    , year = req.params.year
    , month = req.params.month
    , query = 'select channel, count(channel) as impression_count ' +
        ' from ' + DATA_SET + '.search_impressions, ' + DATA_SET + '.direct_impressions ' +
        ' where business = "' + businessName + '" ' +
        ' and book = "' + book + '" ' +
        ' and year = ' + year + ' and month = ' + month + ' ' +
        ' group by channel';
    console.log(query);

    bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};

exports.getAllActionsForBusiness = function(req, res) {
  var businessName = req.params.businessName,
  query = 'SELECT year, month, count(action) as action_count from [' + DATA_SET + '.actions] ' +
  ' WHERE business = "' + businessName + '"' +
  ' AND timestamp < CURRENT_TIMESTAMP() and timestamp > DATE_ADD(timestamp, -6, "MONTH")' +
  ' GROUP BY year, month' +
  ' ORDER BY year, month';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};

exports.getActionCount = function(req, res) {
  var query = 'SELECT count(*) from fake_roi_data.actions';
  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};