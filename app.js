<<<<<<< HEAD
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async ctx => {
	ctx.body = 'Hello World!!!'
});

app.listen(3000);
=======
const fs = require('fs');
const http = require('http');
//const axios = require('axios');
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
>>>>>>> d15bb0bc0157bcbe05aabf2f7a621709a696ee05
