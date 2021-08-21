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
app.post('/dataRequest', (req, res) =>
    {
        console.log(req.body);
        let rover = req.body.rover;
        //test communicating with nasa api
        const roverManifest = api_manifest(nasa_key, rover);
        console.log(roverManifest);

        fetchData(roverManifest, 'GET').
            then((result) => 
            {
                const returnObject = extractManifestData(result)
                console.log(returnObject);
                res.send(returnObject);
            }).
            catch(error => console.log(error));
    });

const api_manifest = (api_key, rover) => `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}/?api_key=${api_key}`

const extractManifestData = (res) => {
    const data = res.photo_manifest;
    return {
        name: data.name,
        landing_date: data.landing_date,
        status: data.status
    }
}

//make requests to nasa API
//https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/latest_photos?api_key=A8ofgim6ZprIZEndCEdvTerU7MVbmaeKNKee1skD
//https://api.nasa.gov/mars-photos/api/v1/manifests/Curiosity/?api_key=A8ofgim6ZprIZEndCEdvTerU7MVbmaeKNKee1skD

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
        console.log(data);
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