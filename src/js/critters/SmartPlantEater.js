(function(){
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
    };

    app.SmartPlantEater = SmartPlantEater;
})(app)