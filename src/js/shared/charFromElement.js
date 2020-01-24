(function() {
    function charFromElement(element) {
        if (element == null) {
            return " ";
        } else {
            return element.originChar;
        }
    }
    
    app.charFromElement = charFromElement;
})(app)