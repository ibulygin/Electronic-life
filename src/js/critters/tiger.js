(function () {
    let randomElement = app.randomElement;

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
    };

    app.Tiger = Tiger;
})(app)