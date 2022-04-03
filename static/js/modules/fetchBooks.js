// Substract CSRF token from cookie for AJAX POST request
const cookie = document.cookie;
const csrftoken = cookie.substring(cookie.indexOf('=') + 1);

async function get(url = '', params = {}) {
    if (Object.keys(params).length != 0) {
        url = url + '?' + new URLSearchParams(params);
    }
    
    const response = await fetch(url);
    return response.json();
}

async function post(url = '', data = {}, type= 'POST') {
    const response = await fetch(url, {
        method: type,
        headers: {
            'X-CSRFToken': csrftoken,
        },
        body: data

    });
    return response.json(); // parses JSON response into native JavaScript objects
}

export { get, post };