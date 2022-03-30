import { get } from './modules/fetch.js';
import { clickButtons } from './modules/complementary.js';
import { config } from './config.js';
import { blueprint } from './modules/blueprintBook.js';

// Define books ul
const booksUl = document.getElementById('books');
// Define query ul
const queryUl = document.getElementById('query');

// Define books array
let books = new Array();
// Define query array
let query = new Array();

function queryBooks() {
    let input = document.getElementById('search').value;
    const url = 'https://www.googleapis.com/books/v1/volumes?q='+input+'&key='+config.key;
    get(url)
        .then(data => {
            if (data.totalItems == 0) {
                return;
            }
            console.log(data.items)
            query = data.items;
            for (let i = 0; i < query.length; i++) {
                let book = blueprint(query[i]);
                queryUl.appendChild(book);
            } 
        })
}

clickButtons('search', queryBooks);

window.addEventListener('load', function () {
    if (window.location.pathname == indexUrlBooks) { 
        get(readUrlBooks)
            .then(data => {
                console.log(data.books);
                if (data.books.length != 0) {
                    books = data.books;
                    for (let i=0; i<books.length; i++) {
                        let book = blueprint(books[i]);
                        booksUl.appendChild(book);
                    }
                }
            })
    }
})

export { books, booksUl};