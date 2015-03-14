jQuery(function($) {
	$('[data-target="#update_sale"]').click(function(event) {
		console.log("here");
		var itemID = $(this).attr('id');
		console.log(itemID);
		var form = $('#update_sale_form');
		$('#Sale_id_update').val($('#'+ itemID +' #id').html());
		$('#Sale_name_update').val($('#'+ itemID +' #name').html());
		$('#Sale_description_update').val($('#'+ itemID +' #description').html());
		$('#Sale_beginning_date_update').val($('#'+ itemID +' #beginning_date').html());
		$('#Sale_end_date_update').val($('#'+ itemID +' #end_date').html());
		beginningMoment = moment($('#'+ itemID +' #beginning_date').html(), "YYYY-MM-DD HH:mm");
		endMoment = moment($('#'+ itemID +' #end_date').html(), "YYYY-MM-DD HH:mm");
	});
});