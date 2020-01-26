const fetch = require('node-fetch');
const sqlite3 = require('sqlite3').verbose();
const rt = require('rate-limiter-flexible');
const cheerio = require('cheerio');

console.log(cheerio);
const opts = {
    points: 20, // 6 points
    duration: 60, // Per second
};

const rateLimiter = new rt.RateLimiterMemory(opts);


let db = new sqlite3.Database('c://Users//User//YandexDisk//stats//Теннис//funny.stats.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});

async function fetchAsync(url) {
    //await sleep(1);
    let response = await fetch(url)
    if (response.ok) return await response.text()
    throw new Error(response.status)
}

async function fetchPic(url) {
    //await sleep(10);
    let response = await fetch(url)
    if (response.ok) return await response.blob()
    throw new Error(response.status)
}

fetchAsync('https://en.wikipedia.org/wiki/Flags_of_country_subdivisions')

    .then(data => {
        const $ = cheerio.load(data);
        $('a[href$=".svg"]').each(function () {
            console.log($(this).attr('href'));
            processFlag($(this).attr('href'));
        })
    })

    .catch(error => console.error(error));

function processFlag(wiki) {
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
                    ws.forEach(w => update(title, 'https:' + r.replace(rpl + 'px', w + 'px'), w));
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

function update(name, ref, w) {
    fetchPic(ref)

        .then(data => {
            db.run(`UPDATE wiki_flags SET flag${w}=? WHERE file=?`, [data, name], function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`A row has been updated ${name} - ${w}`);
            });
        })

        .catch(error => console.error(error));
}

function sleep(time) {
    console.log(`wait ${time}`);
    return new Promise((resolve) => setTimeout(resolve, time));
}
