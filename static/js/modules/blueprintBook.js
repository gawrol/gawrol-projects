function blueprint(el) {
    // Create task li element
    let book = document.createElement('li');
    book.id = el.id;
    book.classList.add('list-group-item');
    // Div for reading tasks
    let readDiv = document.createElement('div');
    readDiv.id = 'read' + el.id;
        // Inner text
        let text = document.createElement('p');
        text.id = 'p' + el.id;
        text.innerHTML = el.volumeInfo.title;
        readDiv.appendChild(text);
    // Add read div to task li
    book.appendChild(readDiv);

    return book;
}

export { blueprint };