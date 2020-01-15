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
            "############################"];

function Vector(x, y) {
    this.x = x;
    this.y = y;
};
//Метод перемещения по осям т.е. смена координат
Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
};
//элемент (x, y) находится в позиции x + (y * width)
let grid = ["top left",    "top middle",    "top right",
            "bottom left", "bottom middle", "bottom right"];

//Объект Сетка
function Grid(width, height){
    this.space = new Array(width * height);
    this.width = width;
    this.height = height;
};

Grid.prototype.isInside = function(vector) {
    return vector.x >= 0 && vector.x < this.width &&
            vector.y >= 0 && vector.y < this.height;
};

Grid.prototype.get = function(vector) {
    return this.space[vector.x + vector.y * this.width];
};

Grid.prototype.set = function(vector, value) {
    return this.space[vector.x + vector.y * this.width] = value;
};


// Программный интерфейс существ

//Возможные направления движения существ
var directions = {
    "n":  new Vector( 0, -1),
    "ne": new Vector( 1, -1),
    "e":  new Vector( 1,  0),
    "se": new Vector( 1,  1),
    "s":  new Vector( 0,  1),
    "sw": new Vector(-1,  1),
    "w":  new Vector(-1,  0),
    "nw": new Vector(-1, -1)
  };