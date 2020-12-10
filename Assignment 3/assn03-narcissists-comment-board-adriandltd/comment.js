// javascript here
var ctr = 0;
$("#cardcontainer").css("margin-top", "25px;")

$(document).on('click', '#postbtn', function () {
    var name = $("#name").val().toString();
    var comment = $("#comment").val().toString();
    var letterNumber = /^[0-9a-zA-Z]+$/;
    event.preventDefault();
    if (name != '' && comment != '' && !name.includes(" ", 0) && name.match(letterNumber)) {
        //Comment is free of invalid input
        ctr++;
        resetdefault();
        console.log("Good to go!")
        var newcomment = $("#card").clone();
        var id = "card"+ctr;
        $(newcomment).attr("id",id);
        $(newcomment).show();
        $(newcomment).find("#newcommentname").text(name);
        $(newcomment).find("#newcommentcomment").text(comment);
        $("#cardcontainer").prepend(newcomment);
        $("#name").val('');
        $("#comment").val('');
    }
    else {
        //displays appropriate errors for invalid input
        resetdefault();
        if (name == '') {
            $("#Errorname2").show();
            $('#name').css("border", "2px solid red");
        }
        else if (name.includes(" ", 0) || !name.match(letterNumber)) {
            $("#Errorname").show();
            $('#name').css("border", "2px solid red");
        }
        if (comment == '') {
            $("#Errorcomment").show();
            $('#comment').css("border", "2px solid red");
        }
    }
});

$(document).on('click', '#deletebtn', function () {
    $(this).parent().parent().parent().parent().remove();
});

function resetdefault() {
    $("#Errorname").hide();
    $("#Errorname2").hide();
    $("#Errorcomment").hide();
    $('#name').css("border", "1px solid lightgrey");
    $('#comment').css("border", "1px solid lightgrey");
}
