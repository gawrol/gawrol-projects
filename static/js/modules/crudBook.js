import { post } from './fetch.js';
import { blueprint } from './blueprintBook.js';
import { books, booksUl } from '../books.js';
import { clickButtons } from './complementary.js';

function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i=0; i<length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function createBook(event, data={}) {
    if (event) {
        data.id = makeId(10);
        data.volumeInfo = {};
        data.volumeInfo.title = document.getElementById('title').value;
        data.volumeInfo.authors = [];
        data.volumeInfo.imageLinks = {};
        data.volumeInfo.imageLinks.thumbnail = '';
    }

    const id = data.id;

    post(createUrlBooks, {book: data}, 'POST')
        .then(data => {
            if (data.book.idCache == id) {
                let book = blueprint(data.book, false);
                booksUl.insertBefore(book, booksUl.children[0]);
                if (books.length > 1) {
                    books.unshift(data.book);
                } else {
                    books.push(data.book);
                }
                if (document.getElementById(id)) {
                    document.getElementById(id).remove();
                }
            }
        });
}

clickButtons('create', createBook)

function deleteBook(event, data={}) {
    const id = data.id;

    post(deleteUrlBooks, {book: data}, 'DELETE')
        .then(data => {
            if (data.book.id == id) {
                const book = document.getElementById(id);
                book.remove();
                const objectId = id;
                const bookIndex = books.findIndex( ({ id }) => id == objectId);
                books.splice(bookIndex, 1);
            }
        });
}

clickButtons('delete', deleteBook)

export { createBook, deleteBook };