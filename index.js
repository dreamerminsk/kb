const fs = require('fs');
const http = require('http');
const axios = require('axios');
const superagent = require('superagent');
const cheerio = require('cheerio');
const Datastore = require('nedb');

var db = {};
db.days = new Datastore({filename : 'days.nedb'});
db.days.loadDatabase();
db.days.ensureIndex({ fieldName: 'day', unique: true }, function (err) {
});

superagent.get('http://kinobusiness.com/kassovye_sbory/day/2019/9/')
.end((err, res) => {
  if (err) { return console.log(err); }
  const $ = cheerio.load(res.text);
  $('table.calendar_year tbody tr td:first-child a').each(function() { 
    console.log($(this).text());
    console.log($(this).attr('href'));
	db.days.insert({'day': $(this).text(), 'ref': $(this).attr('href')});
  })
});

db.days.find({}).sort({ ref: 1 }).exec(function (err, docs) {
  docs.forEach(function(doc){
	  console.log(doc);
  });
});;