jQuery(function($) {
	$('.btn').button();
	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
		$('.alert-error').hide();
	});
});