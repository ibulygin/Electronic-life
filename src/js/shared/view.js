(function(){
    let directions = app.directions;
    let charFromElement = app.charFromElement;
    let randomElement = app.randomElement;
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
    app.View = View;
})(app)