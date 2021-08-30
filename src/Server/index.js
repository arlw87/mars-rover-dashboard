const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
app.use(bodyParser.urlencoded(({extended: false})));
app.use(bodyParser.json());
app.use(express.static('./src/public'));

dotenv.config();
//API Keys
const nasa_key = process.env.API_KEY;

//start the server
const port = 3000;
const listening = () => {
    console.log("Server Running");
}

const server = app.listen(port, listening);

//end points

/***
 * API Endpoint to retrieve data from nasa api
 */
app.post('/latest', (req, res) =>
{
    const rover = req.body.rover;
    const roverLatest = api_latest(nasa_key, rover);
    fetchData(roverLatest, 'GET')
        .then(result => extractLatestData(result))
        .then(result => {
            res.send(
                {
                    status: 'succcess',
                    payload: result
                })
        })
        .catch(error => res.send(
            {status: 'error',
             message: error
            }
        ))
});

const api_latest = (api_key, rover) => `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${api_key}`
  
const extractLatestData = (res) => {

    const data = res.latest_photos[0].rover;
    const date = res.latest_photos[0].earth_date;
    //get the images
    const images = res.latest_photos.map(elem => elem.img_src)

    return {
        name: data.name,
        images: images,
        imagesDate: date,
        roverFacts: {
            'Mission Status': data.status,
            'Landing Date': data.landing_date,
            'Launch Date': data.launch_date,
        } 
    }
}

/**
 * Make a fetch to the provided API call and parse the returned JSON data
 * @param {string} url - Address of the API call  
 * @returns The parse json data of the response
 */
 const fetchData = async (url, method) => {
    try{
        const response = await fetch(url, {
            method: method
        });
        const data = await response.json();
        //if there is an error in the response
        //throw an error
        if ('error' in data){
            throw (data['error']);
        }
        return data;
    } catch(error){
        throw (error);
    }
}