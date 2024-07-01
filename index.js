const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

app.use(morgan('combined'));
app.get('/movies', (req,res)=> {
    res.json({
        movies: [
            {title: 'inception', year:2010},
            {title: 'spiderman', year:2012},
            {title: 'Wakanda', year:2015},
            {title: 'Daylight', year:2016},
            {title: 'baby on board', year:2017},
            {title: 'flight to Abuja', year:2018},
            {title: 'monkey shadow', year:2019},
            {title: 'mission impossible', year:2020},
            {title: 'bad boys', year:2021},
            {title: 'moremi', year:2022},
        ]
    });
});
app.get('/', (req,res) => {
    res.send('welcome to the movie api');
});
app.use(express.static(path.join(__dirname, 'public')));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('something broke');
});
const port = 8080;
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});

