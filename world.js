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
};
//Метод перемещения по осям т.е. смена координат
Vector.prototype.plus = function (other) {
    return new Vector(this.x + other.x, this.y + other.y);
};
//элемент (x, y) находится в позиции x + (y * width)
let grid = ["top left", "top middle", "top right",
    "bottom left", "bottom middle", "bottom right"
];

//Объект Сетка
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
    return this.space[vector.x + vector.y * this.width];
};

Grid.prototype.set = function (vector, value) {
    return this.space[vector.x + vector.y * this.width] = value;
};

Grid.prototype.forEach = function(f, context) {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var value = this.space[x + y * this.width];
        if (value != null)
          f.call(context, value, new Vector(x, y));
      }
    }
  };


// Программный интерфейс существ

//Возможные направления движения существ
var directions = {
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
};

function BouncingCritter() {
    this.direction = randomElement(Object.keys(directions));
};

BouncingCritter.prototype.act = function (view) {
    if (view.look(this.direction) != " ") {
        this.direction = view.find(" ") || "s"
    }
    return {
        type: "move",
        direction: this.direction
    }
};

//Мировой объект

function elementFromChar(legend, ch) {
    if (ch == " ") {
        return null;
    };

    let element = new legend[ch]();

    element.originChar = ch;
    return element;
};

function World(map, legend) {
    let grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;

    map.forEach(function(line, y) {
        for (let x = 0; x < line.length; x++) {
            grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
        }
    })
}

function charFromElement(element) {
    if (element == null){
        return " ";
    };

    return element.originChar;
};

World.prototype.toString = function() {
    let output = "";

    for (let y = 0; y < this.grid.height; y++){
        for (let x = 0; x < this.grid.width; x++) {
            let element = this.grid.get(new Vector(x, y));

            output += charFromElement(element);
        }
        output += "\n";
    }
    return output;
};

//Стена

function Wall() {

};

World.prototype.turn = function() {
    let acted = [];
    this.grid.forEach(function(critter, vector){
        if (critter.act && acted.indexOf(critter) == -1) {
            acted.push(critter);
            this.letAct(critter, vector);
        }
    }, this)
};

World.prototype.letAct = function(critter, vector) {
    let action = critter.act(new View(this, vector));

    if (action && action.type == "move") {
        var dest = this.checkDestination(action, vector);

        if (dest && this.grid.get(dest) == null) {
            this.grid.set(vector, null);
            this.grid.set(dest, critter);
        }
    }
};

World.prototype.checkDestination = function(action, vector) {
    if (directions.hasOwnProperty(action.direction)) {
        let dest = vector.plus(directions[action.direction]);

        if(this.grid.isInside(dest)){
            return dest;
        };
    };
};

function View(world, vector) {
    this.world = world;
    this.vector = vector;
};

View.prototype.look = function(dir) {
    let targrt = this.vector.plus(directions[dir]);

    if (this.world.grid.isInside(targrt)){
        return charFromElement(this.world.grid.get(targrt))
    }
    else {
        return "#"
    }
};

View.prototype.findAll = function(ch) {
    let found = [];

    for (let dir in directions) {
        if (this.look(dir) == ch) {
            found.push(dir);
        }
    }
    return found;
};

View.prototype.find = function(ch) {
    let found = this.findAll(ch);
    if (found.length == 0) {
        return 0
    }
    return randomElement(found);
}

let world = new World(plan, {"#": Wall, "o": BouncingCritter});

for (var i = 0; i < 5; i++) {
    world.turn();
    console.log(world.toString());
}
let directionNames = Object.keys(directions);

function dirPlus(dir, n) {
    let index = directionNames.indexOf(dir);

    return directionNames[(index + n + 8 ) % 8];
};

function WallFollower() {
    this.dir = "s"
};

WallFollower.prototype.act = function(view) {
    let star = this.dir;

    if (view.look(dirPlus(this.dir - 3)) != " ") {
        start = this.dir = dirPlus(this.dir, -2);
    };
    while (view.look(this.dir) != " ") {
        this.dir = dirPlus(this.dir, 1);
        if (this.dir == start) break;
    };

    return {type: "name", direction: this.dir}
}