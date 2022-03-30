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
    }

    let id = data.id;

    post(createUrlBooks, {book: data}, 'POST')
        .then(data => {
            if (data.book.id == id) {
                let book = document.getElementById(data.book.id);
                if (book == null) {
                    book = blueprint(data.book);
                }
                booksUl.insertBefore(book, booksUl.children[0]);
                document.getElementById('b'+data.book.id).remove();
                if (books.length > 1) {
                    books.unshift(data.book);
                } else {
                    books.push(data.book);
                }
                document.getElementById('query').innerHTML = '';
            }
        });
}

clickButtons('create', createBook)

export { createBook };