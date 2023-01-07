const chai = require('chai');
const db = require('../controllers/dbController');
const assert = chai.assert;
const expect = chai.expect;

const apiFirstRequest = [
    {
        title: "Dolphins Lose Again!",
        url: "www.url.com/dolphins-lose-again",
        pubDate: "1990-09-01 00:00:00",
        thumbnail: "efgh.png",
        author: ""
    },
    {
        title: "The Bears Still Suck",
        url: "www.url.com/the-bears-still-suck",
        pubDate: "1990-09-01 00:00:00",
        thumbnail: "abcd.png",
        author: ""
    },
    {
        title: "Rams Are Losing It",
        url: "www.url.com/rams-are-losing-it",
        pubDate: "1990-09-01 00:00:00",
        thumbnail: "asdfe.png",
        author: ""
    }
]

const apiSecondRequest = [
    {
        title: "The Bears Still Suck",
        url: "www.url.com",
        pubDate: "1990-09-01 00:00:00",
        thumbnail: "abcd.png",
        author: ""
    },
    {
        title: "Tom Brady Wants To Play Another Year",
        url: "www.url.com/tom-brady-wants-to-play-another-year",
        pubDate: "1990-09-01 00:00:00",
        thumbnail: "kdks.png",
        author: ""
    }
]


//DATABASE tests

// 1
describe("Connect to the database", () => {
    beforeEach (async () => {
        await db.dbQuery('TRUNCATE TABLE `news-punt-db-test`.articles');
        await db.dbQuery("INSERT INTO `news-punt-db-test`.articles (title, url, pubDate, thumbnail, author) VALUES ('Rams Are Losing It', 'www.url.com/rams-are-losing-it', '1990-09-01 00:00:00', 'asdfe.png', '');");
     });

    it("should connect to the database successfully and select all articles", async () => {
        const query = await db.dbQuery("SELECT * FROM `news-punt-db-test`.`articles`;");
        console.log(query);
        assert.equal(1, query.length);
    })
})

// 2
describe("Insert article object successfully", () => {
    beforeEach (async () => {
        await db.dbQuery('TRUNCATE TABLE `news-punt-db-test`.articles');
        await db.dbQuery("INSERT INTO `news-punt-db-test`.articles (title, url, pubDate, thumbnail, author) VALUES ('Rams Are Losing It', 'www.url.com/rams-are-losing-it', '1990-09-01 00:00:00', 'asdfe.png', '');");
     });
    
    it ("should insert a new article object into the articles table successfully", async () => {
        const insertQuery = await db.dbQuery("INSERT INTO `news-punt-db-test`.`articles` (title, url, pubDate, thumbnail, author)"
        + "VALUES" +
        "('" + apiFirstRequest[0].title + "',"+
        "'" + apiFirstRequest[0].url + "',"+
        "'" + apiFirstRequest[0].pubDate + "',"+
        "'" + apiFirstRequest[0].thumbnail + "',"+
        "'" + apiFirstRequest[0].author + "');");
        
        const selectQuery = await db.dbQuery("SELECT * FROM `news-punt-db-test`.`articles`;");
        assert.equal(2, selectQuery.length);
    })
    it ("Should insert an array of article objects into the articles table", async () => {

    })
})

// 3
describe('Check Database For Identical Article Titles and insert unique article objects', () => {
    beforeEach (async () => {
        await db.dbQuery('TRUNCATE TABLE `news-punt-db-test`.articles');
        await db.dbQuery("INSERT INTO `news-punt-db-test`.articles (title, url, pubDate, thumbnail, author) VALUES ('Rams Are Losing It', 'www.url.com/rams-are-losing-it', '1990-09-01 00:00:00', 'asdfe.png', '');");
     });

     it("should loop through scraped articles, check database for duplicate 'title', and only insert the article if unique", async () => {
        //Loop through array of articles that were scraped and find duplicates, 
        //then insert the article if it is not a duplicate
        apiFirstRequest.forEach(async item => {
            let title = item.title;
            
            duplicateArticles = await db.dbQuery("SELECT * FROM `news-punt-db-test`.`articles` WHERE title = " + "'" + title + "';")
            .then(async res => {
                if (res.length !== 1) {
                    insertStatement = await db.dbQuery("INSERT INTO `news-punt-db-test`.`articles` (title, url, pubDate, thumbnail) VALUES ('" + title + "', '" + item.url + "', '" + item.pubDate + "', '" + item.thumbnail + "');")
                    .then(async val => {
                        articlesAfterInsert = await db.dbQuery("SELECT * FROM `news-punt-db-test`.`articles`;");
                        assert.equal(3, articlesAfterInsert.length);
                    })
                }
            })

        })
     }) 

});