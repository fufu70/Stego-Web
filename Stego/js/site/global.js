jQuery(function($) {

	/** 
	 * GENERAL BEHAVIOR ACTIVATION
	 */
	$('[data-toggle="tooltip"]').tooltip();
	$('[data-toggle="popover"]').popover();
	$('.switch').bootstrapSwitch({
		size: 'small',
	});
	// $('.phone').mask('(999) 999-9999');
	// $('.date').datetimepicker({
	// 	pickTime: false
	// });
	// $('.time').datetimepicker({
	// 	pickDate: false
	// });
	// $('.chosen').chosen({
	// 	placeholder_text_single: ' ',
	// 	disable_search_threshold: 8,
	// 	search_contains: true,
 //        enable_split_word_search: true,
	// 	display_disabled_options: true,
	// 	allow_single_deselect: false,
	// 	width: '100%',
 //    });
 //    $('table').footable({
	// 	breakpoints: {
	// 		phone: 500,
	// 		tablet: 650
	// 	}
	// });
    $('.money').focusout(function() {
		var regex = /^\d+(?:\.\d\d?)?$/;
		var match = $(this).val().match(regex);
		$(this).val(match);
	});

    /**
     * FIXED TABLE HEADER
     *
     * Used to fix table headers to the top of a scrolling container. This behavior is dependent on
     * the floatThead plugin. Some additional script makes sure the table header is refreshed or 'reflowed'
     * whenever the DOM structure changes.
     *
     * NOTE: Fixed table headers are not compatible with FooTable sorting.
     * 
     * @author jsalis@stetson.edu
     *
     * @fix-header	The table to apply the fixed header.
     * @scroller 	The container for the table element. Class name must start with @scroller.
     */
	// $('.fix-header').floatThead({
	//     useAbsolutePositioning: true,
	//     scrollContainer: function($table) {
	//         return $table.closest('[class^="scroller"]');
	//     }
	// });
	$('[data-toggle="tab"]').click(function() {
		$('.fix-header').floatThead('reflow');
	});

	/** 
	 * DYNAMIC FORM EDITOR
	 * 
	 * Used to control form submission and editing by showing a button container when the form 
	 * changes state. Inputs without a name are ignored.
	 *
	 * @author jsalis@stetson.edu
	 *
	 * @form			The form tag should contain @form-buttons, @btn-cancel, @btn-edit, and @static-input.
	 * @form-buttons	The container for the form buttons (@btn-cancel, and a submit button).
	 * @btn-cancel		The button that resets the form and hides the form buttons.
	 * @btn-edit		A button that shows @form-buttons and makes the form editable.
	 * @static-input	A container to hold the static representation of an input field. The name of this container
	 *					should be the ID of the input associated with it. When @btn-edit is clicked, the input will
	 *					be populated with the contents of the container, and the container will be hidden.
	 */
	$('form').change(function(event) {
		var name = $(event.target).attr('name');
		if (typeof name !== 'undefined') {
			$(this).find('.form-buttons').show('fast');
		}
	});
	$('.btn-cancel').click(function() {
		var form = $(this).parents('form');
		form[0].reset();
		$(this).parents('.form-buttons').hide('fast', function() {
			form.find('.btn-edit').show('fast');
		});
		form.find('.static-input').each(function() {
			$(this).show();
			var name = $(this).attr('name');
			$('#' + name).hide();
		});
	});
	$('.btn-edit').click(function() {
		$(this).hide();
		var form = $(this).parents('form');
		form.find('.form-buttons').show('fast');
		form.find('.static-input').each(function() {
			$(this).hide();
			var name = $(this).attr('name');
			// console.log(name);
			$('#' + name).val($(this).html());
			$('#' + name).show();
		});
	});
	// Initial hiding
	$('.form-buttons').hide();
	$('.static-input').each(function() {
		var name = $(this).attr('name');
		$('#' + name).hide();
	});

	/** 
	 * CHECKBOX TOGGLE
	 * 
	 * Used to make a container toggle a checkbox that is inside it.
	 *
	 * @author jsalis@stetson.edu
	 *
	 * @checkbox-toggle		The container of the checkbox.
	 */
	$('.checkbox-toggle').click(function(event) {
		var checkbox = $(this).find('input[type=checkbox]');
		if (event.target.id != checkbox.attr('id'))
		{
			checkbox.prop('checked', !checkbox.prop('checked'));
			$(this).parents('form').trigger('change');
		}
	});

	/**
	 * FORM SUBMIT
	 *
	 * Used to make a container submit a form when it is clicked.
	 */
	$('.form-submit').click(function() {
		$(this).find('form').submit();
	});

	/** 
	 * PANEL COLLAPSING
	 * 
	 * Used to collapse panel content by clicking on the panel heading.
	 *
	 * @author jsalis@stetson.edu
	 *
	 * @panel-heading	The content of the heading. All sibling elements will be hidden.
	 */
	// $('.panel-heading').click(function() {
	// 	$(this).siblings().not('.panel-heading').toggle('fast');
	// });

	/**
	 * LOAD TAB FROM URL HASHTAG
	 *
	 * Used to extract a hashtag from a url and show a specific navigation tab.
	 * The url hashtag also updates when the active tab switches.
	 */
	var url = document.location.toString();
	if (url.match('#')) {
		var split = url.split('#');
	    $('.nav-tabs a[href=#' + split[1] + ']').tab('show');
	} 
	$('.nav-tabs a').on('shown.bs.tab', function (e) {
	    window.location.hash = e.target.hash;
	});
});

function calculateDistance(latOne, longOne, latTwo, longTwo) {
	var dlat = deg2rad(latOne - latTwo);
	var dlong = deg2rad(longOne - longTwo);

	var a = (Math.sin(dlat/2) * Math.sin(dlat/2)) + Math.cos(deg2rad(latTwo)) * Math.cos(deg2rad(latOne)) * (Math.sin(dlong/2) * Math.sin(dlong/2));
	var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return angle * 3963.1;
};

function deg2rad(angle) {
  return angle * .017453292519943295; // (angle / 180) * Math.PI;
}

window.getTimeDifference = function()
{
    var timeDifference = 0;

    if (moment.utc().hours() > moment().hours())
    {
        timeDifference = moment.utc().hours() - moment().hours();
    }
    else if (moment.utc().dayOfYear() > moment().dayOfYear())
    {
        timeDifference = 24 - Math.abs(moment.utc().hours() - moment().hours());
    }
    else if (moment.utc().year() > moment().year())
    {
        timeDifference = 24 - Math.abs(moment.utc().hours() - moment().hours());
    }
    return timeDifference;
}

/**
 * The callNextFunction method goes and calls the next function sending with it the other
 * functions and the information that was passed to it. If the nextFunction object is only
 * of size 1 that means that there is no other function to call hence why the next parameter
 * is that of 1. If this is not the case then the function to call is the first element of the
 * nextFunction array, and so calls this function if it is of size 0 (not an array). If the 
 * first element of the nextFunction array is indeed an array then it calls all of the methods
 * in that array, sending in the nextFunction and the info.
 * 
 * @param  function[] 	nextFunction 	The next function or array of functions to call.
 * @param  array 		info         	The information to pass to the next method.
 */
window.callNextFunction = function(nextFunction, info)
{
	if (nextFunction !== undefined)
	{
		if (nextFunction.length == 1 || !(nextFunction instanceof Array))
		{
			if (!(nextFunction instanceof Array))
			{
				nextFunction(undefined, info);		
			}
			else
			{
				nextFunction[0](undefined, info);	
			}
		}
		else
		{
			var currentFunction = nextFunction[0];
			nextFunction.splice(0, 1);
			if (currentFunction.length == 1 || !(currentFunction instanceof Array))
			{
				currentFunction(nextFunction, info);	
			}
			else
			{
				for (var i = 0; i < currentFunction.length; i ++)
				{
					currentFunction[i](nextFunction, info);
				}
			}
		}
	}
}

/**
 * The getBusinessTypeIcon method goes and generates the source of the image from just the name of
 * the business type, the beginning of the image, and the ending of the image.
 * 
 * @param  String 		businessTypeName    The name of the business type.
 * @param  String 		prepend        		The beginning of the business type icon.
 * @param  String 		append         		The ending of the business type icon.
 * @return String 			         		The image source name form the beginning to end.
 */
window.getBusinessTypeIcon = function(businessTypeName, prepend, append)
{
	var typeName = businessTypeName.replace(' ', '-');
	return '/images/businessTypeIcon/'+ typeName + '/' + prepend + typeName + append;
}
