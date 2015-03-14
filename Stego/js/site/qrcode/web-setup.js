$('#qrcode').qrcode({
	text	: "http://salecents.com/index.php/marketing/viewcompany?view=<?php echo $model->getHash(); ?>"
});

$("#print").click(function() {
	$("#print").hide();
	window.print();
	$("#print").show();
});