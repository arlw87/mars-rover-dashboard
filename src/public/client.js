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
    rovers: Immutable.List(['Curiosity', 'Spirit', 'Opportunity'])
});

//UI Components
const App = (state) => {
    const page = state.get('page');

    if (page === 'rover') {
        return roverPage(state);
    } else if (page === 'info') {
        return infoPage(state);
    } else {
        return homePage(state);
    }
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
    return `<nav class='${navColorStyling(state)}' >
        ${multiUIfromList(menuItems, navSection)}
        ${mobileMenuComponent(state)}
    </nav>`
}

const mobileMenuComponent = (state) => {
    let src = './Assets/images/menuGrey.png'
    console.log(`for mobile menu: ${state.get('page')}`);
    if (state.get('page') === 'rover') {
        src = './Assets/images/menuRed.png'
    }
    return `
            <div class='nav-section' id='nav-mobile'><img src=${src} alt='M'></div>
        `
}

const navSection = (title) => {
    return `<div id="nav-section-${title}" class="nav-section">
                <h1 class='pointer'>${title}</h1>
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
    if (state.get('page') !== 'rover') {
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
    ${multiUIfromObject(state.get('roverFacts'), fact)}
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
        <h1 class='header-title' id='image-title'>Images taken on ${state.get('imageDate')}</h1>
        <section class='section' id='images'>
            ${multiUIfromList(roverImagesArray, imageElement)}
        </section>
    `
}

const imageElement = (image) => {
    return `<img class ='galleryImage' src='${image}'>`
}

//info page
const infoPage = (state) => {
    return `<div id="home-page" class="page">
        ${menu(state)}
        ${infoHeader(state)}
        ${acknowledgements(state)}
    </div>`
}

const acknowledgements = (state) => {
    return `<section class='section' id="acknowledgement">
        <p>Mars Rover Dashboard uses Nasa's excellent open API around <a href='https://api.nasa.gov/'>here</a>. In particular the Mars Rover API which "is designed to collect image data gathered by NASA's Curiosity, Opportunity, and Spirit rovers on Mars and make it more easily available to other developers, educators, and citizen scientists." The API is maintenced by <a href='https://github.com/chrisccerami/mars-photo-api'>Chris Cerami</a></p>
        <p>The images used in the background of this web app and the images of the rover are all taken from Nasa's website</p>
        <blockquote>"Somewhere, Something incredible is waiting to be known" - <em>Carl Sagan</em></blockquote>
    </section>`
}

const infoHeader = (state) => {
    return `<section class='header-section section'>
                <img alt= 'Nasa Logo' src='./Assets/images/nasa-logo-web-rgb.png' class='header-image'>
                <h1 class='header-title' id='info-header'>Information</h1>
            </section>`
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
//Non pure functions

//find root node, non functional
var root = document.getElementById('root');

window.addEventListener('load', () => {
    render(root, store);
    //mobile menu

})


const mobileMenu = () => {
    resetMobileMenu();
    addMobileListener();
}

const addMobileListener = () => {
    document.getElementById('nav-mobile').addEventListener('click', toggleMobileMenu);
}

const toggleMobileMenu = (event) => {
    document.getElementById('nav-section-Home').classList.toggle('display');
    document.getElementById('nav-section-Home').classList.toggle('non-display');
    document.getElementById('nav-section-Info').classList.toggle('display');
    document.getElementById('nav-section-Info').classList.toggle('non-display')
}

const resetMobileMenu = () => {
    if (document.getElementById('nav-section-Home').classList.contains('display')) {
        document.getElementById('nav-section-Home').classList.toggle('display');
        document.getElementById('nav-section-Info').classList.toggle('display');
    }

    if (!document.getElementById('nav-section-Home').classList.contains('non-display')) {
        document.getElementById('nav-section-Home').classList.add('non-display');
        document.getElementById('nav-section-Info').classList.add('non-display');
    }
}


const render = (root, state) => {
    root.innerHTML = App(state);
    //sort out links here
    updateUILinks(state);
}

const updateUILinks = (state) => {
    console.log(`hello from updateUILinks, page state is ${state.get('page')}`);
    if (state.get('page') === 'home') {
        loadHomeRoverLinks(state);
    }
    loadNavLinks(state);
    mobileMenu();
}

const loadNavLinks = (state) => {
    const list = state.get('menuItems').toJS();
    list.forEach((element) => loadNavLink(element.name, element.link))
}

const loadNavLink = (elementName, elementLink) => {
    document.getElementById(`nav-section-${elementName}`).addEventListener('click', (event) => updateStore({ 'page': elementLink }, store));
}

const roverAction = (rover) => {
    return (event) => {
        //fetch data from server
        postData('/latest', { 'rover': `${rover}` }).
            then(result => {
                //extract data from returned 
                const newObj = {
                    'page': 'rover',
                    currentRover: result.payload.name,
                    roverFacts: Immutable.Map(result.payload.roverFacts),
                    imageDate: result.payload.imagesDate
                }
                //update images
                updateStoreImages(result.payload.images, store);
                //update the page
                updateStore(newObj, store);
            }).catch((error) => {
                alert(error);
            });
    }
}

const loadRoverLink = (element, callback) => document.getElementById(element).addEventListener('click', callback);

const loadHomeRoverLinks = (state) => state.get('rovers').toJS().forEach((elem) => loadRoverLink(elem, roverAction(elem)));


//updating the application data and re-rendering
const updateStore = (newState, state) => {
    store = state.mergeDeep(newState);
    render(root, store);
}

const updateStoreImages = (images, state) => {
    store = Immutable.set(state, 'roverImages', Immutable.List(images));
}

//interacting with the page
//Going to home page

//request to server
/**
 * Send a post request in JSON format to the defined url and returns the parsed response
 * @param {string} url 
 * @param {object} data 
 */
const postData = async (url, data) => {

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        return Error(error);
    }
}

