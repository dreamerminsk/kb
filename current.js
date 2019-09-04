const superagent = require('superagent');
const cheerio = require('cheerio');
const Datastore = require('nedb');

var db = {};
db.current = new Datastore({filename : 'current.nedb'});
db.current.loadDatabase();
//db.days.ensureIndex({ fieldName: 'day', unique: true }, function (err) {
//});

superagent.get('http://kinobusiness.com/kassovye_sbory/films_year/')
.end((err, res) => {
  if (err) { return console.log(err); }
  const $ = cheerio.load(res.text);
  $('table.calendar_year tbody tr').each(function() { 
    console.log('---------------------');
	//console.log($(this).children());
	var my = {};
	$(this).children().each(function(i, elem){
		if (i == 0) my.pos = $(this).text();
		if (i == 1) my.title = $(this).text();
		if (i == 2) my.original = $(this).text();
		if (i == 3) my.distributor = $(this).text();
		if (i == 4) my.screens = parseInt($(this).text().replace(/\s/g,''));
		if (i == 5) my.total_rur = parseInt($(this).text().replace(/\s/g,''));
		if (i == 6) my.total_usd = parseInt($(this).text().replace(/\s/g,''));
		if (i == 7) my.spectaculars = parseInt($(this).text().replace(/\s/g,''));
		if (i == 8) my.days = parseInt($(this).text().replace(/\s/g,''));
		console.log(`[${ elem.name }:${ i }] ${ $(this).text() }`);		
	});
	console.log(my);
    //console.log($(this).attr('href'));
	//db.days.insert({'day': $(this).text(), 'ref': $(this).attr('href')});
  })
});

//db.current.find({}).sort({ ref: 1 }).exec(function (err, docs) {
//  docs.forEach(function(doc){
//	  console.log(doc);
//  });
//});;