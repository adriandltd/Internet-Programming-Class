// Three ways to use the jQuery ajax call, with various
// purposes and concerns.

$("#b1").click(function () {

	$.ajax("content.html").done(function () {
		$("#template").load("page1.html");
	});
});

$("#b2").click(function () {
	$.ajax("content.html").done(function () {
		$("#template").load("page2.html");
	});
});

$("#clear").click(function () {
	$("#template").html("");
})