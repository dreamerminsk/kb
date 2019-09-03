const fs = require('fs');
const http = require('http');
const axios = require('axios');
const superagent = require('superagent');
const cheerio = require('cheerio');

superagent.get('http://kinobusiness.com')
.end((err, res) => {
  if (err) { return console.log(err); }
  console.log(res.text);
});