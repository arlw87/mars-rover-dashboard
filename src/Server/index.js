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

//first attempt with seperate manifest request and image queries
app.post('/dataRequest', (req, res) =>
    {
        let rover = req.body.rover;
        const roverManifest = api_manifest(nasa_key, rover);
        fetchAPIData(roverManifest, extractManifestData).
            then(result => {
                console.log(result);
                //fetch images as well
                // const roverImagesURL = api_images(nasa_key, rover, result.max_sol);
                // fetchImages(roverImagesURL).
                //     then((result) => {
                //         console.log(result);
                //         const images = result.photos.map((elem)=> elem.img_src);
                //         console.log(images);
                //     }).
                //     catch((error)=> console.log(error));

                res.send(
                {
                    status: 'succcess',
                    payload: result
                })}).
            catch(error => res.send({status: 'error'}));
    });

//api request searching for latest photos
app.post('/latest', (req, res) =>
{
    let rover = req.body.rover;
    const roverLatest = api_latest(nasa_key, rover);
    console.log(roverLatest);
    fetchAPIData(roverLatest, extractLatestData).
        then(result => {
            console.log(result);
            res.send(
            {
                status: 'succcess',
                payload: result
            })}).
        catch(error => res.send({status: 'error'}));
});

const fetchAPIData = async (roverManifest, extractionFunction) => {
    return fetchData(roverManifest, 'GET').
        then((result) => 
        {
            const returnObject = extractionFunction(result);
            return returnObject;
            
        }).
        catch(error => console.log(error));
}
        
// const fetchManifestData = async (roverManifest) => {
//     return fetchData(roverManifest, 'GET').
//         then((result) => 
//         {
//             const returnObject = extractManifestData(result);
//             return returnObject;
            
//         }).
//         catch(error => console.log(error));
// }







const api_manifest = (api_key, rover) => `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}/?api_key=${api_key}`
const api_images = (api_key, rover, date) => `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${date}&camera=fhaz&api_key=${api_key}`;
const api_latest = (api_key, rover) => `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${api_key}`

const extractManifestData = (res) => {
    const data = res.photo_manifest;
    return {
        name: data.name,
        landing_date: data.landing_date,
        launch_date: data.launch_date,
        status: data.status,
        max_sol: data.max_sol
    }
}

const extractLatestData = (res) => {
    const data = res.latest_photos[0].rover;

    //get the images
    const images = res.latest_photos.map(elem => elem.img_src)

    return {
        name: data.name,
        landing_date: data.landing_date,
        launch_date: data.launch_date,
        status: data.status,
        images: images
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