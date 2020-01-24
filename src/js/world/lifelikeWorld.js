(function() {
    let World = app.World;
    let View = app.View;
    let actionTypes = app.actionTypes;
    function LifelikeWorld(map, legend) {
        World.call(this, map, legend);
    }
    LifelikeWorld.prototype = Object.create(World.prototype);
   
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

    app.LifelikeWorld = LifelikeWorld;
})(app)