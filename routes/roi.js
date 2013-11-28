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

exports.getTenRandomBusinessNames = function(req, res) {
  var names = [];
  for (var idx = 0; idx < 10; idx++) {
    names.push(businessNames[randomBetween(0, businessNames.length - 1)]);
  }
  res.send(names);
};

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

exports.getInteractionsPerBook = function(req, res) {
  console.log('getInteractionsPerBook');
  var businessName = req.params.businessName
    , state = req.params.state
    , year = req.params.year
    , month = req.params.month
    , query = 'select book, action, count(action) as action_count ' +
      ' from ' + DATA_SET + '.actions ' +
      ' where business = "' + businessName + '"' +
      ' and state = "' + state + '" ' +
      ' and year = ' + year + ' ' +
      ' and month = ' + month + ' ' +
      ' and action in ("EUC", "MIC", "PAC", "STM") ' +
      ' group by book, action ' +
      ' order by book, action'
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
}

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

exports.getRecentInteractionsForBusiness = function(req, res) {
  console.log('getRecentInteractionsForBusiness');
  var toDate = new Date()
    , fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 6);

  var businessName = req.params.businessName
    , query = 'SELECT year, month, count(action) as action_count from [' + DATA_SET + '.actions]' +
    ' WHERE business = "' + businessName + '" ' +
    ' AND timestamp >= TIMESTAMP("' + fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-01") ' +
    ' AND timestamp < TIMESTAMP("' + toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-01") ' +
    ' GROUP BY year, month ' +
    ' ORDER BY year, month';
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

exports.getImpressionsPerBook = function(req, res) {
  var businessName = req.params.businessName
    , state = req.params.state
    , year = req.params.year
    , month = req.params.month
    , query = 'select book, count(book) as impression_count ' +
        ' from ' + DATA_SET + '.search_impressions, ' + DATA_SET + '.direct_impressions ' +
        ' where business = "' + businessName + '" ' +
        ' and state = "' + state + '" ' +
        ' and year = ' + year + ' and month = ' + month + ' ' +
        ' group by book order by book';
    console.log(query);

    bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
}

exports.getAllRecentImpressionsForBusiness = function(req, res) {
  console.log('getAllRecentImpressionsForBusiness');
  var toDate = new Date()
    , fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 6);

  var businessName = req.params.businessName
    , query = 'select year, month, count(*) as impression_count ' +
    ' from ' + DATA_SET + '.direct_impressions,' + DATA_SET + '.search_impressions ' +
    ' where business ="' + businessName + '"' +
    ' AND timestamp >= TIMESTAMP("' + fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-01") ' +
    ' AND timestamp < TIMESTAMP("' + toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-01") ' +
    ' GROUP BY year, month ' +
    ' ORDER BY year, month';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};


//select ssub, count(ssub) as impression_count  from [12months_fake_roi_data_20131127.fake_search_impressions_2013_11]  where timestamp >= TIMESTAMP("2013-5-01")  AND timestamp < TIMESTAMP("2013-11-01")  GROUP BY ssub ORDER BY ssub

exports.getSearchImpressionsByLocation = function(req, res) {
  console.log('getSearchImpressionsByLocation');
  var toDate = new Date()
    , fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 6);

  var businessName = req.params.businessName
    , query = 'select ssub, count(ssub) as impression_count ' +
    ' from ' +
           '[12months_fake_roi_data_20131127.fake_search_impressions_2013_1]' +
          ',[12months_fake_roi_data_20131127.fake_search_impressions_2013_2]' +
          ',[12months_fake_roi_data_20131127.fake_search_impressions_2013_3]' +
          ',[12months_fake_roi_data_20131127.fake_search_impressions_2013_4]' +
          ',[12months_fake_roi_data_20131127.fake_search_impressions_2013_5]' +
          ',[12months_fake_roi_data_20131127.fake_search_impressions_2013_6]' +
          ',[12months_fake_roi_data_20131127.fake_search_impressions_2013_7]' +
          ',[12months_fake_roi_data_20131127.fake_search_impressions_2013_8]' +
          ',[12months_fake_roi_data_20131127.fake_search_impressions_2013_9]' +
          ',[12months_fake_roi_data_20131127.fake_search_impressions_2013_10]' +
          ',[12months_fake_roi_data_20131127.fake_search_impressions_2013_11]' +
          ',[12months_fake_roi_data_20131127.fake_search_impressions_2013_12]' +
    ' where business ="' + businessName + '"' +
    ' AND timestamp >= TIMESTAMP("' + fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-01") ' +
    ' AND timestamp < TIMESTAMP("' + toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-01") ' +
    ' GROUP BY ssub' +
    ' ORDER BY impression_count desc' +
    ' LIMIT 8';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};

exports.getAllRecentImpressionsForBusinessByBook = function(req, res) {
  console.log('getAllRecentImpressionsForBusinessByBook');
  var toDate = new Date()
    , fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 6);

  var businessName = req.params.businessName
    , book = req.params.book
    , query = 'select year, month, count(*) as impression_count ' +
    ' from ' + DATA_SET + '.direct_impressions,' + DATA_SET + '.search_impressions ' +
    ' where business ="' + businessName + '"' +
    ' AND book = "' + book + '" ' +
    ' AND timestamp >= TIMESTAMP("' + fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-01") ' +
    ' AND timestamp < TIMESTAMP("' + toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-01") ' +
    ' GROUP BY year, month ' +
    ' ORDER BY year, month';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};
