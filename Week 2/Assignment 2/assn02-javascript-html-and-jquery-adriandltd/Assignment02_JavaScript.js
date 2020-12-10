// Solution for problem 1

$("#wishes").text("I hate you, Bob.");

// Solution for problem 2

$("#ducky").attr("src", "https://i.ytimg.com/vi/oMQI0bJJOvM/hqdefault.jpg");

// Solution for problem 3\

$("#pic1, #pic2, #pic3").attr("width", 300);

// Solution for problem 4

$(".btn-primary").on("click", function () {
    $("#ahhhred").css({ "color": "red", "font-size": "200%" });
});

// Solution for problem 5

$("#greencircle").on("click", function () {
    $("#hiddenmessage").removeClass('hidden');
});

// Solution for problem 6

$('#img1').mouseover(function () {
    $('#img1').css("border", "3px solid yellow");
});
$('#img1').mouseleave(function () {
    $('#img1').css("border", "none");
});
$('#img2').mouseover(function () {
    $('#img2').css("border", "3px solid yellow");
});
$('#img2').mouseleave(function () {
    $('#img2').css("border", "none");
});
$('#img3').mouseover(function () {
    $('#img3').css("border", "3px solid yellow");
});
$('#img3').mouseleave(function () {
    $('#img3').css("border", "none");
});

// Solution for problem 7

$("#textbox1").keyup(function () {
    var val1 = $("#textbox1").val();
    $("#textbox2").val(val1);
});

// Solution for problem 8

$("#textbox3").focusout(function () {
    $("#textbox3").val("HAHA");
});

// Solution for problem 9

$("#list").hide();  //hidden by default
$("#checkbox").click(function () {
    if ($(this).prop("checked") == true) {
        $("#list").show();
    }
    else if ($(this).prop("checked") == false) {
        $("#list").hide();
    }
});

// Solution for problem 10

$("#textbox4").focusout(function () {
    var date = moment($("#textbox4").val());
    var checkdate = moment(date).format('MM/DD/YYYY');
    if (checkdate == 'NaN/NaN/0NaN') {
        $("#textbox4").val('Invalid Date Format');
    } else{
        $("#textbox4").val(moment(date).format('MM/DD/YYYY'));}
});

$("#textbox4").focusin(function () {
    $("#textbox4").val('');
});
