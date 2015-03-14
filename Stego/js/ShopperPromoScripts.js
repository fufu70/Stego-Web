// Activate the te oscroll buttons to smoothly animate to its top position
$('.smoothscroll a').click(function( e ){  
    e.preventDefault();
    var targetId = $(this).attr("href");
    var top = $(targetId).offset().top;
    $('html, body').stop().animate({scrollTop: top }, 1500);
});	



// The iPhone and callapsible group work in sync with eachother
// when the collapsable item is changes the carousel will jump to
// the corresponding slide
$('#screen').carousel({interval: false});

$('#collapseOne').on('shown.bs.collapse', function () {
	$('#screen').carousel({
		pause: true,
		interval: false
	});
		$('#screen').carousel(0);

})
$('#collapseOne').on('hidden.bs.collapse', function () { })

$('#collapseTwo').on('shown.bs.collapse', function () {
	$('#screen').carousel({
		pause: true,
		interval: false
	});
		$('#screen').carousel(1);
		
})
$('#collapseTwo').on('hidden.bs.collapse', function () { })

$('#collapseThree').on('shown.bs.collapse', function () {
	$('#screen').carousel({
		pause: true,
		interval: false
	});
		$('#screen').carousel(2);
		
})
$('#collapseThree').on('hidden.bs.collapse', function () { })

$('#collapseFour').on('shown.bs.collapse', function () {
	$('#screen').carousel({
		pause: true,
		interval: false
	});
		$('#screen').carousel(3);
		
})
$('#collapseFour').on('hidden.bs.collapse', function () { })		

$('#collapseFive').on('shown.bs.collapse', function () {
	$('#screen').carousel({
		pause: true,
		interval: false
	});
		$('#screen').carousel(4);
		
})
$('#collapseFive').on('hidden.bs.collapse', function () { })