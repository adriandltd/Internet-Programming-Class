
var imgs = {
    0: "http://animalcontrolphx.com/wp-content/uploads/2013/05/gophers-400.jpg",
    1: "https://kids.nationalgeographic.com/content/dam/kids/photos/animals/Mammals/Q-Z/wolverine-crouching.adapt.945.1.jpg",
    2: "https://www.waikikiaquarium.org/wp-content/uploads/2013/11/octopus_620.jpg"
}

$("#choice").change(function () {
    //empty old data
    $("#main").empty();
    //get selection option type
    var selection = $("#choice option:selected").val();
    //async call with apporpriate file
    $.ajax("data" + selection + ".js").done(function (data) {
        var array = JSON.parse(data);
        //loop through array to create imgs
        array.forEach(element => {
            var xCoor = element[0];
            var yCoor = element[1];
            var newImg = $("<img src=\"" + imgs[selection]+ "\">");
            newImg.css({"left": xCoor, "top": yCoor, "display":"inline-block", 'width' : '50px' , 'height' : '50px'});
            $('#main').append(newImg);
        });
    }).fail(function () {
        console.log("broke!")
    });
});