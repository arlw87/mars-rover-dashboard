//create a single global state object
let store = Immutable.Map({
    page: 'home',
    currentRover: '',
    roverFacts: '',
    roverImages: Immutable.List([]),
    menuItems: Immutable.List([ 
        Immutable.Map({   
            name: 'Home',
            link: 'home'
        }),
        Immutable.Map({   
            name: 'Mars',
            link: 'home'
        }),
        Immutable.Map({   
            name: 'Info',
            link: 'info'
        })
    ]),
    rovers: Immutable.List(['Curiosity','Spirit','Opportunity'])
});

//find root node, non functional
var root = document.getElementById('root');

//UI Components
const App = (state) => {
    if (state.get('page') === 'rover'){
        return roverPage(state);
    }
    return homePage(state);
}

const roverPage = (state) => {
    return `<div id="rover-page" class="page">
                ${menu(state)}
                ${header(state)}
                ${facts(state)}
                ${images(state)}
            </div>`
}

/**
 * Multi sections of the UI is created from lists of items, e.g the menu and the facts section
 * There a helper function was constructed for this. It takes in the list to convert into multiple
 * components and the function that converts a list item into a component. 
 * @param {*} list The list of items to turn in to components
 * @param {*} fn The component function
 * @returns block of html with all the components constructed from the list
 */
const multiUIfromList = (list, fn) => list.reduce((acc, cur) => `${acc} ${fn(cur)}`, '');

/***
 * Menu section. Creates a menu element for all titles in the menuItems list in the application state
 */
const menu = (state) => {
    const menu = state.get('menuItems').toJS();
    console.log(menu);
    const menuItems = menu.map(val => val.name)
    return `<nav class=${navColorStyling(state)} >
        ${multiUIfromList(menuItems, navSection)}
    </nav>`
}

const navSection = (title) => {
    return `<div id="nav-section-${title}" class="nav-section">
                <h1>${title}</h1>
            </div>`
}

/**
 * Determine the color of the nav menu. If on a rover page, color of text is red. 
 * If on the home page color of text is grey
 * @param {*} state 
 * @returns 
 */
const navColorStyling = (state) => {
    //determine nav text color
    let colorClass = 'red';
    if (state.get('page') !== 'rover'){
        colorClass = 'grey';
    }
    return colorClass;
}

const header = (state) => {
    return `<section class='header-section section'>
                <h1 class='header-title'>${state.get('currentRover')}</h1>
                <img alt= 'image of a rover' src='${getRoverImage(state)}' class='header-image'>
            </section>`
}

const getRoverImage = (state) => {
    return `./Assets/images/${state.get('currentRover')}.jpg`
}

//Facts section
const facts = (state) => {
    console.log(state);
    console.log(state.get('roverFacts'))
    return `<div id='fact-section' class='section'>
    ${multiUIfromObject(state.get('roverFacts'),fact)}
            </div>`
}

 
const multiUIfromObject = (obj, fn) => {
     const objJS = obj.toJS();
     const objKeys = Object.keys(objJS);
     const objVals = Object.values(objJS);
     const newArray = objKeys.map((val, index) => [val, objVals[index]]);
     return multiUIfromList(newArray, fact);
 }

/**
 * High Order Function
 * @param {*} label 
 * @returns 
 */
const fact = (info) => {
        return `<div class='fact'>
                    <h2 class='label'>${info[0]}:</h2>
                    <t>
                    <h2 class='detail'>${info[1]}</h2>
                </div>`
    } 


//image / gallery section
const images = (state) => {
    const roverImagesArray = state.get('roverImages').toJS();
    console.log(roverImagesArray);
    return `
        <section class='section' id='images>
            ${multiUIfromList(roverImagesArray, imageElement)}
        </section>
    `
}

const imageElement = (image) => {
    return `<img class ='galleryImage' src='${image}'>`
}

//Home Page Components
const homePage = (state) => {
    return `<div id="home-page" class="page">
                ${menu(state)}
                ${announcement(state)}
                ${roverLinks(state)}
            </div>`
}

const announcement = (state) => {
    return `<section id="announcement" class='section'>
                <p id="mars-statement">The red planet has been explored by robots for decades</p>
                <p id="mars-question">Want to find out more?</p>
            </section>`
}

/**
 * Function uses a Reduce method on the array
 * this adds all the roverCard elements into one htmlString
 * By starting with an initial value of "" you can apply roverCard
 * function to each element in the array
 * @param {} state 
 * @returns 
 */
const roverLinks = (state) => {
    const roversArray = state.get('rovers').toJS();     
    return `<section id='rovers'>
        ${multiUIfromList(roversArray, roverCard)}
    </section>`
}

const roverCard = (rover) => {
    return `<div class="rover-card" id="${rover}">
                <h3>${rover}</h3>
            </div>`
}


//render the webpage
//not a pure function as it edits root
const render = (root, state) => {
    root.innerHTML = App(state);
    //sort out links here
    updateUILinks(state);
}

window.addEventListener('load', () => {
    render(root, store)
    //loadNavLinks();
    updateUILinks(store);
  })

 const loadNavLinks = (state) => {
    const list = state.get('menuItems').toJS();
    list.forEach((element) => loadNavLink(element.name, element.link))
 }

 const loadNavLink = (elementName, elementLink) => {
     console.log(elementLink);
     document.getElementById(`nav-section-${elementName}`).addEventListener('click', (event) => updateStore({'page':elementLink},store));
 }

 const loadHomeRoverLinks = () => {

    console.log('hello from the rover links');

    const curosityLink = document.getElementById('Curiosity');
    const spiritLink = document.getElementById('Spirit');
    const opportunityLink = document.getElementById('Opportunity');

    const roverLinks = (rover) => {
        return (event) => {
            //fetch data from server
            //could set this to a separate function for neatness??
            //return an object with new data 
            postData('/latest', {'rover':`${rover}`}).
                then(result => {
                    console.log(result);
                    //extract data from returned object
                    const newObj = {
                        'page':'rover',
                        currentRover: result.payload.name,
                        roverFacts: Immutable.Map(result.payload.roverFacts)
                    }
                    //update images
                    updateStoreImages(result.payload.images, store);
                    //update the page
                    updateStore(newObj, store);
                }).catch((error) => {
                    console.log(error);
                });
          
            //e.g
            // try{
            //     newObj = await getRoverData(rover)
            //     updateStore(newObj, store);
            // } catch (error){
            //     // throw error 
            //     // dont update ui
            //     // display an error to user
            // }

            //functional programming with a api call
            // https://www.sitepoint.com/an-introduction-to-reasonably-pure-functional-programming/
            // let flickr = (tags)=> {
            //     let url = `http://api.flickr.com/services/feeds/photos_public.gne?tags=${tags}&format=json&jsoncallback=?`
            //     return fetch(url)
            //     .then((resp)=> resp.json())
            //     .then((data)=> {
            //       let urls = data.items.map((item)=> item.media.m )
            //       let images = urls.map((url)=> $('<img />', { src: url }) )
              
            //       return images
            //     })
            //   }
            //   flickr("cats").then((images)=> {
            //     $(document.body).html(images)
            //   })
        }
    }

    const curosityAction = roverLinks('Curiosity')
    const spiritAction = roverLinks('Spirit')
    const opportunityAction = roverLinks('Opportunity')
 
    curosityLink.addEventListener('click', curosityAction);
    spiritLink.addEventListener('click', spiritAction);
    opportunityLink.addEventListener('click', opportunityAction);
 }

//updating the application data and re-rendering
const updateStore = (newState, state) => {
    store = state.mergeDeep(newState);
    render(root, store);
}

const updateStoreImages = (images, state) => {
    store = Immutable.set(state, 'roverImages', Immutable.List(images));
} 

const updateUILinks = (state) => {
    console.log(`hello from updateUILinks, page state is ${state.get('page')}`);
    if (state.get('page') === 'home'){
        loadHomeRoverLinks();
    }
    loadNavLinks(state);
} 


 //interacting with the page
 //Going to home page

//request to server
/**
 * Send a post request in JSON format to the defined url and returns the parsed response
 * @param {string} url 
 * @param {object} data 
 */
 const postData = async(url, data) => {

    const response = await fetch(url, {
        method: 'POST',
        headers:{
            'content-type':'application/json'
        },
        body: JSON.stringify(data)
    });

    try{
        const newData = await response.json();
        return newData;
    }catch(error){
        return Error(error);
    }
}
