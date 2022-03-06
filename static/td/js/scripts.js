hello = document.getElementById('test');
console.log(hello);
hello.addEventListener('click', function() {
    hello.innerHTML = 'Hello Poland';
});