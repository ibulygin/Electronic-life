(function() {
    function elementFromChar(legend, ch) {
        if (ch == " ") {
            return null;
        }
        /** Находим в переденном объекте legend ключ 
         * соответствующий символу и создаем новый объект
         * ссылочный тип которого равен, значению по 
         * найденому ключу
        */
        let element = new legend[ch]();
        /** Добавляем ему свойство по которому сможем
         * вытащить первоночальный символ из карты
        */
        element.originChar = ch;
        return element;
    };

    app.elementFromChar = elementFromChar;
})(app)