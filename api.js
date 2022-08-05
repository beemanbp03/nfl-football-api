const PORT = 8000;
const express = require('express');
const axios = require('axios').default;
const cheerio = require('cheerio');

const app = express();


const apiSources = [
    {team:"arizona-cardinals", link:"https://www.azcardinals.com/rss/news"},
    {team:"atlanta-falcons", link:"https://www.atlantafalcons.com/rss/news"},
    {team:"baltimore-ravens", link:"https://www.baltimoreravens.com/rss/news"},
    {team:"buffalo-bills", link:"https://www.buffalobills.com/rss/news"},
    {team:"carolina-panthers", link:"https://www.panthers.com/rss/news"},
    {team:"chicago-bears", link:"https://www.chicagobears.com/rss/news"},
    {team:"cincinnati-bengals", link:"https://www.bengals.com/rss/news"},
    {team:"cleveland-browns", link:"https://www.clevelandbrowns.com/rss/news"},
    {team:"dallas-cowboys", link:"https://www.dallascowboys.com/rss/news"},
    {team:"denver-broncos", link:"https://www.denverbroncos.com/rss/news"},
    {team:"detroit-lions", link:"https://www.detroitlions.com/rss/news"},
    {team:"green-bay-packers", link:"https://www.packers.com/rss/news"},
    {team:"houston-texans", link:"https://www.houstontexans.com/rss/news"},
    {team:"indianapolis-colts", link:"https://www.colts.com/rss/news"},
    {team:"jacksonville-jaguars", link:"https://www.jaguars.com/rss/news"},
    {team:"kansas-city-chiefs", link:"https://www.chiefs.com/rss/news"},
    {team:"las-vegas-raiders", link:"https://www.raiders.com/rss/news"},
    {team:"los-angeles-chargers", link:"https://www.chargers.com/rss/news"},
    {team:"los-angeles-rams", link:"https://www.therams.com/rss/news"},
    {team:"miami-dolphins", link:"https://www.miamidolphins.com/rss/news"},
    {team:"minnesota-vikings", link:"https://www.vikings.com/rss/news"},
    {team:"new-england-patriots", link:"https://www.patriots.com/rss/news"},
    {team:"new-orleans-saints", link:"https://www.neworleanssaints.com/rss/news"},
    {team:"new-york-giants", link:"https://www.giants.com/rss/news"},
    {team:"new-york-jets", link:"https://www.newyorkjets.com/rss/news"},
    {team:"philadelphia-eagles", link:"https://www.philadelphiaeagles.com/rss/news"},
    {team:"pittsburgh-steelers", link:"https://www.steelers.com/rss/news"},
    {team:"san-francisco-49ers", link:"https://www.49ers.com/rss/news"},
    {team:"seattle-seahawks", link:"https://www.seahawks.com/rss/news"},
    {team:"tampa-bay-buccaneers", link:"https://www.buccaneers.com/rss/news"},
    {team:"tennessee-titans", link:"https://www.tennesseetitans.com/rss/news"},
    {team:"washington-commanders", link:"https://www.commanders.com/rss/news"}
];

app.get("/", (req, res) => {
    res.send(`
    
    <h2>To Use This API</h2>
    <p>ROOT.com/news/{team-name}</p>
    <p>example: Packers news -> ROOT.com/news/green-bay-packers</p>
    
    `);
})

//Loop through each team and create separate api sources example: /news/${team} 

apiSources.forEach((item, index) => {

    const articles = [];
    app.get(`/news/${item.team}`, (req, res) => {
        axios.get(`${item.link}`)
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
                articles.push({
                    title,
                    url,
                    pubDate,
                    thumbnail
                })
            });
            res.json(articles);

        })
        .catch((err) => {
            console.log(err);
        })
        .then(() => console.log("Axios.get has completed"));
    })
    
});


app.listen(process.env.PORT || PORT, () => console.log(`server running on port ${PORT}`));