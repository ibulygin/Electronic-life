(function () {
    let Wall = app.Wall;
    let Tiger = app.Tiger;
    let SmartPlantEater = app.SmartPlantEater;
    let Plant = app.Plant;
    let legend = {
        "#": Wall,
        "@": Tiger,
        "O": SmartPlantEater, // из предыдущего упражнения
        "*": Plant
    }
    app.legend = legend;
})(app)