const PORT = 8000;
const db = require('./controllers/dbController');
const axios = require('axios').default;
const cheerio = require('cheerio');

const express = require('express');
const app = express();

//Sources for NFL team news
const apiSources = [
    {division:"afc", teams:[
        {name:"baltimore-ravens", link:"https://www.baltimoreravens.com/rss/news", abb:"bal", articles: []},
        {name:"buffalo-bills", link:"https://www.buffalobills.com/rss/news", abb:"buf", articles: []},
        {name:"cincinnati-bengals", link:"https://www.bengals.com/rss/news", abb:"cin", articles: []},
        {name:"cleveland-browns", link:"https://www.clevelandbrowns.com/rss/news", abb:"cle", articles: []},
        {name:"denver-broncos", link:"https://www.denverbroncos.com/rss/news", abb:"den", articles: []},
        {name:"houston-texans", link:"https://www.houstontexans.com/rss/news", abb:"hou", articles: []},
        {name:"indianapolis-colts", link:"https://www.colts.com/rss/news", abb:"ind", articles: []},
        {name:"jacksonville-jaguars", link:"https://www.jaguars.com/rss/news", abb:"jax", articles: []},
        {name:"kansas-city-chiefs", link:"https://www.chiefs.com/rss/news", abb:"kc", articles: []},
        {name:"las-vegas-raiders", link:"https://www.raiders.com/rss/news", abb:"lv", articles: []},
        {name:"los-angeles-chargers", link:"https://www.chargers.com/rss/news", abb:"lac", articles: []},
        {name:"miami-dolphins", link:"https://www.miamidolphins.com/rss/news", abb:"mia", articles: []},
        {name:"new-england-patriots", link:"https://www.patriots.com/rss/news", abb:"ne", articles: []},
        {name:"new-york-jets", link:"https://www.newyorkjets.com/rss/news", abb:"nyj", articles: []},
        {name:"pittsburgh-steelers", link:"https://www.steelers.com/rss/news", abb:"pit", articles: []},
        {name:"tennessee-titans", link:"https://www.tennesseetitans.com/rss/news", abb:"ten", articles: []}
    ]},
    {division:"nfc", teams:[
        {name:"arizona-cardinals", link:"https://www.azcardinals.com/rss/news", abb:"ari", articles: []},
        {name:"atlanta-falcons", link:"https://www.atlantafalcons.com/rss/news", abb:"atl", articles: []},
        {name:"carolina-panthers", link:"https://www.panthers.com/rss/news", abb:"car", articles: []},
        {name:"chicago-bears", link:"https://www.chicagobears.com/rss/news", abb:"chi", articles: []},
        {name:"dallas-cowboys", link:"https://www.dallascowboys.com/rss/news", abb:"dal", articles: []},
        {name:"detroit-lions", link:"https://www.detroitlions.com/rss/news", abb:"det", articles: []},
        {name:"green-bay-packers", link:"https://www.packers.com/rss/news", abb:"gb", articles: []},
        {name:"los-angeles-rams", link:"https://www.therams.com/rss/news", abb:"lar", articles: []},
        {name:"minnesota-vikings", link:"https://www.vikings.com/rss/news", abb:"min", articles: []},
        {name:"new-orleans-saints", link:"https://www.neworleanssaints.com/rss/news", abb:"no", articles: []},
        {name:"new-york-giants", link:"https://www.giants.com/rss/news", abb:"nyg", articles: []},
        {name:"philadelphia-eagles", link:"https://www.philadelphiaeagles.com/rss/news", abb:"phi", articles: []},
        {name:"san-francisco-49ers", link:"https://www.49ers.com/rss/news", abb:"sf", articles: []},
        {name:"seattle-seahawks", link:"https://www.seahawks.com/rss/news", abb:"sea", articles: []},
        {name:"tampa-bay-buccaneers", link:"https://www.buccaneers.com/rss/news", abb:"tb", articles: []},
        {name:"washington-commanders", link:"https://www.commanders.com/rss/news", abb:"wsh", articles: []}
    ]}
];

//******************* SERVER STARTUP && INTERVAL CALLS ***********************/
//GET ALL NFL news and Divisional News from every website on server startup, then retrieve the news
//again every 6 hours
const allNflArticles = [];


apiSources.forEach((item, index) => {
    console.log("Fetching news for " + item.division);
    item.teams.forEach(async (team, index) => {
        var teamObject = {name: team.name, division: item.division, articles:[]}
        await axios.get(`${team.link}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html, {
                xmlMode: true
            });
    
            $('item').each(async (i, elem) => {
                const title = $(elem).children('title').text();
                const url = $(elem).children('link').text();
                const pubDate = $(elem).children('pubDate').text();
                const thumbnail = $(elem).children('enclosure').attr('url');
                const author = $(elem).children('creator').text();

                const convertedDate = new Date(pubDate).toISOString().slice(0, 19).replace('T', ' ');
                //OUTPUTS
                //console.log(convertedDate);
                //console.log(title + "'s   ---  PUBLISHED: " + pubDate);

                //Add article to Division Array
                teamObject.articles.push({
                    title,
                    author,
                    url,
                    convertedDate,
                    thumbnail
                });
            //console.log( i + " article added to allNflArticles array");
            });
    
        })
        .catch((err) => {
        console.log(err);
        });
        allNflArticles.push(teamObject);
        await db.insertArticles(teamObject.articles);
    });
    console.log("This should be at the end")
});

setInterval(() => {
    console.log("Interval Running...");
    apiSources.forEach(async (item, index) => {
        //console.log(item.division);
        var teamObject = {division: item.division, articles:[]}
    
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
                    //Add article to teamObject.articles Array
                    teamObject.articles.push({
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
        allNflArticles.push(teamObject);
        await db.insertArticles(teamObject.articles);
    });
}, 1000 * 60 * 60 * 12);

/*
setInterval(() => {
    divisionArticles.length = 0;
    apiSources.forEach(item => {
        var division = {division: item.division, articles: []};
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
    })
}, 1000 * 60 * 60 * 6);
*/

/*****************************************************************************/




/************************* NFL NEWS ENDPOINTS ***************************/

//HOME page for api service
app.get("/", (req, res) => {
    res.send(`
    
    <h2>To Use This API</h2>
    <p>nfl-football-api.herokuapp.com/news <span style="color: red;">*all nfl news from every team*</span></p>
    <p>nfl-football-api.herokuapp.com/news/{division-name} <span style="color: red;">*division-specific news*</span></p>
    <p>nfl-football-api.herokuapp.com/news/{division-name}/{team-name} <span style="color: red;">*team-specific news*</span></p>
    <p>nfl-football-api.herokuapp.com/schedule/{team-name} <span style="color: red;">*team-specific season schedule*</span></p>
    <br />

    <section id="section">
    <h3>Examples</h3>
    <ol>
        <li>/news/afc/new-england-patriots --> team specific call</li>
        <li>/news/nfc --> division specific call</li>
        <li>/schedule/atlanta-falcons --> team specific season schedule</li>
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
    ///1) Loop through all nfl divisionArticles, convert the pubDate into a Date() object
    ///2) Loop through all nfl divisionArticles, convert the pubDate into a readable date
    ///3) Then sort the array of divisionArticles by date descending before sending it to res.json
    var sortedDivisionArticlesDesc = [];

    allNflArticles.forEach(item => {
        item.pubDate = new Date(item.pubDate);

        let dateString = item.pubDate.toDateString();
        let hour = item.pubDate.getHours();
        let minute = String(item.pubDate.getUTCMinutes()).padStart(2, "0");

        let articleDate = dateString + " " + hour + ":" + minute;

        item.pubDate = articleDate;
        
        sortedDivisionArticlesDesc.push(item);
    });

    res.json(sortedDivisionArticlesDesc.sort((objA, objB) => Number(objB) - Number(objA)));
});

//DIVISION specific endpoints example: /news/${division}
allNflArticles.forEach((item, index) => {
    app.get(`/news/${item.division}`, (req, res) => {
        res.json(item.articles);
    });

    app.get(`/news/${item.name}`, (req, res) => {
       res.json(item.articles); 
    })
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

/***********************************************************************/


/*********************** UPCOMING GAMES ENDPOINTS **********************/

apiSources.forEach((item, index) => {
    item.teams.forEach((team, index) => {
        app.get(`/schedule/${team.name}`, (req, res) => {
            var seasonSchedule = [];
            // TRY http://www.espn.com/nfl/schedulegrid INSTEAD
            axios.get(`https://espn.com/nfl/team/schedule/_/name/${team.abb}`).then((response) => {
                const html = response.data;
                const $ = cheerio.load(html, null, false);
                $('tr').each((i, elem) => {
                    //console.log($(elem).find('span').text() + "\n");
                    //console.log("WEEK: " + $(elem).find('td:nth-child(1)').text() + "\n");
                    //console.log("TIME: " + $(elem).find('td:nth-child(2)').text() + " " + $(elem).find('td:nth-child(4) span a').text() + "\n");
                    //console.log("OPPONENT: " + $(elem).find('td:nth-child(3)').text() + "\n");
                    const time = $(elem).find('td:nth-child(2)').text() + " " + $(elem).find('td:nth-child(4) span a').text();
                    const week = $(elem).find('td:nth-child(1)').text();
                    const opponent = $(elem).find('td:nth-child(3)').text();
                    const gameData = {
                        week: week,
                        time: time,
                        opponent: opponent
                    };
                    seasonSchedule.push(gameData);
                });


            //Filter out all non-relevent array elements 
            seasonSchedule.forEach((item, index) => {
                const newString = item.week.replace(/\D/g,'');
                item.week = newString;
            });  
            const filteredSeasonSchedule = seasonSchedule.filter(item => item.week.length > 0);
            
            //SEND filtered season schedule to endpoint
            res.json(filteredSeasonSchedule);
            }).catch((err) => console.error(err));
        }); 
    });
});

/***********************************************************************/


app.listen(process.env.PORT || PORT, () => console.log(`server running on port ${PORT}`));