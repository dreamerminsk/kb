const fs = require('fs');
const http = require('http');
const axios = require('axios');
const superagent = require('superagent');
const cheerio = require('cheerio');
var Datastore = require('nedb');

var db = new Datastore({filename : 'users'});
db.loadDatabase();

superagent.get('http://kinobusiness.com/kassovye_sbory/day/2019/2/')
.end((err, res) => {
  if (err) { return console.log(err); }
  const $ = cheerio.load(res.text);
  $('table.calendar_year tbody tr td:first-child a').each(function() { 
    console.log($(this).attr('href'));
  })
});