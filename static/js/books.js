import { get } from './modules/fetch.js';
import { clickButtons } from './modules/complementary.js';
import { config } from './config.js';

function queryBooks() {
    let input = document.getElementById('search').value;
    const url = 'https://www.googleapis.com/books/v1/volumes?q='+input+'&key='+config.key;
    get(url)
        .then(data => {
            console.log(data);
        })
}

clickButtons('query', queryBooks);

window.addEventListener('load', function () {
    if (window.location.pathname == indexUrlBooks) {
        }
})