import { createBook, deleteBook } from './crudBook.js';

const maxWidth = '150px';

function blueprint(el, query=false) {
    // Create book li element
    let book = document.createElement('li');
    book.id = el.id;
    book.classList.add('list-inline-item', 'my-2');

    //Div for reading books
    let readDiv = document.createElement('div');
    readDiv.id = 'read' + el.id;
    // readDiv.classList.add('');

        // Thumbnail 
        let imgDiv = document.createElement('div');
        // imgDiv.classList.add('');
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
            image.src = mediaUrl+el.volumeInfo.imageLinks.thumbnail;
        }
        image.alt = 'thumbnail';
        image.style.maxWidth = maxWidth;
        image.classList.add('img-thumbnail');
        imgDiv.appendChild(image);
        readDiv.appendChild(imgDiv);

        // Title text
        let textTitle = document.createElement('div');
        textTitle.id = 't' + el.id;
        textTitle.innerHTML = el.volumeInfo.title;
        textTitle.classList.add('text-truncate', 'mt-2');
        textTitle.style.fontWeight = "200";
        textTitle.style.maxWidth = maxWidth;
        textTitle.addEventListener('click', function() {
            this.classList.toggle('text-truncate');
        })
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
        
        let textAuthors = document.createElement('div');
        textAuthors.id = 'a' + el.id;
        textAuthors.innerHTML = authorsComma;
        textAuthors.classList.add('text-truncate', 'mt-2');
        textAuthors.style.fontWeight = "200";
        textAuthors.style.maxWidth = maxWidth;
        textAuthors.addEventListener('click', function() {
            this.classList.toggle('text-truncate');
        })
        readDiv.appendChild(textAuthors);

        let form = document.createElement('form');
        // form.classList.add('');
        let button = document.createElement('button');
        button.type = 'button'
        // Button to add query book to local books
        if (query) {
            button.innerHTML = 'Add';
            button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'mt-2');
            const formData = new FormData();
            formData.append('id', el.id);
            formData.append('volumeInfo.title', el.volumeInfo.title);
            formData.append('volumeInfo.authors', JSON.stringify(authors));
            formData.append('volumeInfo.imageLinks.thumbUrl', imageUrl);
            button.addEventListener('click', function() {
                createBook(null, formData, 'query');
            })
        }
        // Button to delete local book
        if (!query) {
            button.innerHTML = 'Del';
            button.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'delete', 'mt-2');
            const formData = new FormData();
            formData.append('id', el.id);
            button.addEventListener('click', function() {
                deleteBook(null, formData);
            })
        }
        form.appendChild(button);
        readDiv.appendChild(form);

    // Add read div to book li
    book.appendChild(readDiv);

    return book;
}

export { blueprint };