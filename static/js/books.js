import { get } from './modules/fetch.js';
import { clickButtons } from './modules/complementary.js';
import { config } from './config.js';
import { blueprint } from './modules/blueprintBook.js';

// Define books ul
const booksUl = document.getElementById('booksUl');
// Define query ul
const queryUl = document.getElementById('queryUl');

// Define books array
let books = new Array();
// Define query array
let query = new Array();

function queryBooks() {
    let input = document.getElementById('search').value;
    const url = 'https://www.googleapis.com/books/v1/volumes?q='+input+'&key='+config.key;
    get(url)
        .then(data => {
            document.getElementById('queryUl').innerHTML = '';
            if (data.totalItems == 0) {
                queryUl.innerHTML = 'No results found';
                return;
            }
            query = data.items;
            console.log(query);
            for (let i = 0; i < query.length; i++) {
                let book = blueprint(query[i], true);
                queryUl.appendChild(book);
            }
            document.getElementById('results').classList.remove('hide');
            queryUl.classList.remove('hide');
        })
}

clickButtons('search', queryBooks);

function queryResults() {
    queryUl.classList.toggle('hide');
}

clickButtons('results', queryResults);

window.addEventListener('load', function () {
    if (window.location.pathname == indexUrlBooks) { 
        get(readUrlBooks)
            .then(data => {
                if (data.books.length != 0) {
                    books = data.books;
                    for (let i=0; i<books.length; i++) {
                        let book = blueprint(books[i], false);
                        booksUl.appendChild(book);
                    }
                }
            })
    }
})

export { books, booksUl };