import { createBook } from './crudBook.js';

function blueprint(el) {
    // Create book li element
    let book = document.createElement('li');
    book.id = el.id;
    book.classList.add('list-group-item');
    // Div for reading books
    let readDiv = document.createElement('div');
    readDiv.id = 'read' + el.id;
        // Title text
        const title = el.volumeInfo.title;
        let text = document.createElement('p');
        text.id = 'p' + el.id;
        text.innerHTML = el.volumeInfo.title;
        readDiv.appendChild(text);
        // Authors dict
        const authorsL = el.volumeInfo.authors.length;
        let authors = new Array();
        let authorsComma = new String();
        if (authorsL > 0) {
            for (let i=0; i<authorsL; i++) {
                authors[i] = el.volumeInfo.authors[i];
                authorsComma += el.volumeInfo.authors[i];
                if (i != authorsL-1) {
                    authorsComma += ', ';
                }
            }
        let dict = document.createElement('p');
        dict.id = 'd' + el.id;
        dict.innerHTML = authorsComma;
        readDiv.appendChild(dict);
        }
        // Button to add query book to local books
        let button = document.createElement('button');
        button.type = 'button'
        button.id = 'b' + el.id;
        button.innerHTML = 'Add';
        button.classList.add('btn', 'btn-primary');
        button.addEventListener('click', function() {
            createBook(null, {
                id: el.id,
                volumeInfo: {
                    title: title,
                    authors: authors,
                },
            });
        })
        readDiv.appendChild(button);

    // Add read div to book li
    book.appendChild(readDiv);

    return book;
}

export { blueprint };