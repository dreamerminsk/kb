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
	$(this).children().each(function(){
		console.log(`[${ $(this) }] ${ $(this).text() }`);
	});
    //console.log($(this).attr('href'));
	//db.days.insert({'day': $(this).text(), 'ref': $(this).attr('href')});
  })
});

//db.current.find({}).sort({ ref: 1 }).exec(function (err, docs) {
//  docs.forEach(function(doc){
//	  console.log(doc);
//  });
//});;