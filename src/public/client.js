//create a single global state object
const store = Immutable.Map({
    page: 'rover',
    rover: 'Spirit',
    pageBackground: './Assets/images/marsGround.jpg',
    roverFacts: Immutable.Map({
        launchDate: 'unknown',
        landingDate: 'unknown2',
        missionStatus: 'Complete'
    })
});

//create commponents
//find root node, non functional
var root = document.getElementById('root');

const App = (state) => {
    return `<div id="rover-page" class="page">
            ${menu(state)}
            ${header(state)}
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
    return `<h1>${state.get('rover')}</h1>
            <img alt= 'image of a rover' src=''>`
}

const navSection = (title) => {
    return `<div id="nav-section-${title}">
                <h1>${title}</h1>
            </div>`
}

//render the webpage
//not a pure function as it edits root
const render = (root, state) => {
    root.innerHTML= App(state);
}

window.addEventListener('load', () => {
    render(root, store)
 })