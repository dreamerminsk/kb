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


superagent.get('https://en.wikipedia.org/wiki/Flags_of_North_America')
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
                let title = $(this).text();
                console.log(title);
                insert(title);
                $('a.mw-thumbnail-link:first-child').each(function () {
                    r = $(this).attr('href');
                    last = r.lastIndexOf('px');
                    first = last;
                    while (r.charAt(first) !== '/') {
                        first = first - 1;
                    }
                    let rpl = '';
                    for (i = first + 1; i < last; i++) {
                        rpl += r.charAt(i);
                    }
                    let ws = [16, 32, 48, 64, 96, 128, 256, 512, 1024];
                    ws.forEach(w => update(title, 'https:' + r.replace(rpl + 'px', w + 'px'), w));
                    console.log(`\t${rpl} - ${r}`);
                });
            });
        });
}

function insert(name) {
    db.run(`INSERT INTO wiki_flags(file, state) VALUES(?, ?)`, [name, name], function (err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
}

function update(name, ref, w) {
    superagent.get(ref)
        .end((err, res) => {
            if (err) {
                return console.log(err);
            }
            db.run(`UPDATE wiki_flags SET flag${w}=? WHERE file=?`, [res.body, name], function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`A row has been updated ${name}`);
            });
        });
}
