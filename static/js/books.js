import { get } from './modules/fetchBooks.js';
import { clickButtons } from './modules/complementary.js';
import { config } from './config.js';
import { blueprint } from './modules/blueprintBook.js';

// Define uls
const booksUl = document.getElementById('booksUl');
const queryUl = document.getElementById('queryUl');
const userQueryUl = document.getElementById('userQueryUl');
const authorsUl = document.getElementById('authorsUl');
const authorsQueryUl = document.getElementById('authorQueryUl');
const authorsCacheUl = document.getElementById('authorsCacheUl');

const authorsCacheDd = document.getElementById('authorsCacheDd');

// Define arrays
let books = new Array();
let query = new Array();
let authors = new Array();
let authorsCache = new Array();
let users = new Array();

function queryBooks() {
    let input = document.getElementById('search').value;
    if (input.length == 0) {
        return;
    }
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

function queryAuthor() {
    authorsQueryUl.innerHTML = '';

    const queryAuthors = document.getElementById('authorQuery');
    if (queryAuthors.value.length == 0) {
        authorsQueryUl.classList.add('hide');
        return;
    }

    const results = authors.filter(findAuthor);

    console.log(results);

    function findAuthor(author) {
        return author.toLowerCase().includes(queryAuthors.value.toLowerCase());
    }

    if (results.length == 0) {
        authorsQueryUl.classList.add('hide');
        return;
    }

    const inputWidth = queryAuthors.parentNode.offsetWidth + 'px';
    // console.log(results);
    for (let i=0; i<results.length; i++) {
        let li = document.createElement('li');
        li.classList.add('list-group-item');       
        li.innerHTML = results[i];
        li.style.width = inputWidth;

        authorsQueryUl.appendChild(li);
    }

    document.addEventListener('click', function detectAuthor(event) {
        let el = event.target;    
            if (el == authorsQueryUl || el == queryAuthors) {
                return;
            }
            else {
                for (let i=0; i<authorsQueryUl.childNodes.length; i++) {
                    if (el == authorsQueryUl.childNodes[i]) {
                        get(readUrlBooks, {author: authorsQueryUl.childNodes[i].innerHTML})
                            .then(data => {
                                booksUl.innerHTML = '';
                                if (data.books.length != 0) {
                                    books = data.books;
                                    for (let i=0; i<books.length; i++) {
                                        let book = blueprint(books[i], false);
                                        booksUl.appendChild(book);
                                        document.getElementById('resultsBooks').parentNode.classList.remove('hide');
                                    }
                                } else {
                                    booksUl.innerHTML = 'No matching records for specified query.';
                                }
                            })
                        queryAuthors.value = '';
                        break;
                    } else if (el == document.getElementById('authorQueryButton')) {
                        get(readUrlBooks, {author: queryAuthors.value})
                            .then(data => {
                                booksUl.innerHTML = '';
                                if (data.books.length != 0) {
                                    books = data.books;
                                    for (let i=0; i<books.length; i++) {
                                        let book = blueprint(books[i], false);
                                        booksUl.appendChild(book);
                                        document.getElementById('resultsBooks').parentNode.classList.remove('hide');
                                    }
                                } else {
                                    booksUl.innerHTML = 'No matching records for specified query.';
                                }
                            })
                        queryAuthors.value = '';
                        break;
                    }
                }
                authorsQueryUl.innerHTML = '';
                document.removeEventListener('click', detectAuthor);
                authorsQueryUl.classList.add('hide');
                return;
            }
        })

    authorsQueryUl.classList.remove('hide');
}

clickButtons('author', queryAuthor, 'keyup');
clickButtons('author', queryAuthor, 'click');

function queryUser() {
    const userQuery = document.getElementById('userQuery');

    document.addEventListener('click', function detectUser(event) {
        let el = event.target;    
            if (el == document.getElementById('userQueryButton')) {
                get(readUrlBooks, {user: userQuery.value})
                    .then(data => {
                        booksUl.innerHTML = '';
                        if (data.books.length != 0) {
                            books = data.books;
                            for (let i=0; i<books.length; i++) {
                                let book = blueprint(books[i], false);
                                booksUl.appendChild(book);
                                document.getElementById('resultsBooks').parentNode.classList.remove('hide');
                            }
                        } else {
                            booksUl.innerHTML = 'No matching records for specified query.';
                        }
                    })
                userQuery.value = '';
                document.removeEventListener('click', detectUser);
                return;        
            }
    })
}

clickButtons('usero', queryUser, 'click');

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
                booksUl.innerHTML = '';
                if (data.books.length != 0) {
                    books = data.books;
                    for (let i=0; i<books.length; i++) {
                        let book = blueprint(books[i], false);
                        booksUl.appendChild(book);
                        document.getElementById('resultsBooks').parentNode.classList.remove('hide');
                        // for (let y=0; y<books[i].volumeInfo.authors.length; y++){
                        //     if (!authorsQuery.includes(books[i].volumeInfo.authors[y])){
                        //         authorsQuery.push(books[i].volumeInfo.authors[y]);
                        //     }
                        // }
                    }
                    for (let y=0; y<books[0].volumeInfo.authorsDB.length; y++){
                        if (!authors.includes(books[0].volumeInfo.authorsDB[y].name)){
                            authors.push(books[0].volumeInfo.authorsDB[y].name);
                        }
                    }
                } else {
                    if (logged.length != 0) {
                        booksUl.innerHTML = 'No books in your bookshelve.';
                    } else {
                        booksUl.innerHTML = 'Please login or register to have access to bookshelve.';
                    }
                }
            })
    }
})

export { books, booksUl, authors, authorsCache };