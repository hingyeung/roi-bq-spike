'use strict'
var https = require('https')
  , fs = require('fs')
  , bigquery = require('google-bigquery')
  , ROI_PROJECT_ID = 'samuelli.net:roispike'
  , DATA_SET = '12months_fake_roi_data_20131127'
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

  var ACTION_TABLES = [],
      DIRECT_IMPRESSION_TABLES = [],
      SEARCH_IMPRESSION_TABLES = [],
      BUSINESS_DETAILS_TABLE;

  for (var i = 1; i < 12; i++) {
    ACTION_TABLES.push('[' + DATA_SET + '.fake_actions_2013_' + i + ']');
    DIRECT_IMPRESSION_TABLES.push('[' + DATA_SET + '.fake_direct_impressions_2013_' + i +']');
    SEARCH_IMPRESSION_TABLES.push('[' + DATA_SET + '.fake_search_impressions_2013_' + i + ']');
  }
  ACTION_TABLES = ACTION_TABLES.join(',');
  DIRECT_IMPRESSION_TABLES = DIRECT_IMPRESSION_TABLES.join(',');
  SEARCH_IMPRESSION_TABLES = SEARCH_IMPRESSION_TABLES.join(',');
  BUSINESS_DETAILS_TABLE = '[' + DATA_SET + '.business_details]';

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

exports.getCaptionSizeVsAppearance = function(req, res) {
  var query =
    'select bd.size as caption_size, count(*) as appearance_count ' +
      'from ' +
      '( ' +
      'select business, count(*) from ' + SEARCH_IMPRESSION_TABLES + ' ' +
      ' group by business ' +
      ') as si ' +
    'join ' +
    BUSINESS_DETAILS_TABLE + ' as bd ' +
    'on bd.name = si.business ' +
    'group by caption_size ' +
    'order by caption_size';

    console.log(query);

    bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};

exports.getInteractionsPerBook = function(req, res) {
  console.log('getInteractionsPerBook');
  var businessName = req.params.businessName
    , state = req.params.state
    , year = req.params.year
    , month = req.params.month
    , query = 'select book, action, count(action) as action_count ' +
      ' from ' + ACTION_TABLES +
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
      ' from ' + ACTION_TABLES +
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
    , query = 'SELECT year, month, action, count(action) as action_count ' +
    ' from ' + ACTION_TABLES +
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
    , query = 'SELECT year, month, day, count(action) as action_count ' +
    ' from ' + ACTION_TABLES +
    ' WHERE business = "' + businessName + '" ' +
    ' AND timestamp >= TIMESTAMP("' + fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-01") ' +
    ' AND timestamp < TIMESTAMP("' + toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-01") ' +
    ' GROUP BY year, month, day ' +
    ' ORDER BY year, month, day';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};

exports.getRecentImpressionsForBusinessPerChannel = function(req, res) {
  console.log('getRecentImpressionsForBusinessByChannel');

  var toDate = new Date()
    , fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 6);

  var businessName = req.params.businessName
    , query = 'SELECT year, month, day, channel, count(1) as impression_count ' +
    ' from ' + SEARCH_IMPRESSION_TABLES + ', ' + DIRECT_IMPRESSION_TABLES +
    ' WHERE business = "' + businessName + '" ' +
    ' AND channel in ("MOB", "WP") ' +
    ' AND timestamp >= TIMESTAMP("' + fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-01") ' +
    ' AND timestamp < TIMESTAMP("' + toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-01") ' +
    ' GROUP BY year, month, day, channel ' +
    ' ORDER BY year, month, day, channel';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};

exports.getImpressionsPerChannelByBook = function(req, res) {
  var businessName = req.params.businessName
    , book = req.params.book
    , year = req.params.year
    , month = req.params.month
    , query = 'select channel, count(channel) as impression_count ' +
        ' from ' + SEARCH_IMPRESSION_TABLES + ', ' + DIRECT_IMPRESSION_TABLES +
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
        ' from ' + SEARCH_IMPRESSION_TABLES + ', ' + DIRECT_IMPRESSION_TABLES +
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
    , query = 'select year, month, day, count(*) as impression_count ' +
    ' from ' + SEARCH_IMPRESSION_TABLES + ', ' + DIRECT_IMPRESSION_TABLES +
    ' where business ="' + businessName + '"' +
    ' AND timestamp >= TIMESTAMP("' + fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-01") ' +
    ' AND timestamp < TIMESTAMP("' + toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-01") ' +
    ' GROUP BY year, month, day ' +
    ' ORDER BY year, month, day';
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
    ' from ' + SEARCH_IMPRESSION_TABLES + ', ' + DIRECT_IMPRESSION_TABLES +
    ' where business ="' + businessName + '"' +
    ' AND book = "' + book + '" ' +
    ' AND timestamp >= TIMESTAMP("' + fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-01") ' +
    ' AND timestamp < TIMESTAMP("' + toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-01") ' +
    ' GROUP BY year, month ' +
    ' ORDER BY year, month';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};
