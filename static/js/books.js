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

function findAuthorsList() {
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
        li.addEventListener('click', function() {
            if (!authorsCache.includes(results[i])){
                authorsCache.push(results[i]);
            } else {
                return;
            }
            authorsCacheUl.innerHTML = '';
            // authorsCacheUl.classList.remove('hide');
            authorsCacheDd.classList.remove('hide');
            for (let y=0; y<authorsCache.length; y++) {
                let li2 = document.createElement('li');
                li2.classList.add('dropdown-item');
                li2.innerHTML = authorsCache[y];
                li2.addEventListener('click', function() {
                    authorsCache.splice(y, 1);
                    li2.remove();
                    if (authorsCacheUl.childNodes.length == 0) {
                        // authorsCacheUl.classList.add('hide');
                        authorsCacheDd.classList.add('hide');
                    }
                })
                authorsCacheUl.appendChild(li2);
            }
            inputAuthors.value = '';
            authorsUl.innerHTML = '';
            authorsUl.classList.add('hide');
        })

        authorsUl.appendChild(li);
    }

    authorsUl.classList.remove('hide');
    cancelList(authorsUl, inputAuthors);
}

clickButtons('authors', findAuthorsList, 'keyup');
clickButtons('authors', findAuthorsList, 'click');

function queryAuthorlist() {
    authorsQueryUl.innerHTML = '';

    const queryAuthors = document.getElementById('authorQuery');
    if (queryAuthors.value.length == 0) {
        authorsQueryUl.classList.add('hide');
        return;
    }

    const results = authors.filter(findAuthor);

    function findAuthor(author) {
        return author.toLowerCase().includes(queryAuthors.value.toLowerCase());
    }

    if (results.length == 0) {
        authorsQueryUl.classList.add('hide');
        return;
    }

    const inputWidth = queryAuthors.parentNode.offsetWidth + 'px';
    for (let i=0; i<results.length; i++) {
        let li = document.createElement('li');
        li.classList.add('list-group-item');       
        li.innerHTML = results[i];
        li.style.width = inputWidth;
        li.addEventListener('click', function() {
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
                    queryAuthors.value = '';
                    authorsQueryUl.innerHTML = '';
                    authorsQueryUl.classList.add('hide');
                })
        })

        authorsQueryUl.appendChild(li);
    }
    authorsQueryUl.classList.remove('hide');
    cancelList(authorsQueryUl, queryAuthors);
}

clickButtons('author', queryAuthorlist, 'keyup');
clickButtons('author', queryAuthorlist, 'click');

function queryAuthor() {
    const queryAuthors = document.getElementById('authorQuery');

    document.addEventListener('click', function detectAuthor(event) {
        let el = event.target;   
        if (el == document.getElementById('authorQueryButton')) {

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
                    queryAuthors.value = '';
                    authorsQueryUl.innerHTML = '';
                    authorsQueryUl.classList.add('hide');
                })
            document.removeEventListener('click', detectAuthor);
            return;
        }    
    })
}

clickButtons('createAuthorQuery', queryAuthor, 'click');

function queryUserlist() {
    userQueryUl.innerHTML = '';

    const queryUsers = document.getElementById('userQuery');
    if (queryUsers.value.length == 0) {
        userQueryUl.classList.add('hide');
        return;
    }

    const results = users.filter(findUser);

    function findUser(user) {
        return user.toLowerCase().includes(queryUsers.value.toLowerCase());
    }

    if (results.length == 0) {
        userQueryUl.classList.add('hide');
        return;
    }

    const inputWidth = queryUsers.parentNode.offsetWidth + 'px';
    for (let i=0; i<results.length; i++) {
        let li = document.createElement('li');
        li.classList.add('list-group-item');       
        li.innerHTML = results[i];
        li.style.width = inputWidth;
        li.addEventListener('click', function() {
            get(readUrlBooks, {user: userQueryUl.childNodes[i].innerHTML})
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
                    queryUsers.value = '';
                    userQueryUl.innerHTML = '';
                    userQueryUl.classList.add('hide');
                })
        })

        userQueryUl.appendChild(li);
    }
    userQueryUl.classList.remove('hide');
    cancelList(userQueryUl, queryUsers);
}

clickButtons('usero', queryUserlist, 'keyup');
clickButtons('usero', queryUserlist, 'click');

function cancelList(list, input) {
    if (list.getAttribute('listener') !== 'true') {
        list.setAttribute('listener', 'true');
        document.addEventListener('click', function detectList(event) {
            let el = event.target; 
            let x = 0;  
            for (let i=0; i<list.childNodes.length; i++) {
                if (el == list.childNodes[i]) {
                    x++;
                }
            }
            if (el == input) {
                x++;
            }

            if (x == 0) {
                list.innerHTML = '';
                list.classList.add('hide');
                list.removeAttribute('listener');
                document.removeEventListener('click', detectList);
                return;
            }
                
        })
    }
}

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

clickButtons('createUserQuery', queryUser, 'click');

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
                } else {
                    if (logged.length != 0) {
                        booksUl.innerHTML = 'No books in your bookshelve.';
                    } else {
                        booksUl.innerHTML = 'Please login or register to have access to bookshelve.';
                    }
                }
                for (let y=0; y<data.authors.length; y++){
                    if (!authors.includes(data.authors[y].name)){
                        authors.push(data.authors[y].name);
                    }
                }
                for (let z=0; z<data.users.length; z++){
                    if (!users.includes(data.users[z].username)){
                        users.push(data.users[z].username);
                    }
                }
            })
    }
})

export { books, booksUl, authors, authorsCache };