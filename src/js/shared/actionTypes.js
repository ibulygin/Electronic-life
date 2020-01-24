(function () {
    let actionTypes = Object.create(null);
    let elementFromChar = app.elementFromChar;
    actionTypes.grow = function (critter) {
        critter.energy += 0.5;
        return true;
    }

    actionTypes.move = function (critter, vector, action) {
        let dest = this.checkDestination(action, vector);
        if (dest == undefined ||
            critter.energy <= 1 ||
            this.grid.get(dest) != null) {
            return false;
        }
        critter.energy -= 1;
        this.grid.set(vector, null);
        this.grid.set(dest, critter);
        return true;
    };

    actionTypes.eat = function (critter, vector, action) {
        let dest = this.checkDestination(action, vector);
        /**
         * Если направление не undefined то atDest объект существа 
         */
        let atDest = dest != undefined && this.grid.get(dest);
        /**
         * Если atDest = null или енегргии не хватает 
         * то возвращаем false, существо не может есть
         */
        if (!atDest || atDest.energy == null) {
            return false;
        }
        /**
         * Присваиваем зверю энергию съеденного
         * Меняем его положение
         */
        critter.energy += atDest.energy;
        this.grid.set(dest, null);
        return true;
    };

    actionTypes.reproduce = function (critter, vector, action) {
        //Создаем инстанс текущего существа
        let baby = elementFromChar(this.legend, critter.originChar);
        /** 
         * dest новая координата
         */
        let dest = this.checkDestination(action, vector);
        /** проверяем вернулось ли значение координат
         * Достаточно ли энергии у зверя
         * проверяем есть ли пустое место
         */
        if (dest == undefined ||
            critter.energy <= 2 * baby.energy ||
            this.grid.get(dest) != null) {
            return false;
        }
        /** вычитаем энергию у зверя*/
        critter.energy -= 2 * baby.energy;
        // запихиваем нового зверя в dest
        this.grid.set(dest, baby);
        return true;
    };

    app.actionTypes = actionTypes;
})(app)