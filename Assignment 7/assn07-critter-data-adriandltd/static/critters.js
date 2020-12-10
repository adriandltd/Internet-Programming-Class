$("#choice").change(function () {
    //empty old data
    $("#main").empty();
    //get selection option type
    var selection = $("#choice option:selected").val();
    var imgURL;
    //async call to get the critter imgurl first!
    $.ajax({
        url: '/retrievecritters',
        method: 'GET',
        dataType: 'json', // added data type
        success: function (res) {
            var imgArray = res;
            imgURL = imgArray[selection-1].image_url;
        }
    }).then($.ajax({    //ajax call to get coordinates
        url: '/retrievecoords/' + selection,
        method: 'GET',
        dataType: 'json', // added data type
        success: function (res) {
            var array = res;            
            //loop through array to create imgs
            array.forEach(element => {
                var xCoor = element.x;
                var yCoor = element.y;
                var newImg = $("<img src=\"" + imgURL + "\">");
                newImg.css({ "left": xCoor, "top": yCoor, "display": "inline-block", 'width': '50px', 'height': '50px' });
                $('#main').append(newImg);
            });
        }
    }).fail(function () {
        console.log("broke!")
    }));
});