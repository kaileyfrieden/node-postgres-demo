require('dotenv').config()
const express = require('express');
const nunjucks = require('nunjucks');

const app = express();
const port = process.env.PORT || 3000

// configure pg
const pg = require('pg')
const client = new pg.Client({
    connectionString: process.env.CONNECTION_STRING
})




// Configure Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    noCache: process.env.NODE_ENV !== 'production',
    express: app
});

client.connect()


app.get('/', async (req, res) => {

    let query = req.query.q
    let results = []

    if(query !== undefined) {
        query = query.toLowerCase()
        let likeQuery = `%${query}%`
        results = await client.query("select * from track where LOWER(name) LIKE $1", [likeQuery])
    }



    // Render index.njk using the variable "title" 
    res.render('search.njk', { title: "Search", query: query, rows: results.rows});
})

app.get('/artist/:id', async (req, res) => {
    
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})