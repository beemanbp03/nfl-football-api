const chai = require('chai');
const db = require('../controllers/dbController');
const assert = chai.assert;
const expect = chai.expect;

apiFirstRequest = [
    {
        title: "Dolphins Lose Again!",
        url: "www.url.com/dolphins-lose-again",
        pubDate: "12-12-12",
        thumbnail: "efgh.png",
        author: ""
    },
    {
        title: "The Bears Still Suck",
        url: "www.url.com/the-bears-still-suck",
        pubDate: "12-12-12",
        thumbnail: "abcd.png",
        author: ""
    }
]

apiSecondRequest = [
    {
        title: "The Bears Still Suck",
        url: "www.url.com",
        pubDate: "12-12-12",
        thumbnail: "abcd.png",
        author: ""
    },
    {
        title: "Tom Brady Wants To Play Another Year",
        url: "www.url.com/tom-brady-wants-to-play-another-year",
        pubDate: "12-12-12",
        thumbnail: "kdks.png",
        author: ""
    }
]

describe('Sum of two numbers', () => {
    it ('Should add two numbers then return the sum"', () => {
        x = 0;
        y = 0;

        const sumOfNumbers = (x, y) => {
            return x+y;
        }

        assert.equal(2, sumOfNumbers(1,1), `${x} + ${y} != ${sumOfNumbers(x,y)}`);
    })
})



//DATABASE tests

describe("Connect to the database", () => {
    beforeEach (async () => {
        await db.dbQuery('TRUNCATE TABLE `news-punt-db-test`.articles');
        await db.dbQuery("INSERT INTO `news-punt-db-test`.articles (title, url, pubDate, thumbnail, author) VALUES ('This Is A Title', 'example.com', '1990-09-01 00:00:00', 'imageurl.png', 'Boulder Beeman');");
     });

    it("should connect to the database successfully and select all articles", async () => {
        const query = await db.dbQuery("SELECT * FROM `news-punt-db-test`.`articles`;");
        console.log(query);
        assert.equal(1, query.length);
    })
})

describe("Insert article object successfully", () => {
    beforeEach (async () => {
        await db.dbQuery('TRUNCATE TABLE `news-punt-db-test`.articles');
        await db.dbQuery("INSERT INTO `news-punt-db-test`.articles (title, url, pubDate, thumbnail, author) VALUES ('This Is A Title', 'example.com', '1990-09-01 00:00:00', 'imageurl.png', 'Boulder Beeman');");
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

describe('Check Database For Identical Article Titles', async () => {

});