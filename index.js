const fs = require('fs');
const http = require('http');
const axios = require('axios');
const superagent = require('superagent');
const cheerio = require('cheerio')

superagent.get('http://kinobusiness.com/kassovye_sbory/day/2019/1/')
.end((err, res) => {
  if (err) { return console.log(err); }
  const $ = cheerio.load(res.text);
  $('table.calendar_year tbody tr').each(function() { 
    console.log($(this).text());
  })
});