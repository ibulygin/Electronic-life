(function() {
    function randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    app.randomElement = randomElement;
})(app)