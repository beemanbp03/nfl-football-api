const mysql = require('mysql');
const env = require('dotenv');
env.config({ path: './.env' });

/*
Simple query function that creates a promise, creates a db connection, attempts a query, 
then closes the connection once the promise is resolved.
*/
exports.dbQuery = (query, queryVar) => {
    return new Promise((resolve, reject) => {
        //The Promise constructor should catch any errors thrown
        //on this tick.  Alternatively, try/catch and reject(err) on catch.
        var connection = dbConnect();

        connection.query(query, queryVar, (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                //console.log("Results inside dbController" + JSON.stringify(rows));
                resolve(rows);
                console.log(rows);
            }
        });
        connection.end();
    });
}

//Delete All Duplicate Articles in the Database
exports.deleteAllDuplicateArticles = (articlesArray) => {
    console.log("Trying to Delete Duplicates from Database");
}

exports.insertArticles = (arrayOfArticles) => {
    return new Promise((resolve, reject) => {
        var connection = dbConnect();
        arrayOfArticles.forEach( item => {
            let query = "INSERT INTO `news-punt-db-test`.`articles` (title, url, pubDate, thumbnail, author) VALUES (?,?,?,?,?);"
            let queryVars = [item.title, item.url, item.pubDate, item.thumbnail, item.author];
            connection.query(query, queryVars, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        });
        
        connection.end();
    })
}

//Local function to connect with the database (params: {test}:boolean is the test or production database being used)
dbConnect = () => {
    
    var config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        port: process.env.DB_PORT,
        charset: "utf8mb4"
    }
    
    //Create Database Connection
    const db = mysql.createConnection(config);
    //console.log(config.name);
    return db;
}

