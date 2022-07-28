const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express();

const newspapers = [
    {
        name: 'thebusinessstandard',
        address: 'https://www.tbsnews.net/bangladesh/environment/climate-change',
        base: 'https://www.tbsnews.net/'
    },
    {
        name: 'thedailystar',
        address: 'https://www.thedailystar.net/environment/climate-change',
        base: 'https://www.thedailystar.net'
    },
    {
        name: 'dhakatribune',
        address: 'https://www.dhakatribune.com/articles/climate-change',
        base: 'https://www.dhakatribune.com'
    },
    {
        name: 'newage',
        address: 'https://www.newagebd.net/tags/climate',
        base: ''
    },
    {
        name: 'prothomalo',
        address: 'https://en.prothomalo.com/environment/climate-change/',
        base: ''
    },
    {
        name: 'observerbd',
        address: 'https://www.observerbd.com/cat.php?cd=1&key=Climate%20change',
        base: 'https://www.observerbd.com'
    },
    {
        name: 'thebangladeshtoday',
        address: 'https://thebangladeshtoday.com/?cx=&cof=FORID%3A10&ie=utf-8&post_type=post&s=climate+change&sa=',
        base: 'https://thebangladeshtoday.com/'
    },
    {
        name: 'dhakacourier',
        address: 'https://dhakacourier.com.bd/search?search=climate+change',
        base: ''
    }
];

const articles = [];

//searching keywords for each newspapers
newspapers.forEach((newspaper) => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        }).catch((err) => console.log(err));
})

//homepage
app.get('/', (req, res) => {
    res.json('Welcome to The Climate Change News From Bangladeshi Newspapers API')
});

//calling all news paper articles relatefd to keywords
app.get('/news', (req, res) => {
    res.json(articles)
});

//calling only specific newspapers
app.get('/news/:newspaperID', (req, res) => {
    const newspaperID = req.params.newspaperID;

    const newspaperaddress = newspapers.filter(newspaper => newspaper.name === newspaperID)[0].address;
    const newspaperBase = newspapers.filter(newspaper => newspaper.name === newspaperID)[0].base;

    axios.get(newspaperaddress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const specificarticles = [];

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');
                specificarticles.push({
                    title,
                    url: newspaperBase + url
                })
            })
            res.json(specificarticles)
        }).catch((err) => console.log(err))
})
app.listen(PORT, () => { console.log(`server running on Port ${PORT}`) });

