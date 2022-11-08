const PORT = 8000;
const express = require('express');
const axios = require('axios').default;
const cheerio = require('cheerio');
const app = express();

//Sources for NFL teams
const apiSources = [
    {division:"afc", teams:[
        {name:"baltimore-ravens", link:"https://www.baltimoreravens.com/rss/news"},
        {name:"buffalo-bills", link:"https://www.buffalobills.com/rss/news"},
        {name:"cincinnati-bengals", link:"https://www.bengals.com/rss/news"},
        {name:"cleveland-browns", link:"https://www.clevelandbrowns.com/rss/news"},
        {name:"denver-broncos", link:"https://www.denverbroncos.com/rss/news"},
        {team:"houston-texans", link:"https://www.houstontexans.com/rss/news"},
        {team:"indianapolis-colts", link:"https://www.colts.com/rss/news"},
        {team:"jacksonville-jaguars", link:"https://www.jaguars.com/rss/news"},
        {name:"kansas-city-chiefs", link:"https://www.chiefs.com/rss/news"},
        {name:"las-vegas-raiders", link:"https://www.raiders.com/rss/news"},
        {name:"los-angeles-chargers", link:"https://www.chargers.com/rss/news"},
        {name:"miami-dolphins", link:"https://www.miamidolphins.com/rss/news"},
        {name:"new-england-patriots", link:"https://www.patriots.com/rss/news"},
        {name:"new-york-jets", link:"https://www.newyorkjets.com/rss/news"},
        {name:"pittsburgh-steelers", link:"https://www.steelers.com/rss/news"},
        {team:"tennessee-titans", link:"https://www.tennesseetitans.com/rss/news"}
    ]},
    {division:"nfc", teams:[
        {name:"arizona-cardinals", link:"https://www.azcardinals.com/rss/news"},
        {name:"atlanta-falcons", link:"https://www.atlantafalcons.com/rss/news"},
        {name:"carolina-panthers", link:"https://www.panthers.com/rss/news"},
        {name:"chicago-bears", link:"https://www.chicagobears.com/rss/news"},
        {name:"dallas-cowboys", link:"https://www.dallascowboys.com/rss/news"},
        {name:"detroit-lions", link:"https://www.detroitlions.com/rss/news"},
        {name:"green-bay-packers", link:"https://www.packers.com/rss/news"},
        {name:"los-angeles-rams", link:"https://www.therams.com/rss/news"},
        {name:"minnesota-vikings", link:"https://www.vikings.com/rss/news"},
        {name:"new-orleans-saints", link:"https://www.neworleanssaints.com/rss/news"},
        {name:"new-york-giants", link:"https://www.giants.com/rss/news"},
        {name:"philadelphia-eagles", link:"https://www.philadelphiaeagles.com/rss/news"},
        {name:"san-francisco-49ers", link:"https://www.49ers.com/rss/news"},
        {name:"seattle-seahawks", link:"https://www.seahawks.com/rss/news"},
        {name:"tampa-bay-buccaneers", link:"https://www.buccaneers.com/rss/news"},
        {name:"washington-commanders", link:"https://www.commanders.com/rss/news"}
    ]}
];

//******************* SERVER STARTUP / INTERVAL CALLS ***********************/
//GET ALL NFL news from every website on server startup, then retrieve the news
//again every 6 hours
const allNflArticles = [];
apiSources.forEach((item, index) => {
    item.teams.forEach(async (team, index) => {
        await axios.get(`${team.link}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html, {
                xmlMode: true
            });
    
            $('item').each((i, elem) => {
                const title = $(elem).children('title').text();
                const url = $(elem).children('link').text();
                const pubDate = $(elem).children('pubDate').text();
                const thumbnail = $(elem).children('enclosure').attr('url');
                const author = $(elem).children('creator').text();
                allNflArticles.push({
                    title,
                    author,
                    url,
                    pubDate,
                    thumbnail
                });
            //console.log( i + " article added to allNflArticles array");
            });
    
        })
        .catch((err) => {
        console.log(err);
        });
        //console.log("END OF GET ALL NFL NEWS FOR " + team.name);
    });
});
setInterval(() => {
    allNflArticles.length = 0;
    apiSources.forEach((item, index) => {
        item.teams.forEach(async (team, index) => {
            await axios.get(`${item.link}`)
            .then((response) => {
                const html = response.data;
                const $ = cheerio.load(html, {
                    xmlMode: true
                });
        
                $('item').each((i, elem) => {
                    const title = $(elem).children('title').text();
                    const url = $(elem).children('link').text();
                    const pubDate = $(elem).children('pubDate').text();
                    const thumbnail = $(elem).children('enclosure').attr('url');
                    const author = $(elem).children('creator').text();
                    allNflArticles.push({
                        title,
                        author,
                        url,
                        pubDate,
                        thumbnail
                    });
                //console.log( i + " article added to allNflArticles array");
                });
        
            })
            .catch((err) => {
            console.log(err);
            });
            //console.log("END OF GET ALL NFL NEWS FOR " + team.name);
        });
    });
}, 1000 * 60 * 60 * 6);

//GET division news on server startup, then retrieve the news again every 6 hours
const divisionArticles = [];
apiSources.forEach((item, index) => {
    console.log(item.division);
    var divisionArray = {division: item.division, articles:[]}
    item.teams.forEach(async (team, index) => {
        await axios.get(`${team.link}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html, {
                xmlMode: true
            });

            $('item').each((i, elem) => {
                const title = $(elem).children('title').text();
                const url = $(elem).children('link').text();
                const pubDate = $(elem).children('pubDate').text();
                const thumbnail = $(elem).children('enclosure').attr('url');
                const author = $(elem).children('creator').text();
                divisionArray.articles.push({
                    title,
                    author,
                    url,
                    pubDate,
                    thumbnail
                });
            });
            //Loop through all nfl divisionArticles, convert the pubDate into a Date() object
            for (let i = 0; i < divisionArray.articles.length - 1; i++) {
                let articleDate = new Date(divisionArray.articles[i].pubDate);
                divisionArray.articles[i].pubDate = articleDate;
            }

            //Sort the team's array of divisionArticles by date descending before sending it to res.json
            const sorteddivisionArticlesDesc = divisionArray.articles.sort(
                (objA, objB) => Number(objB.pubDate) - Number(objA.pubDate)
            );

            //Loop through all teams' divisionArticles, convert the pubDate into a readable date
            for (let i = 0; i < divisionArray.articles.length - 1; i++) {
                let dateString = divisionArray.articles[i].pubDate.toDateString();
                let hour = divisionArray.articles[i].pubDate.getHours();
                let minute = String(divisionArray.articles[i].pubDate.getUTCMinutes()).padStart(2, "0");
                let articleDate = dateString + " " + hour + ":" + minute;
        
                divisionArray.articles[i].pubDate = articleDate;
            }
        })
        .catch((err) => {
            console.log(err);
        })
    });
    divisionArticles.push(divisionArray);
});

setInterval(() => {
    divisionArticles.length = 0;
    var division = {division: item.division, articles:[]}
    item.teams.forEach(async (team, index) => {
        await axios.get(`${team.link}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html, {
                xmlMode: true
            });

            $('item').each((i, elem) => {
                const title = $(elem).children('title').text();
                const url = $(elem).children('link').text();
                const pubDate = $(elem).children('pubDate').text();
                const thumbnail = $(elem).children('enclosure').attr('url');
                const author = $(elem).children('creator').text();
                division.articles.push({
                    title,
                    author,
                    url,
                    pubDate,
                    thumbnail
                });
            });
            //Loop through all nfl divisionArticles, convert the pubDate into a Date() object
            for (let i = 0; i < division.articles.length - 1; i++) {
                let articleDate = new Date(division.articles[i].pubDate);
                division.articles[i].pubDate = articleDate;
            }

            //Sort the team's array of divisionArticles by date descending before sending it to res.json
            const sorteddivisionArticlesDesc = division.articles.sort(
                (objA, objB) => Number(objB.pubDate) - Number(objA.pubDate)
            );

            //Loop through all teams' divisionArticles, convert the pubDate into a readable date
            for (let i = 0; i < division.articles.length - 1; i++) {
                let dateString = division.articles[i].pubDate.toDateString();
                let hour = division.articles[i].pubDate.getHours();
                let minute = String(division.articles[i].pubDate.getUTCMinutes()).padStart(2, "0");
                let articleDate = dateString + " " + hour + ":" + minute;
        
                division.articles[i].pubDate = articleDate;
            }
        })
        .catch((err) => {
            console.log(err);
        })
    });
    divisionArticles.push(division);
}, 1000 * 60 * 60 * 6);
/*****************************************************************************/


//HOME page for api service
app.get("/", (req, res) => {
    res.send(`
    
    <h2>To Use This API</h2>
    <p>nfl-football-api.herokuapp.com/news <span style="color: red;">*all nfl news from every team*</span></p>
    <p>nfl-football-api.herokuapp.com/news/{division-name} <span style="color: red;">*division-specific news*</span></p>
    <p>nfl-football-api.herokuapp.com/news/{division-name}/{team-name} <span style="color: red;">*team-specific news*</span></p>
    <br />

    <section id="section">
    <h3>Examples</h3>
    <ol>
        <li>/news/afc/new-england-patriots --> team specific call</li>
        <li>/news/nfc --> division specific call</li>
    </ol>
    <h3>Team Name Examples</h3>
    <ol>
        <li>san-francisco-49ers</li>
        <li>arizona-cardinals</li>
        <li>green-bay-packers</li>
    </ol>
    </section>
    
    `);
});

//ALL NFL news endpoint example: /news
app.get(`/news`, (req, res) => {
    //Loop through all nfl divisionArticles, convert the pubDate into a Date() object
    for (let i = 0; i < allNflArticles.length - 1; i++) {
        let articleDate = new Date(allNflArticles[i].pubDate);
        allNflArticles[i].pubDate = articleDate;
    }

    //Then sort the array of divisionArticles by date descending before sending it to res.json
    const sorteddivisionArticlesDesc = allNflArticles.sort(
        (objA, objB) => Number(objB.pubDate) - Number(objA.pubDate)
    );

    //Loop through all nfl divisionArticles, convert the pubDate into a readable date
    for (let i = 0; i < allNflArticles.length - 1; i++) {
        let dateString = allNflArticles[i].pubDate.toDateString();
        let hour = allNflArticles[i].pubDate.getHours();
        let minute = String(allNflArticles[i].pubDate.getUTCMinutes()).padStart(2, "0");
        let articleDate = dateString + " " + hour + ":" + minute;
        
        allNflArticles[i].pubDate = articleDate;
    }

    res.json(sorteddivisionArticlesDesc);
});

//DIVISION specific endpoints example: /news/${division}
divisionArticles.forEach((item, index) => {
    app.get(`/news/${item.division}`, (req, res) => {
        res.send(item.articles);
    });
});



//TEAM specific endpoints -> example: /news/${division}/${team}
apiSources.forEach((item, index) => {

    var articles = [];
    var division = item.division;
    item.teams.forEach((team, index) => {
        app.get(`/news/${division}/${team.name}`, (req, res) => {
            articles.length = 0;
            axios.get(`${team.link}`)
            .then((response) => {
                const html = response.data;
                const $ = cheerio.load(html, {
                    xmlMode: true
                });
    
                $('item').each((i, elem) => {
                    const title = $(elem).children('title').text();
                    const url = $(elem).children('link').text();
                    const pubDate = $(elem).children('pubDate').text();
                    const thumbnail = $(elem).children('enclosure').attr('url');
                    const author = $(elem).children('creator').text();
                    articles.push({
                        title,
                        author,
                        url,
                        pubDate,
                        thumbnail
                    });
                });
    
                //Loop through all nfl divisionArticles, convert the pubDate into a Date() object
                for (let i = 0; i < articles.length - 1; i++) {
                    let articleDate = new Date(articles[i].pubDate);
                    articles[i].pubDate = articleDate;
                }
    
                //Sort the team's array of divisionArticles by date descending before sending it to res.json
                const sorteddivisionArticlesDesc = articles.sort(
                    (objA, objB) => Number(objB.pubDate) - Number(objA.pubDate)
                );
    
                //Loop through all teams' divisionArticles, convert the pubDate into a readable date
                for (let i = 0; i < articles.length - 1; i++) {
                    let dateString = articles[i].pubDate.toDateString();
                    let hour = articles[i].pubDate.getHours();
                    let minute = String(articles[i].pubDate.getUTCMinutes()).padStart(2, "0");
                    let articleDate = dateString + " " + hour + ":" + minute;
            
                    articles[i].pubDate = articleDate;
                }
    
                res.json(articles);
    
            })
            .catch((err) => {
                console.log(err);
            })
        });
    })
});


app.listen(process.env.PORT || PORT, () => console.log(`server running on port ${PORT}`));