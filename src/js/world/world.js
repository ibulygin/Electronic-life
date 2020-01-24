(function() {
    let charFromElement = app.charFromElement;    
    let Grid = app.Grid;
    let Vector = app.Vector;
    let elementFromChar = app.elementFromChar;
    let directions = app.directions;
    function World(map, legend) {
        let grid = new Grid(map[0].length, map.length);//Создаем пустой массив 
        this.grid = grid;
        this.legend = legend;
        /**Для карты берем каждый элемент массива (строку) и ее инндекс
         * Идем циклом  по строке строке
         * И меняем каждый элемент grid(сетки) в соответствии с картой, что бы работать с ней 
         * как с одномерный массивом
         */
        map.forEach(function (line, y) {
            for (let x = 0; x < line.length; x++)
                grid.set(new Vector(x, y),
                /**на основе текущего знака создаем объект и меняем
                 * элемент массива Grig на него
                 */
                    elementFromChar(legend, line[x]));
        });
    };
    
    World.prototype.toString = function () {
        let output = "";
        for (let y = 0; y < this.grid.height; y++) {
            for (x = 0; x < this.grid.width; x++) {
                let element = this.grid.get(new Vector(x, y));
                output += charFromElement(element);
            }
            output += "\n";
        }
        return output;
    }

    World.prototype.turn = function () {
        let acted = [];
        /**grid - одномерный массив созданный на основе карты
         * для каждого элемента массива 1й аргумент - зверь или 
         * пустое пространство, второе его индекс
         */
        this.grid.forEach(function (critter, vector) {
            /**Если у элемента есть метод act - это зверь
             * и если этого зверя мы не рассматривали(он мог переместиться 
             * на клетку которую мы проверяем) то добавляем его 
             * в массив просмотренных объектов и 
             * выполняем метод letAct из мира, передавая как аргумент
             * объект зверя и его индекс в массиве
             */
            if (critter.act && acted.indexOf(critter) == -1) {
                acted.push(critter);
                this.letAct(critter, vector);
            }
        }, this)// для привязки this анонимной функции к объекту мира
    }
    
    World.prototype.letAct = function (critter, vector) {
        let action = critter.act(new View(this, vector));
        //Если есть действие и его тип move
        if (action && action.type == "move") {
            // новое положение зверя
            let dest = this.checkDestination(action, vector);
            // Если нам вернулось новое положение зверя и в сетке оно свободно
            if (dest && this.grid.get(dest) == null) {
                //освобождаем текущую клетку 
                this.grid.set(vector, null);
                //Назначаем зверю новую
                this.grid.set(dest, critter)
            }
        }
    };
    
    World.prototype.checkDestination = function (action, vector) {
        //Если путь валидный (содержится в directions)
        if (directions.hasOwnProperty(action.direction)) {
            //Вычисляем новое положение
            let dest = vector.plus(directions[action.direction]);
            // если новое положение в пределах карты то возвращаем его
            if (this.grid.isInside(dest))
                return dest;
        }
    }
    
    app.World = World;
})(app)