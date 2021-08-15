//create a single global state object
let store = Immutable.Map({
    page: 'home',
    currentRover: 'Spirit',
    pageBackground: './Assets/images/marsGround.jpg',
    roverFacts: Immutable.Map({
        launchDate: '21/05/1998',
        landingDate: '21/05/1998',
        missionStatus: 'Complete'
    }),
    roverImages: Immutable.List(['marsGround', 'marsSpace', 'Opportunity', 'perservance', 'spirit']),
    menuItems: Immutable.Map({
        homeLink: 'Home',
        marsLink: 'Mars',
        infoLink: 'Info'
    }),
    rovers: Immutable.List(['Curosity','Spirit','Perservance','Opportunity'])
});

//create commponents
//find root node, non functional
var root = document.getElementById('root');

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

const menu = (state) => {
    return `<nav class=${navColorStyling(state)} >
        ${navSection(state.get('menuItems').get('homeLink'))}
        ${navSection(state.get('menuItems').get('marsLink'))}
        ${navSection(state.get('menuItems').get('infoLink'))}
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
    const launch = oneFact('Launch Date');
    const landing = oneFact('Landing Date');
    const missionStatus = oneFact('Mission Status');
    return `<div id='fact-section' class='section'>
                ${launch(state.get('roverFacts').get('launchDate'))}
                ${landing(state.get('roverFacts').get('landingDate'))}
                ${missionStatus(state.get('roverFacts').get('missionStatus'))}
            </div>`
}

/**
 * High Order Function
 * @param {*} label 
 * @returns 
 */
const oneFact = (label) => {
    return (fact) => {
        return `<div class='fact'>
                    <h2 class='label'>${label}:</h2>
                    <t>
                    <h2 class='detail'>${fact}</h2>
                </div>`
    } 
}

//image / gallery section
const images = (state) => {
    const roverImagesArray = state.get('roverImages').toJS();
    return `
        <section class='section'>
            ${roverImagesArray.map((val) => imageElement(val))}
        </section>
    `
}

const imageElement = (image) => {
    return `<img class ='galleryImage' src='./Assets/images/${image}.jpg'>`
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
    ${roversArray.reduce((acc, curr) => `${acc} ${roverCard(curr)}`,"")}
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
}

window.addEventListener('load', () => {
    render(root, store)
    loadNavLinks();
    loadHomeRoverLinks();
  })

 const loadNavLinks = () => {
    let homeButton = document.getElementById(`nav-section-${store.get('menuItems').get('homeLink')}`);

    homeButton.addEventListener('click', (event) => {
            //edit store so page indicates home 
            updateStore({'page':'home'}, store);
        }
    )
 }

 const loadHomeRoverLinks = () => {

    const curosityLink = document.getElementById('Curosity');
    const spiritLink = document.getElementById('Spirit');
    const opportunityLink = document.getElementById('Opportunity');
    const perservanceLink = document.getElementById('Perservance');

    const roverLinks = (rover) => {
        return (event) => {
            updateStore({'page':'rover', 'currentRover':`${rover}`}, store);
        }
    }

    const curosityAction = roverLinks('Curosity')
    const spiritAction = roverLinks('Spirit')
    const opportunityAction = roverLinks('Opportunity')
    const perservanceAction = roverLinks('Perservance')
 
    curosityLink.addEventListener('click', curosityAction);
    spiritLink.addEventListener('click', spiritAction);
    opportunityLink.addEventListener('click', opportunityAction);
    perservanceLink.addEventListener('click', perservanceAction);
 }

//updating the application data and re-rendering
const updateStore = (newState, state) => {
    store = state.merge(newState);
    render(root, store);

    //if the update occurred because a new page was accessed then links 
    //will need to be re-established
    if ('page' in newState){
        updateUILinks(newState['page'])
    }
}

const updateUILinks = (newPage) => {
    if (newPage === 'home'){
        loadHomeRoverLinks();
    }
    loadNavLinks();
} 


 //interacting with the page
 //Going to home page


