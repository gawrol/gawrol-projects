import { createBook, deleteBook } from './crudBook.js';

function blueprint(el, query=false) {
    // Create book li element
    let book = document.createElement('li');
    book.id = el.id;
    book.classList.add('list-group-item', 'list-group-item-action');
    // Div for reading books
    let readDiv = document.createElement('div');
    readDiv.id = 'read' + el.id;
        // Title text
        let textTitle = document.createElement('p');
        textTitle.id = 'p' + el.id;
        textTitle.innerHTML = el.volumeInfo.title;
        readDiv.appendChild(textTitle);
        // Authors dict
        let authors = new Array();
        let authorsComma = new String();
        if (el.volumeInfo.authors == undefined) {
            authorsComma = 'unknown';
        } else {
            const authorsL = el.volumeInfo.authors.length;
            if (authorsL > 0) {
                for (let i=0; i<authorsL; i++) {
                    authors[i] = el.volumeInfo.authors[i];
                    authorsComma += el.volumeInfo.authors[i];
                    if (i != authorsL-1) {
                        authorsComma += ', ';
                    }
                }
            }
        }
        
        let textAuthors = document.createElement('p');
        textAuthors.id = 'd' + el.id;
        textAuthors.innerHTML = authorsComma;
        readDiv.appendChild(textAuthors);
        
        // Thumbnail 
        let image = document.createElement('IMG');
        let imageUrl = new String();
        if (query) {
            if (el.volumeInfo.imageLinks == undefined) {
            }
            else {
                image.src = el.volumeInfo.imageLinks.thumbnail;
                imageUrl = image.src;
            }
        } else {
            image.src = mediaUrlBooks+el.volumeInfo.imageLinks.thumbnail;
        }
        image.alt = 'thumbnail';
        image.height = '100';
        image.width = '100';
        readDiv.appendChild(image);

        let button = document.createElement('button');
        button.type = 'button'
        // Button to add query book to local books
        if (query) {
            button.innerHTML = 'Add';
            button.classList.add('btn', 'btn-primary');
            button.addEventListener('click', function() {
                createBook(null, {
                    id: el.id,
                    volumeInfo: {
                        title: el.volumeInfo.title,
                        authors: authors,
                        imageLinks: {
                            thumbnail: imageUrl,
                        }
                    },
                });
            })
        }
        // Button to delete local book
        if (!query) {
            button.innerHTML = 'Del';
            button.classList.add('btn', 'btn-danger', 'delete');
            button.addEventListener('click', function() {
                deleteBook(null, {
                    id: el.id,
                });
            })
        }
        readDiv.appendChild(button);

    // Add read div to book li
    book.appendChild(readDiv);

    return book;
}

export { blueprint };