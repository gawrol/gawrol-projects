import { get } from './modules/fetch.js';
import { clickButtons } from './modules/complementary.js';
import { config } from './config.js';
import { blueprint } from './modules/blueprintBook.js';

// Define books ul
const booksUl = document.getElementById('books');

// Define books array
let books = new Array();

function queryBooks() {
    let input = document.getElementById('search').value;
    const url = 'https://www.googleapis.com/books/v1/volumes?q='+input+'&key='+config.key;
    get(url)
        .then(data => {
            if (data.totalItems == 0) {
                return;
            }
            books = data.items;
            for (let i = 0; i < books.length; i++) {
                let book = blueprint(books[i]);
                booksUl.appendChild(book);
            } 
        })
}

clickButtons('query', queryBooks);

window.addEventListener('load', function () {
    if (window.location.pathname == indexUrlBooks) { 
    }
})