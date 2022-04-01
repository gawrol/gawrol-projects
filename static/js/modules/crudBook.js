import { post } from './fetchBooks.js';
import { blueprint } from './blueprintBook.js';
import { books, booksUl, authorsCache } from '../books.js';
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
        const formData = new FormData();
        const fileField = document.getElementById('thumbFile');

        formData.append('id', makeId(10));
        formData.append('volumeInfo.title', document.getElementById('title').value);
        formData.append('volumeInfo.authors', JSON.stringify(authorsCache));
        formData.append('volumeInfo.imageLinks.thumbUrl', '');
        formData.append('volumeInfo.imageLinks.thumbFile', fileField.files[0]);

        data = formData;
    }
    const id = data.get('id');

    post(createUrlBooks, data, 'POST')
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
    const id = data.get('id');

    post(deleteUrlBooks, data, 'POST')
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