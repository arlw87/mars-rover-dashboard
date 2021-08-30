# Mars Rover Dashboard

![Front End Demo](./gifs/mars-dashboard.gif)
_Front End Operation of Mars rover dashboard_

## Description

The Mars rover dashboard application displays information of and the latest images from three Nasa rovers, Spirit, Opportunity and Curiosity, that have / are exploring the Martian surface. 

It is a full stack application which is written in a functional programming style. It uses an Express server run on Node js as its backend which hosts the front end web page and handles API requests to the Nasa mars rover photos API.
 
The front end uses Javascript which create UI components that build up a dynamic webpage that is served to the DOM, in a similiar style to React js. Immutable.js is also used to help manage the global state and adhere to the functional programming style.

## Installation

1. Ensure that npm and node are installed on your system. This project was developed with node v14.17.3 and npm 6.14.3.
2. Clone and download the project from Github
3. Install all the project dependencies ```npm install```
4. The project uses the Nasa mars rover photos API, find more information [here](http://https://api.nasa.gov/). To access this you need to an API key, you can get your own [here](http://https://api.nasa.gov/). Place this API key in a file call .env in the root directory in the following format ```API_KEY = 'YOUR_KEY_HERE'```.

### Dependencies

All dependencies listed in the package.json file. 

## Running the application

The application uses a node server which hosts the front end application and handles the API requests to Nasa's API. To start the application run ```node .\src\Server\index.js``` from the root of the application.

Open a browser and go to the IP address of the machine that is running the node server, note the application is running at prt 3000. For example if the application is being accessed from the machine that is running the node server goto ```localhost:3000```.

## Overview

The Mars Rover dashboard is a full stack application that features a dynamic and responsive front end programmed and an express server run on node js at the back end.   

### Front End

There are three web pages in this application:
1.	Home page, where the user can access any of the rover’s pages
2.	The information page, which acknowledges the source of the data displayed on the web application
3.	The rover page, which dynamically displays the data from the rover that the user clicked on, at the home page

The front end is written in HTML, JS and CSS. The HTML is minimum as the application takes advantage of the technique of creating UI components in JS and rendering them to the webpage, similar to how React works. Each UI component represents part of the webpages UI, for example the navigation menu, the component can then be added with other components to create a whole page. This technique allows for reuse of components, for example the Nav bar is used on all pages, so can be reused, reducing the amount of code that needs to be written. Using this technique code to create a rover page can be written that is dynamically rendered to show data from one of three rovers, rather than having to write code for each rover page. 

The front end JavaScript is programmed in a functional style 
-	Where possible functions are pure
-	Use of high order to functions  
-	Code is declarative, it is broken down into small functions with descriptive names
-	Functions that are not pure, as they have side effects, such as ones that manipulate the DOM, are kept to a minimum 

An Immutable JS Map to store its global data in a Immutable object called store, no other variables exist on the global state

The client.js uses a fetch to communicate with the Express server to request rover data, the backend server returns this data after it has retrieved in from the Nasa API, the returned data from the Express server is rendered on the page.

### Responsive design
The front end is styled in a responsive manner and works on devices from mobiles up to desktop computers. When in mobile mode the menu system changes to a compact form where clicking a mobile menu button will display the home and info menu options.

![Front End Demo](./gifs/mars-dashboard-mobile.gif)
_Mobile Interface of Mars rover dashboard_

### Back End

The backend is built using an express server run on node js. It hosts the webpage and handles requests from it. The requests are for data on one of the mars rovers, the server will use this request to query the Nasa mars rover photos API and parse its response and send the required information back to the front end of the application which will render that data on its webpage. 
The backend is also programmed in a functional style and uses pure functions where possible. 

## Acknowledgements

Mars Rover Dashboard uses Nasa's excellent open API available [here](https://api.nasa.gov/). In particular the Mars Rover API which "is designed to collect image data gathered by NASA's Curiosity, Opportunity, and Spirit rovers on Mars and make it more easily available to other developers, educators, and citizen scientists." The API is maintenced by [Chris Cerami](https://github.com/chrisccerami/mars-photo-api).

The images used in the background of this web app and the images of the rover are all taken from Nasa's website