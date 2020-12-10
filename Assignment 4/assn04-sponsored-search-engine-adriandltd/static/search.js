$("#button").click(function () {
    event.preventDefault();
    //empty for new search
    $("#results").empty();
    //Add element to copy back since it got deleted
    $("#results").append("<div id=\"results\"><div id=\"result\" class=\"panel\" style=\"display: none;\"><div class=\"panel-body\"><h3><a id=\"titlelink\" href=\"http://blah.blah.blah\">Blah, I say</a></h3><div id=\"url\" class=\"url\">http://blah.blah.blah</div><div id=\"rel\">Relevance: 0.54</div><div class=\"excerpt\" id=\"desc\">Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty. Excerpty...</div></div></div></div>");
    var searchval = $("#search").val();
    //Get search terms
    var searcharray = searchval.split(" ");
    if (searcharray.includes('icecream') || searcharray.includes('dogs') || searcharray.includes('phones')) {
        if (searcharray.includes('icecream')) {
            $.ajax("icecream.json").done(function (data) {
                getData(data);
            }).fail(function () {
                console.log("broke!")
            });
        }
        if (searcharray.includes('dogs')) {
            $.ajax("dogs.json").done(function (data) {
                getData(data);
            }).fail(function () {
                console.log("broke!")
            });
        }
        if (searcharray.includes('phones')) {
            $.ajax("phones.json").done(function (data) {
                getData(data);
            }).fail(function () {
                console.log("broke!")
            });
        }
        if (searcharray.length > 1) {
            $.ajax("search.html").done(function () {
                var results = $("#results").children();
                checkDuplicate(results);
                results.sort(function (a, b) {
                    return $(b).data("relevance") - $(a).data("relevance")
                });
                $("#results").html(results);
            });
        }
    }
    else {
        $("#results").append("<div id=\"insult\">You suck! Search for compatible terms!</div>")
    }
});

function getData(data) {
    //Get JSON data
    var data2 = JSON.parse(JSON.stringify(data));
    //Sort the array according to relevance
    data2.sort(function (a, b) {
        return parseFloat(a.relevance) - parseFloat(b.relevance);
    });
    //Set JSON data
    data2.forEach(element => {
        var title = element.title;
        var description = element.description;
        var url = element.url;
        var relevance = element.relevance;
        //Trim descrpition text
        if (description.length > 325) {
            description = description.substring(0, 325);
            if (description.substr(description.length - 1) != ' ') {
                description = description.substring(0, description.length - 1);
            }
            description = description + '...';
        }
        //Set values accordingly
        var result = $("#result").clone();
        $(result).find("#titlelink").text(title);
        $(result).find("#titlelink").attr("href", url);
        $(result).find("#desc").text(description);
        $(result).find("#url").text(url);
        $(result).find("#rel").text("Relevance: " + relevance);
        $(result).attr("data-relevance", relevance);
        $(result).attr("data-title", title);
        $(result).show();
        $("#results").prepend(result);
    });
}
function checkDuplicate(myArray) {
    for (var i = 0; i < myArray.length; i++) {
        for (var j = 0; j < myArray.length; j++) {
            if (i != j) {
                if (myArray[i]['dataset']['title'] == myArray[j]['dataset']['title']) {
                    //get relevance values
                    var rel1 = myArray[i]['dataset']['relevance'];
                    var rel2 = myArray[j]['dataset']['relevance'];
                    //convert them to a new num value
                    var newrel = rel1 * 1 + rel2 * 1;
                    //set the new value in dataset
                    myArray[i]['dataset']['relevance'] = newrel;
                    //set new value in the '#rel' div text value
                    $(myArray[i]).find('#rel').text('Relevance '+newrel);
                    //removes duplicate item from array
                    myArray.splice(j, 1);
                    return;
                }
            }
        }
    }
}