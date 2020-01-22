const fs = require('fs');
const http = require('http');
const superagent = require('superagent');
const cheerio = require('cheerio');
const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('c://Users//User//YandexDisk//stats//Теннис//funny.stats.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});


superagent.get('https://en.wikipedia.org/wiki/Flags_of_Europe')
    .end((err, res) => {
        if (err) {
            return console.log(err);
        }
        const $ = cheerio.load(res.text);
        $('a[href$=".svg"]').each(function () {
            console.log($(this).attr('href'));
            processFlag($(this).attr('href'));
        })
    });

function processFlag(wiki) {
    link = 'https://en.wikipedia.org' + wiki;
    superagent.get(link)
        .end((err, res) => {
            if (err) {
                return console.log(err);
            }
            const $ = cheerio.load(res.text);
            $('h1.firstHeading').each(function () {
                console.log($(this).text());

            })
        });
}
