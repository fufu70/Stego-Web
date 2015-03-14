jQuery(function($) {
	var messageTypeSelector = 'input[name="Message[messageType]"]';
	var messageContentSelector = 'input[name="Message[append][' + data.messageContent.key + ']"]';
	$('.revise-buttons').hide();
	$('.revise-trigger').focus(function() {
		var form = $(this).parents('form');
		form.find('.main-buttons').hide('fast', function() {
			form.find('.revise-buttons').show('fast');
		});
	});
	$('.button-cancel').click(function() {
		var form = $(this).parents('form');
		form[0].reset();
		form.find('.revise-buttons').hide('fast', function() {
			form.find('.main-buttons').show('fast');
		});
	});
	$('.button-accept').click(function() {
		var form = $(this).parents('form');
		form.find(messageTypeSelector).val(data.messageType.accept);
		form.find(messageContentSelector).val(data.messageContent.accept);
		$(this).parents('form').submit();
	});
	$('.button-decline').click(function() {
		var form = $(this).parents('form');
		form.find(messageTypeSelector).val(data.messageType.decline);
		form.find(messageContentSelector).val(data.messageContent.decline);
		$(this).parents('form').submit();
	});
	$('.button-revise').click(function() {
		var form = $(this).parents('form');
		form.find(messageTypeSelector).val(data.messageType.revise);
		form.find(messageContentSelector).val(data.messageContent.revise);
		$(this).parents('form').submit();
	});
});