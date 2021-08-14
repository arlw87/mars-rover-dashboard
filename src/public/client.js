//create a single global state object
const store = Immutable.Map({
    rover: 'Spirit',
    pageBackground: './Assets/images/marsGround.jpg'
});

//create commponents
//find root node, non functional
var root = document.getElementById('root');

const App = (state) => {
    return `<div id="rover-page">
            ${menu()}
            ${header(state)}
            </div>`
}

const menu = () => {
    return `<nav>
    ${navSection('Home')}
    ${navSection('Mars')}
    ${navSection('info')}
    </nav>`
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