const fetch = require('node-fetch');
const sqlite3 = require('sqlite3').verbose();
const cheerio = require('cheerio');

let db = new sqlite3.Database('c://Users//User//YandexDisk//stats//Теннис//funny.stats.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});

async function fetchAsync(url) {
    //await sleep(1000);
    let response = await fetch(url)
    if (response.ok) return await response.text()
    throw new Error(response.status)
}

async function fetchPic(url) {
    //await sleep(1000);
    let response = await fetch(url)
    if (response.ok) return await response.blob()
    throw new Error(response.status)
}

fetchAsync('https://en.wikipedia.org/wiki/Flags_of_country_subdivisions')

    .then(data => {
        const $ = cheerio.load(data);
        $('a[href$=".svg"]').each(async function () {
            console.log($(this).attr('href'));
            await processFlag($(this).attr('href'));
        })
    })

    .catch(error => console.error(error));

async function processFlag(wiki) {
    link = 'https://en.wikipedia.org' + wiki;
    fetchAsync(link)

        .then(data => {
            const $ = cheerio.load(data);
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
                    ws.forEach(async w => await update(title, 'https:' + r.replace(rpl + 'px', w + 'px'), w));
                    console.log(`\t${rpl} - ${r}`);
                });
            });
        })

        .catch(error => console.error(error));
}

function insert(name) {
    db.run(`INSERT INTO wiki_flags(file, state) VALUES(?, ?)`, [name, name], function (err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
}

async function update(name, ref, w) {
    data = await fetchPic(ref);
    db.run(`UPDATE wiki_flags SET flag${w}=? WHERE file=?`, [data, name], function (err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`A row has been updated ${name} - ${w}`);
    });
}

function sleep(time) {
    console.log(`wait ${time}`);
    return new Promise((resolve) => setTimeout(resolve, time));
}
