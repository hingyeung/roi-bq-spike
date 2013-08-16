'use strict'
var https = require('https')
  , fs = require('fs')
  , bigquery = require('google-bigquery')
  , ROI_PROJECT_ID = 'samuelli.net:roispike'
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

exports.getTop10BusinessWithMostActions = function(req, res) {
  bqClient.jobs.query({projId: ROI_PROJECT_ID, query: 'SELECT  repository.url FROM [publicdata:samples.github_nested] LIMIT 10;'}, function(err, resp) {
    if (err) { return console.log(err); }
    console.log(resp);
    res.send('Done');
  });
};

exports.getTenRandomBusinessNames = function(req, res) {
  var names = [];
  for (var idx = 0; idx < 10; idx++) {
    names.push(businessNames[randomBetween(0, businessNames.length - 1)]);
  }
  res.send(names);
};

exports.getAllImpressions = function(req, res) {
  var bussines = req.params.businessName;
  var query = "SELECT business, count(*) as impression_count from [fake_roi_data.direct_impressions, fake_roi_data.search_impressions] WHERE business = " + business + " AND year = 2013 AND month = 8 GROUP BY business"
};

var bigQueryCallback = function(res) {
  return function(err, resp) {
    if (err) {
      console.log(err);
      res.send('Error');
      return;
    }
    console.log(resp);
    res.contentType('application/json');
    res.send(resp);
  };
};

exports.getTopInteractionWithChannelForBusinessByBook = function(req, res) {
  var businessName = req.params.businessName
    , book = req.params.book
    , year = req.params.year
    , month = req.params.month
    , query = 'select channel, action, count(action) as action_count ' +
      ' from fake_roi_data.actions ' +
      ' where business = "' + businessName + '"' +
      ' and book = "' + book + '" ' +
      ' and year = ' + year + ' ' +
      ' and month = ' + month + ' ' +
      ' group by channel, action ' +
      ' order by action_count desc ' +
      ' limit 15 ';
  console.log(query);

  bqClient.jobs.query({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
}

exports.getAllImpressionsForBusiness = function(req, res) {
  var businessName = req.params.businessName;
  var query = 'select year,month,count(*) as impression_count ' +
    ' from fake_roi_data.direct_impressions,fake_roi_data.search_impressions ' +
    ' where business ="' + businessName + '"' +
    ' group by year,month ' +
    ' order by year,month';
  console.log(query);

  bqClient.jobs.query({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
}

exports.getImpressionsByBook = function(req, res) {
  var businessName = req.params.businessName
    , book = req.params.book
    , year = req.params.year
    , month = req.params.month
    , query = 'select channel, count(channel) as impression_count ' +
        ' from fake_roi_data.search_impressions, fake_roi_data.direct_impressions ' +
        ' where business = "' + businessName + '" ' +
        ' and year = ' + year + ' and month = ' + month + ' ' +
        ' group by channel';
    console.log(query);

    bqClient.jobs.query({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
}

exports.getAllActionsForBusiness = function(req, res) {
  var businessName = req.params.businessName,
  query = 'SELECT year, month, count(action) as action_count from [fake_roi_data.actions] ' +
  ' WHERE business = "' + businessName + '"' +
  ' AND timestamp < CURRENT_TIMESTAMP() and timestamp > DATE_ADD(timestamp, -6, "MONTH")' +
  ' GROUP BY year, month' +
  ' ORDER BY year, month';
  console.log(query);

  bqClient.jobs.query({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};