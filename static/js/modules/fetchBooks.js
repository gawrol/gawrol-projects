// Substract CSRF token from cookie for AJAX POST request
const cookie = document.cookie;
const csrftoken = cookie.substring(cookie.indexOf('=') + 1);

async function get(url = '', api = 'false') {
    if (api == 'false') {
        let urlCache = window.location.search;
        if (urlCache.length != 0) {
            if (url.indexOf('?') != -1) {
                const urlSearchParams1 = new URLSearchParams(urlCache);
                let params1 = Object.fromEntries(urlSearchParams1.entries());
                const urlSearchParams2 = new URLSearchParams(url.substring(url.indexOf('?')));
                let params2 = Object.fromEntries(urlSearchParams2.entries());
                
                const returnedTarget = Object.assign(params1, params2);
                urlCache = '?' + new URLSearchParams(returnedTarget);
                let urlTemp = url.substring(0, url.indexOf('?'));
                url = urlTemp + urlCache;
            }
            else {
                url = url + urlCache;
            }
        } else {
            if (url.indexOf('?') != -1) {
                urlCache = url.substring(url.indexOf('?'));
            }
        }

        if (urlCache.length != 0) {
            const nextURL = indexUrlBooks+urlCache;
            const nextTitle = '';
            const nextState = { additionalInformation: 'Updated the URL with JS' };
            // This will create a new entry in the browser's history, without reloading
            window.history.pushState(nextState, nextTitle, nextURL);
        }
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