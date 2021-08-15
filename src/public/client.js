//create a single global state object
const store = Immutable.Map({
    page: 'rover',
    rover: 'Spirit',
    pageBackground: './Assets/images/marsGround.jpg',
    roverFacts: Immutable.Map({
        launchDate: '21/05/1998',
        landingDate: '21/05/1998',
        missionStatus: 'Complete'
    }),
    roverImages: Immutable.List(['marsGround', 'marsSpace', 'Opportunity', 'perservance', 'spirit'])
});

//create commponents
//find root node, non functional
var root = document.getElementById('root');

const App = (state) => {
    return `<div id="rover-page" class="page">
            ${menu(state)}
            ${header(state)}
            ${facts(state)}
            ${images(state)}
            </div>`
}

const menu = (state) => {
    return `<nav class=${navColorStyling(state)} >
    ${navSection('Home')}
    ${navSection('Mars')}
    ${navSection('info')}
    </nav>`
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
                <h1 class='header-title'>${state.get('rover')}</h1>
                <img alt= 'image of a rover' src='${getRoverImage(state)}' class='header-image'>
            </section>`
}

const getRoverImage = (state) => {
    return `./Assets/images/${state.get('rover')}.jpg`
}

const navSection = (title) => {
    return `<div id="nav-section-${title}" class="nav-section">
                <h1>${title}</h1>
            </div>`
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


//render the webpage
//not a pure function as it edits root
const render = (root, state) => {
    root.innerHTML= App(state);
}

window.addEventListener('load', () => {
    render(root, store)
 })