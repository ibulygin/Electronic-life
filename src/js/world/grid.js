(function () {
    let Vector = app.Vector;

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
    };

    Grid.prototype.forEach = function (f, context) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let value = this.space[x + y * this.width];
                if (value != null) {
                    f.call(context, value, new Vector(x, y));
                }
            }
        }
    };

    app.Grid = Grid;
})(app)