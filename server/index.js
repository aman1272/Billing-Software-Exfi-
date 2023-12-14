const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const path = require('path')
const config = require('./config.json')
const port = config.port || 8001;

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', require('./routes/route'))

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {

    res.render('Demo', {
        title: 'View Engine Demo'
    })
})

app.listen(port, () => {
    console.log(`Your server is running successfully on port ${port}`)
}
);