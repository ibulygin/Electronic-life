
let plan = ["############################",
    "#      #    #      o      ##",
    "#                          #",
    "#          #####           #",
    "##         #   #    ##     #",
    "###           ##     #     #",
    "#           ###      #     #",
    "#   ####                   #",
    "#   ##       o             #",
    "# o  #         o       ### #",
    "#    #                     #",
    "############################"
];

function Vector(x, y) {
    this.x = x;
    this.y = y;
}
Vector.prototype.plus = function (other) {
    return new Vector(this.x + other.x, this.y + other.y)
};

let grid = [
    ["top left", "top middle", "top right"],
    ["bottom left", "bottom middle", "bottom right"]
];


let directions = {
    "n": new Vector(0, -1),
    "ne": new Vector(1, -1),
    "e": new Vector(1, 0),
    "se": new Vector(1, 1),
    "s": new Vector(0, 1),
    "sw": new Vector(-1, 1),
    "w": new Vector(-1, 0),
    "nw": new Vector(-1, -1)
};
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

let directionNames = "n ne e se s sw w nw".split(" ");

function BouncingCritter() {
    this.direction = randomElement(directionNames);
}
BouncingCritter.prototype.act = function (view) {
    if (view.look(this.direction) != " ") {
        this.direction = view.find(" ") || "s";
    }
    return {
        type: "move",
        direction: this.direction
    };
}

function Grid(width, height) {
    this.space = new Array(width * height);
    this.width = width;
    this.height = height;
};
Grid.prototype.isInside = function (vector) {
    return vector.x >= 0 && vector.x < this.width &&
        vector.y >= 0 && vector.y < this.height;
};
Grid.prototype.get = function (vector) {
    //находим элемент в одномерном массиве, с колличеством элемента как в сетке
    return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function (vector, value) {
    /**находим элемент в одномерном массиве, с колличеством элемента как в сетке
     *  меняем его значение
     * */
    this.space[vector.x + this.width * vector.y] = value;
}

Grid.prototype.forEach = function (f, context) {
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            let value = this.space[x + y * this.width];
            if (value != null) {
                f.call(context, value, new Vector(x, y));
            }
        }
    }
}

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
}

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
}

function charFromElement(element) {
    if (element == null) {
        return " ";
    } else {
        return element.originChar;
    }
}

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

function Wall() {}

let world = new World(plan, {
    "#": Wall,
    "o": BouncingCritter
});


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

function View(world, vector) {
    this.world = world;
    this.vector = vector;
}
/** */
View.prototype.look = function (dir) {
    //цель относительно текущего положения
    let target = this.vector.plus(directions[dir]);
    //Если цель в пределах карты 
    if (this.world.grid.isInside(target)) {
        //возвращаем символ объекта, на который смотрим
        return charFromElement(this.world.grid.get(target));
    } else {
        return "#";
    }
}

View.prototype.findAll = function (ch) {
    let found = [];
    for (let dir in directions) {
        /*смотрим по каждому напрвлению
        * добавляем направления с нужным символом        
        **/
        if (this.look(dir) == ch) {
            found.push(dir);
        }

    }
    //возвращаем массив направлений в которых есть символы
    return found;
}

View.prototype.find = function (ch) {
    let found = this.findAll(ch);
    if (found.length == 0) return null;
    return randomElement(found);
}
//напрввление по часовой стрелке
function dirPlus(dir, n) {
    let index = directionNames.indexOf(dir);
    return directionNames[(index + n + 8) % 8];//новое направление 1 -> по часовой на 45
}

function WallFollower() {
    this.dir = "s";
}

WallFollower.prototype.act = function (view) {
    let start = this.dir;
    if (view.look(dirPlus(this.dir, -3)) != " ") {
        start = this.dir = dirPlus(this.dir, -2);

    }
    while (view.look(this.dir) != " ") {
        this.dir = dirPlus(this.dir, 1);
        if (this.dir == start) break;
    }
    return {
        type: "move",
        direction: this.dir
    };
}

function LifelikeWorld(map, legend) {
    World.call(this, map, legend);
}
LifelikeWorld.prototype = Object.create(World.prototype);

let actionTypes = Object.create(null);

LifelikeWorld.prototype.letAct = function (critter, vector) {
    let action = critter.act(new View(this, vector));
    /**
     * Проверяем было ли передано дествие
     * существует ли переданны тип(сужествует ли функция)
     * И в конце возвращает ли эта функция true
     */
    let handled = action &&
        action.type in actionTypes &&
        actionTypes[action.type].call(this, critter, vector, action);
    /* Если действие не передано, то он не двигается 
    * теряет свой заряд
    * если заряда нет, то очищаем клетку
    **/
    if (!handled) {
        critter.energy -= 0.2;
        if (critter.energy <= 0) {
            this.grid.set(vector, null);
        }
    };
};

actionTypes.grow = function (critter) {
    critter.energy += 0.5;
    return true;
}

actionTypes.move = function (critter, vector, action) {
    let dest = this.checkDestination(action, vector);
    if (dest == null ||
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
     * Если направление не null то atDest объект существа 
     */
    let atDest = dest != null && this.grid.get(dest);
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
    if (dest == null ||
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

function Plant() {
    this.energy = 3 + Math.random() * 4;
}

Plant.prototype.act = function (view) {
    if (this.energy > 15) {
        let space = view.find(" ");
        if (space) {
            return {
                type: "reproduce",
                direction: space
            };
        }
    }
    if (this.energy < 20) {
        return {
            type: "grow"
        };
    }
}

function PlantEater() {
    this.energy = 20;
}

PlantEater.prototype.act = function (view) {
    let space = view.find(" ");
    if (this.energy > 60 && space) {
        return {
            type: "reproduce",
            direction: space
        };
    }
    let plant = view.find("*");
    if (plant) {
        return {
            type: "eat",
            direction: plant
        };
    }
    if (space) {
        return {
            type: "move",
            direction: space
        };
    }
}

function SmartPlantEater() {
    this.energy = 30;
    this.direction = "e";
}

SmartPlantEater.prototype.act = function (view) {
    let space = view.find(" ");
    if (this.energy > 90 && space) {
        return {
            type: "reproduce",
            direction: space
        };
    }
    let plant = view.find("*");
    if (plant) {
        return {
            type: "eat",
            direction: plant
        };
    }
    if (view.look(this.direction) != " " && space) {
        this.direction = space;
    }
    return {
        type: "move",
        direction: this.direction
    };
}

function Tiger() {
    this.energy = 100;
    this.direction = "w";
};


function Tiger() {
    this.energy = 100;
    this.direction = "w";
}

Tiger.prototype.act = function (view) {

    let prey = view.findAll("O");

    if (prey.length) {
        return {
            type: "eat",
            direction: randomElement(prey)
        };
    }
    let space = view.find(" ");
    if (this.energy > 200 && space) {
        return {
            type: "reproduce",
            direction: space
        };
    }
    if (view.look(this.direction) != " " && space) {
        this.direction = space;
    }
    return {
        type: "move",
        direction: this.direction
    };
}