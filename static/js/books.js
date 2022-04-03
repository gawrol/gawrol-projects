import { get } from './modules/fetchBooks.js';
import { clickButtons } from './modules/complementary.js';
import { config } from './config.js';
import { blueprint } from './modules/blueprintBook.js';

// Define uls
const booksUl = document.getElementById('booksUl');
const queryUl = document.getElementById('queryUl');
const authorsUl = document.getElementById('authorsUl');
const authorsCacheUl = document.getElementById('authorsCacheUl');

const authorsCacheDd = document.getElementById('authorsCacheDd');

// Define arrays
let books = new Array();
let query = new Array();
let authors = new Array();
let authorsCache = new Array();

function queryBooks() {
    let input = document.getElementById('search').value;
    const url = 'https://www.googleapis.com/books/v1/volumes?q='+input+'&key='+config.key;
    get(url)
        .then(data => {
            queryUl.innerHTML = '';
            document.getElementById('queryDiv').classList.remove('hide');
            queryUl.classList.remove('hide');
            if (data.totalItems == 0) {
                queryUl.innerHTML = 'No results found';
                document.getElementById('resultsQuery').classList.add('hide');
                return;
            }
            query = data.items;
            console.log(query);
            for (let i = 0; i < query.length; i++) {
                let book = blueprint(query[i], true);
                queryUl.appendChild(book);
            }
            document.getElementById('resultsQuery').classList.remove('hide');
        })
}

clickButtons('search', queryBooks);

function queryResults() {
    queryUl.classList.toggle('hide');
}

clickButtons('resultsQuery', queryResults);

function booksResults() {
    booksUl.classList.toggle('hide');
}

clickButtons('resultsBooks', booksResults);

function findAuthors() {
    authorsUl.innerHTML = '';

    const inputAuthors = document.getElementById('authors');
    if (inputAuthors.value.length == 0) {
        authorsUl.classList.add('hide');
        return;
    }

    const results = authors.filter(findAuthor);

    function findAuthor(author) {
        return author.toLowerCase().includes(inputAuthors.value.toLowerCase());
    }

    if (results.length == 0) {
        authorsUl.classList.add('hide');
        return;
    }

    const inputWidth = inputAuthors.parentNode.offsetWidth + 'px';
    // console.log(results);
    for (let i=0; i<results.length; i++) {
        let li = document.createElement('li');
        li.classList.add('list-group-item');       
        li.innerHTML = results[i];
        li.style.width = inputWidth;

        authorsUl.appendChild(li);
    }

    document.addEventListener('click', function detectAuthors(event) {
        let el = event.target;    
            if (el == authorsUl || el == inputAuthors) {
                return;
            }
            else {
                for (let i=0; i<authorsUl.childNodes.length; i++) {
                    if (el == authorsUl.childNodes[i]) {
                        if (!authorsCache.includes(authorsUl.childNodes[i].innerHTML)){
                            authorsCache.push(authorsUl.childNodes[i].innerHTML);
                        } else {
                            break;
                        }
                        authorsCacheUl.innerHTML = '';
                        // authorsCacheUl.classList.remove('hide');
                        authorsCacheDd.classList.remove('hide');
                        for (let y=0; y<authorsCache.length; y++) {
                            let li = document.createElement('li');
                            li.classList.add('dropdown-item');
                            li.innerHTML = authorsCache[y];
                            li.addEventListener('click', function() {
                                authorsCache.splice(y, 1);
                                li.remove();
                                if (authorsCacheUl.childNodes.length == 0) {
                                    // authorsCacheUl.classList.add('hide');
                                    authorsCacheDd.classList.add('hide');
                                }
                            })
                            authorsCacheUl.appendChild(li);
                        }
                        inputAuthors.value = '';
                        break;
                    }
                }
                authorsUl.innerHTML = '';
                document.removeEventListener('click', detectAuthors);
                authorsUl.classList.add('hide');
                return;
            }
        })

    authorsUl.classList.remove('hide');
}

clickButtons('authors', findAuthors, 'keyup');
clickButtons('authors', findAuthors, 'click');

function createAuthors() {
    const a = document.getElementById('authors');
    if (!authorsCache.includes(a.value)){
        authorsCache.push(a.value);
    } else {
        return;
    }
    // authorsCache.push(a.value);
    a.value = '';
    authorsCacheUl.innerHTML = '';
    // authorsCacheUl.classList.remove('hide');
    authorsCacheDd.classList.remove('hide');
    for (let y=0; y<authorsCache.length; y++) {
        let li = document.createElement('li');
        // li.classList.add('list-group-item', 'bg-info');
        li.classList.add('dropdown-item');
        li.innerHTML = authorsCache[y];
        li.addEventListener('click', function() {
            authorsCache.splice(y, 1);
            li.remove();
            if (authorsCacheUl.childNodes.length == 0) {
                // authorsCacheUl.classList.add('hide');
                authorsCacheDd.classList.add('hide');
            }
        })
        authorsCacheUl.appendChild(li);
    }
}

clickButtons('createAuthor', createAuthors);

window.addEventListener('load', function () {
    if (window.location.pathname == indexUrlBooks) { 
        get(readUrlBooks)
            .then(data => {
                if (data.books.length != 0) {
                    books = data.books;
                    for (let i=0; i<books.length; i++) {
                        let book = blueprint(books[i], false);
                        booksUl.appendChild(book);
                        for (let y=0; y<books[i].volumeInfo.authors.length; y++){
                            if (!authors.includes(books[i].volumeInfo.authors[y])){
                                authors.push(books[i].volumeInfo.authors[y]);
                            }
                        }
                        console.log(books[0].volumeInfo.authorsDB);
                    }
                }
            })
    }
})

export { books, booksUl, authorsCache };