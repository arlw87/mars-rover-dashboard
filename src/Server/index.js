const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded(({extended: false})));
app.use(bodyParser.json());
app.use(express.static('./src/public'));

// app.get('/', function(req, res){
//     res.send('Hello World!');
// });

//start the server
const port = 3000;
const listening = () => {
    console.log("Server Running");
}

const server = app.listen(port, listening);

//end points
app.post('/dataRequest', (req, res) =>
    {
        console.log(req.body);
        res.send({
            status: 'good',
            message: 'Hello from the server'
        });
    });