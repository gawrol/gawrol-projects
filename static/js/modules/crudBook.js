import { post } from './fetchBooks.js';
import { blueprint } from './blueprintBook.js';
import { books, booksUl, authors, authorsCache, resetQuery } from '../books.js';
import { clickButtons, showError } from './complementary.js';

function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i=0; i<length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function createBook(event, data={}, source='') {
    if (event) { 
        const formData = new FormData();
        const fileField = document.getElementById('thumbFile');

        formData.append('id', makeId(10));
        let title = document.getElementById('title').value;
        if (title.length == 0) {
            // title = 'NoTitle';
            let errorC = document.getElementById('errorCreate');
            showError(errorC, "1 or more characters for title.");
            return;
        }
        formData.append('volumeInfo.title', title);
        if (document.getElementById('authors').value != 0) {
            authorsCache.push(document.getElementById('authors').value);
        }
        formData.append('volumeInfo.authors', JSON.stringify(authorsCache));
        formData.append('volumeInfo.imageLinks.thumbUrl', '');
        formData.append('volumeInfo.imageLinks.thumbFile', fileField.files[0]);

        data = formData;
    }
    const id = data.get('id');

    post(createUrlBooks, data, 'POST')
        .then(data => {
            if (data.hasOwnProperty('login')) {
                if (source.length == 0) {
                    let errorC = document.getElementById('errorCreate');
                    showError(errorC, "Please login or register to add a book.");
                    return;
                }
                else if (source == 'query') {
                    let errorC = document.getElementById('errorQuery');
                    showError(errorC, "Please login or register to add a book.");
                    return;
                }
            }
            else if (data.book.idCache == id) {
                resetQuery();

                let book = blueprint(data.book, false);
                if (books.length > 0) {
                    books.unshift(data.book);
                } else {
                    books.push(data.book);
                    booksUl.innerHTML = '';
                }
                booksUl.insertBefore(book, booksUl.children[0]);
                document.getElementById('resultsBooks').parentNode.classList.remove('hide');
                if (document.getElementById(id)) {
                    document.getElementById(id).remove();
                }
                for (let y=0; y<data.book.volumeInfo.authors.length; y++){
                    if (!authors.includes(data.book.volumeInfo.authors[y])){
                        authors.push(data.book.volumeInfo.authors[y]);
                    }
                }
                authorsCache.length = 0;
                authorsCacheUl.innerHTML = '';
                authorsCacheDd.classList.add('hide');
                return;
            }
        });
}

clickButtons('create', createBook)

function deleteBook(event, data={}) {
    const id = data.get('id');

    post(deleteUrlBooks, data, 'POST')
        .then(data => {
            if (data.hasOwnProperty('login')) {
                let errorD = document.getElementById('errorDelete');
                showError(errorD, "Please login or register to remove a book.");
                return;
            }
            else if (data.hasOwnProperty('error')) {
                let errorD = document.getElementById('errorDelete');
                showError(errorD, "Can't remove someone else's book.");
                return;
            }
            else if (data.book.id == id) {
                const book = document.getElementById(id);
                book.remove();
                const objectId = id;
                const bookIndex = books.findIndex( ({ id }) => id == objectId);
                books.splice(bookIndex, 1);
                if (books.length == 0) {
                    booksUl.innerHTML = 'No books in your bookshelve.';
                    document.getElementById('resultsBooks').parentNode.classList.add('hide');
                }
                return;
            }
        });
}

clickButtons('delete', deleteBook)

export { createBook, deleteBook };