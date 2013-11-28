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
      SEARCH_IMPRESSION_TABLES = [];
  for (var i = 1; i < 12; i++) {
    ACTION_TABLES.push('[' + DATA_SET + '.fake_actions_2013_' + i + ']');
    DIRECT_IMPRESSION_TABLES.push('[' + DATA_SET + '.fake_direct_impressions_2013_' + i +']');
    SEARCH_IMPRESSION_TABLES.push('[' + DATA_SET + '.fake_search_impressions_2013_' + i + ']');
  }
  ACTION_TABLES.join(',');
  DIRECT_IMPRESSION_TABLES.join(',');
  SEARCH_IMPRESSION_TABLES.join(',');

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
    // console.log(resp);
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

  var businessName = req.params.businessName
    , query = 'SELECT year, month, day, count(action) as action_count ' +
    ' from ' + ACTION_TABLES +
    ' WHERE business = "' + businessName + '" ' +
    ' GROUP BY year, month, day ' +
    ' ORDER BY year, month, day';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};

exports.getRecentInteractionsForBusinessPerChannel = function(req, res) {
  console.log('getRecentInteractionsForBusinessByChannel');

  var businessName = req.params.businessName
    , query = 'SELECT year, month, day, channel, count(1) as action_count ' +
    ' from ' + ACTION_TABLES +
    ' WHERE business = "' + businessName + '" ' +
    ' AND channel in ("MOB", "WP") ' +
    ' GROUP BY year, month, day, channel ' +
    ' ORDER BY year, month, day, channel';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};

exports.getAverageInteractionsPerChannel = function(req, res) {
  console.log('getAverageInteractionsPerChannel');

  var query = 'SELECT year, month, day, channel, avg(actions) average_interactions' +
    ' FROM ( ' +
      ' SELECT business, year, month, day, channel, count(1) as actions ' +
      ' FROM ' + ACTION_TABLES + 
      ' WHERE channel in ("MOB", "WP") ' +
      ' GROUP BY channel, business, year, month, day) ' +
    ' GROUP BY channel, year, month, day ' +
    ' ORDER BY channel, year, month, day';
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
    ' GROUP BY year, month, day, channel ' +
    ' ORDER BY year, month, day, channel';
  console.log(query);

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
};

exports.getAverageImpressionsPerChannel = function(req, res) {
  console.log('getAverageImpressionsByChannel');

  var query = 'SELECT year, month, day, channel, avg(impressions) average_impressions' +
    ' FROM ( ' +
      ' SELECT business, year, month, day, channel, count(1) as impressions ' +
      ' FROM ' + SEARCH_IMPRESSION_TABLES + ', ' + DIRECT_IMPRESSION_TABLES + 
      ' WHERE channel in ("MOB", "WP") ' +
      ' GROUP BY channel, business, year, month, day) ' +
    ' GROUP BY channel, year, month, day ' +
    ' ORDER BY channel, year, month, day';
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


/*select ssub, state, count(ssub) search_count
from [12months_fake_roi_data_20131127.fake_search_impressions_2013_11]
where business == 'Mobil Oil Australia'
group by ssub, state
order by search_count desc*/

exports.getSearchImpressions = function(req, res) {
  var businessName = req.params.businessName
    , query = 'select ssub as suburb, count(ssub) as impression_count ' +
    ' from ' + SEARCH_IMPRESSION_TABLES +
    ' where business ="' + businessName + '"' +
    ' GROUP BY suburb' +
    ' ORDER BY impression_count desc' +
    ' LIMIT 1000';

  bqClient.jobs.syncQuery({projId: ROI_PROJECT_ID, query: query}, bigQueryCallback(res));
}

exports.getSearchImpressionsByLocation = function(req, res) {
  console.log('getSearchImpressionsByLocation');
  var businessName = req.params.businessName,
      limit = req.params.limit,
      query = 'select ssub as suburb, count(ssub) as impression_count ' +
    ' from ' + SEARCH_IMPRESSION_TABLES +
    ' where business ="' + businessName + '"' +
    ' GROUP BY suburb' +
    ' ORDER BY impression_count desc' +
    ' LIMIT ' + limit;
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
