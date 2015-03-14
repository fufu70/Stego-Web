// init
markers = {
	alcohol: new Array(0),
	antiques: new Array(0),
	appliances: new Array(0),
	auto_repair: new Array(0),
	books: new Array(0),
	clothing: new Array(0),
	coffee: new Array(0),
	electronics: new Array(0),
	food: new Array(0),
	furniture: new Array(0),
	music: new Array(0),
	office_supplies: new Array(0),
	salon: new Array(0),
	sports: new Array(0),
};

businessTypeList = [
	'Alcohol', 
	'Antiques', 
	'Appliances', 
	'Auto Repair', 
	'Books', 
	'Clothing', 
	'Coffee', 
	'Electronics', 
	'Food', 
	'Furniture', 
	'Music', 
	'Office Supplies', 
	'Salon', 
	'Sports'
];

/**
 * The getSales method goes and gets all of the sales occuring in a specific date range.
 */
window.getSales = function() 
{
	toggleActiveCookies();
    var Sale = Parse.Object.extend(SALE_CLASS);
    var query = new Parse.Query(Sale);

    var point = new Parse.GeoPoint(latitude,longitude);
    query.withinMiles("location", point, 10000);

    var timeDifference = getTimeDifference();

    var todaysDate = new Date(moment().subtract('hour', timeDifference)); 

	query.lessThanOrEqualTo("beginningDate", todaysDate);
	query.greaterThanOrEqualTo("endDate", todaysDate);
	query.include("businessID");
    query.find({
    	success: function(results) {

    		var i = 0;
    		console.log(results);

			window.setInterval(function()
			{
				if(i < results.length)
				{
					totalMarkers ++;
					var object = results[i];
					var pointer = new Parse.GeoPoint(object.get('location'));
					var marker = createMarkerFromSaleObject(object);

					map.addOverlay(marker);
					var saleModalID = '#sale' + pointer.latitude + '_' + pointer.longitude;
					saleModalID = saleModalID.replace(/\./g, '-');

					GEvent.addListener(marker, "click", function() 
					{
						object.increment('usersViewed');
						object.increment('usersReached');
						object.save();

						$(saleModalID).modal('show');

						$(saleModalID + ' .btn-business-info').attr("href", 'http://salecents.com/index.php/marketing/viewcompany?view=' + object.get('businessID').get('hashID'));
						$(saleModalID + ' .modal-title').text(object.get('businessID').get('name'));

						$('.btn-sale-option').removeClass('active');
						$('.sale-modal-option').hide();

						$('#sale-' + object.id).show();
						$('#sale-' + object.id + '-button').addClass('active');

						$('.btn-direction').off("click");

						$('.btn-direction').click(function() {
							object.increment('usersAskedDirections');
							object.save();
						});
					});

					addMarkerToArray(marker, object.get('businessType'));
					hideMarker(marker, object.get('businessType'));
					i ++;
				}
			}, 20);

			createModals(results);
			hideSaleButtons();
		},
		error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
		}
    });
}

/**
 * The createModals method goes and creates all of the modals based off of the search results from the getSales method.
 * It then creates the click reactions necessary as well.
 * 
 * @param  ParseObject[] 	results 		The results of all of the sales found.
 */
window.createModals = function(results)
{
	var timeDifference = getTimeDifference();
	var modalArray = new Array(0);
	for (var k = 0; k < results.length; k ++)
	{
		var index = -1;
		for (var z = 0; z < modalArray.length; z ++)
		{
			for (var x = 0; x < modalArray[z].length; x ++)
			{
				var resultsPointer = new Parse.GeoPoint(results[k].get('location'));
				var modalArrayPointer = new Parse.GeoPoint(modalArray[z][x].get('location'));
				if (resultsPointer.latitude == modalArrayPointer.latitude &&
						resultsPointer.longitude == modalArrayPointer.longitude)
				{
					index = z;
				}
			}
		}
		if (index == -1)
		{
			modalArray.push(new Array(results[k]));
		}
		else
		{
			modalArray[index].push(results[k]);
		}
	}

	for (var i = 0; i < modalArray.length; i ++)
	{
		pointer = new Parse.GeoPoint(modalArray[i][0].get('location'));
		var saleModalID = 'sale' + pointer.latitude + '_' + pointer.longitude;
		saleModalID = saleModalID.replace(/\./g, '-');

		var hashID = "";
		if (modalArray[i][0] !== undefined && modalArray[i][0].get('businessID') !== undefined)
		{
     		hashID = modalArray[i][0].get('businessID').get('hashID');
		}

		var htmlMarkup = '<div class="modal fade" id="' + saleModalID + '" tabindex="-1" role="dialog" aria-hidden="true" style="z-index:10001">' +
						    '<div class="modal-dialog">' +
						        '<div class="modal-content">' + 
					                '<div class="modal-header">' + 
					                   	'<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' + 
					                   	'<h4 class="modal-title">' + modalArray[i][0].get('businessName') + '</h4>' +
					                '</div>' +
					                '<div class="modal-body">';
		// Do I need a button header ?
		if (modalArray[i].length != 1)
		{
			htmlMarkup += '					<div class="form-buttons">' +
			    								'<div class="btn-group btn-group-justified">';
			// make buttons and make the last button the first since we take into acocunt the overlaying of pins, the last pin is th one on top
			for (var j = modalArray[i].length - 1; j >= 0; j --)
			{
				htmlMarkup += '		    			<div class="btn-group ' + modalArray[i][j].get('businessType').replace(' ', '-') + '-button" id="' + modalArray[i][j].id + '">' + 
											    		'<button class="btn btn-default btn-sale-option';										    		
				htmlMarkup += '							    		" type="button" id="sale-' + modalArray[i][j].id + '-button" onclick="goToModalView(\'sale-' + modalArray[i][j].id + '\', \'' + modalArray[i].length + '\')">' + '<img src="' + getBusinessTypeIcon(modalArray[i][j].get('businessType'), '', '-2x-red.png') + '"/>' + '</button>' +
											    	'</div>';
			}
			htmlMarkup += '						</div>' +
											'</div>';
		}

		for (var j = modalArray[i].length - 1; j >= 0; j --)
		{
			var beginningDate = moment(modalArray[i][j].get('beginningDate')).add('hour', timeDifference);
			var endDate = moment(modalArray[i][j].get('endDate')).add('hour', timeDifference);

			htmlMarkup += 				'<div ';
			htmlMarkup +=				' 	  id="sale-' + modalArray[i][j].id + '" class="' + modalArray[i][j].get('businessType').replace(' ', '-') + '-sale sale-modal-option">' +
											'<div class="form-group">' +
								                '<label for="Sale_name_update" class="control-label">Sale Name</label>' +
								                '<input name="Sale[name]" type="text" id="Sale_name_update" class="form-control" value="' + modalArray[i][j].get('name') + '" readonly required>' +
								            '</div>' +
								            '<div class="form-group">' +
								                '<label for="Sale_description_update" class="control-label">Sale Description</label>' +
								                '<textarea name="Sale[description]" type="text" id="Sale_description_update" class="form-control" readonly required>' + modalArray[i][j].get('description') + '</textarea>' +
								           '</div>' +
								           '<div class="form-group">' +
								                '<label for="Sale_beginning_date_update" class="control-label">Beginning Date</label>' +
								                '<input name="Sale[beginning_date]" type="text" id="Sale_beginning_date_update" class="form-control" value="' + String(beginningDate).replace(/GMT.+/g, '') + '" readonly required>' +
								            '</div>' +
								            '<div class="form-group">' +
								                '<label for="Sale_end_date_update" class="control-label">End Date</label>' +
								                '<input name="Sale[end_date]" type="text" id="Sale_end_date_update" class="form-control" value="' + String(endDate).replace(/GMT.+/g, '') + '" readonly required>' +
								            '</div>' +
								        '</div>';
		}



		htmlMarkup += 	       		'</div>' +
					                '<div class="modal-footer">' +
					                    '<div class="btn-group btn-group-justified">' +
					                        '<div class="btn-group">' +
					                            '<a class="btn btn-primary btn-direction" target="_blank" href="' + getMapLink(latitude, longitude, pointer) + '">Directions</a>' +
					                       ' </div>' +
					                    '</div>';
		if (hashID != '' && hashID !== undefined)
		{

			htmlMarkup +=               '<div class="btn-group btn-group-justified">' +
					                        '<div class="btn-group">' +
					                            '<a class="btn btn-primary btn-business-info" target="_blank" href="localhost/index.php/marketing/viewcompany?view=' + hashID + '">Business Info.</a>' +
					                       ' </div>' +
					                    '</div>';
		}
		htmlMarkup +=               ' </div>' +
						        ' </div>' +
						    '</div>' +
						'</div>';

		$('body').append(htmlMarkup);
	}

	for (var i = 0; i < modalArray.length; i ++)
	{
		// Do I need a button header ?
		if (modalArray[i].length != 1)
		{
			// make buttons
			for (var j = 0; j < modalArray[i].length; j ++)
			{
				var saleButtonID = '#' + modalArray[i][j].id;
				createClickFunction(saleButtonID, modalArray[i][j]);
			}
		}
	}
}

/**
 * The getMapLink method goes to get the link of the map via the device type, if the device is of type iOS
 * then the apple maps is used, otherwise the google maps link is used.
 * 
 * @param  float 			latitude  	The latitude of the user.
 * @param  float 			longitude 	The longitude of the user.
 * @param  Parse.GeoPoint 	pointer   	The position of the sale wrapped in a parse object.
 * @return String           			The link to the specified map for the longitude and latitude of the user
 *                                 		to the longitude and latitude of the pointer.
 */
window.getMapLink = function( latitude, longitude, pointer) 
{
	var link = '';

    if( (navigator.platform.indexOf("iPhone") != -1) 
        || (navigator.platform.indexOf("iPod") != -1)
        || (navigator.platform.indexOf("iPad") != -1))
    {
		link = 'http://maps.apple.com/maps?saddr=' + latitude + ',' + longitude + '&daddr=' +
														pointer.latitude + ',' + pointer.longitude;	
    }
    else
    {
		link = 'https://maps.google.com/maps?saddr=' + latitude + ',' + longitude + '&daddr=' +
														pointer.latitude + ',' + pointer.longitude;
    }
	return link;
}

/**
 * The createClickFunction method goes and creates a click function for the specific sale button id, meaning
 * that if anyone clicked that button then the actions specified below will occur. This means that the usersReached
 * and usersViewed values for the sale will be incremented. The saleModalID is then created so that the values for 
 * the .btn-direction and .btn-business-info actions are changed to send the user to the directions of the sale and 
 * the send the user to the business page of the specified business. One last touch is to increment the 
 * usersAskedDirections value of the sale when the .btn-direction button is clicked.
 * 
 * @param  String       saleButtonID	The specified id of the sale button.
 * @param  ParseObejct  sale 			The parse object of sale class that needs to be changed.
 */
window.createClickFunction = function(saleButtonID, sale)
{
	$(saleButtonID).click(function() {
		sale.increment('usersViewed');
		sale.increment('usersReached');
		sale.save();

		pointer = new Parse.GeoPoint(sale.get('location'));
		var saleModalID = 'sale' + pointer.latitude + '_' + pointer.longitude;
		saleModalID = saleModalID.replace(/\./g, '-');

		$('#' + saleModalID + ' .btn-business-info').attr("href", 'http://salecents.com/index.php/marketing/viewcompany?view=' + object.get('businessID').get('hashID'));
		$('#' + saleModalID + ' .modal-title').text(sale.get('businessID').get('businessName'));

		$('.btn-direction').off("click");

		$('.btn-direction').click(function() {
			sale.increment('usersAskedDirections');
			sale.save();
		});
	});
}

/**
 * The hideSaleButtons goes and hides all of the the sale buttons depending on the businessType. It keeps count
 * of the amount of businessTypes that have been hidden, if all have been hidden then the user is shown to show
 * all of the pins in the hidePinsButton, if none of the pins have been hidden then the user is shown that the
 * sales can be hidden, and the same goes with when the count is greater than 0.
 */
window.hideSaleButtons = function()
{
	var hideCallCount = 0;
	for (var i = 0; i < businessTypeList.length; i ++)
	{
		if(hideCatagory(businessTypeList[i]))
		{
			$('.' + businessTypeList[i] + '-sale').hide();
			$('.' + businessTypeList[i] + '-button').hide();
			hideCallCount ++;
		}
	}

	if (hideCallCount == 13)
	{
		$("#hidePinsButton").attr("onclick", "showAllPins()");
		$("#hidePinsButton .sub_icon").removeClass("fa-check-square");
		$("#hidePinsButton .sub_icon").removeClass("fa-minus-square");
		$("#hidePinsButton .sub_icon").addClass("fa-square");
		$("#hidePinsButton .word-describe").text(" Show Pins ");
	}
	else if (hideCallCount > 0)
	{
		$("#hidePinsButton").attr("onclick", "hideAllPins()");
		$("#hidePinsButton .sub_icon").removeClass("fa-check-square");
		$("#hidePinsButton .sub_icon").removeClass("fa-square");
		$("#hidePinsButton .sub_icon").addClass("fa-minus-square");
		$("#hidePinsButton .word-describe").text(" Hide Pins ");
	}
	else
	{
		$("#hidePinsButton").attr("onclick", "hideAllPins()");
		$("#hidePinsButton .sub_icon").removeClass("fa-square");
		$("#hidePinsButton .sub_icon").removeClass("fa-minus-square");
		$("#hidePinsButton .sub_icon").addClass("fa-check-square");
		$("#hidePinsButton .word-describe").text(" Hide Pins ");
	}
}

/**
 * The goToModalView method goes and displays the specified modal via the displayID, via first hiding all 
 * of the other sal modals and removes the active class from those modals. Then the specified displayID is
 * shown as well as setting the button for that display to be active.
 * 
 * @param  String 			displayID 	The specified id for the modal.
 */
window.goToModalView = function(displayID)
{
	$('.btn-sale-option').removeClass('active');
	$('.sale-modal-option').hide();

	$('#' + displayID).show();
	$('#' + displayID + '-button').addClass('active');
}

/**
 * The createMarkerFromSaleObject method goes and creates a GMarker depending on the location of the sale
 * object and the specified businessType.
 * 
 * @param  ParseObject       sale 		The specified parse object of a Sale class which will design the 
 *                                  	marker.
 * @return GMarker 						The marker based off of the sale object.
 */
window.createMarkerFromSaleObject = function(sale)
{
	var pointer = new Parse.GeoPoint(sale.get('location'));
	var latlng = new GLatLng(pointer.latitude, pointer.longitude);
	var markerIcon = getMarkerIcon(sale.get('businessType'));

	var markerOptions = { icon:markerIcon };
	var marker = new GMarker(latlng, markerOptions);
	return marker;
}

/**
 * The getMarkerIcon method goes and creates a GIcon for the specific business type. 
 * 
 * @param  String       businessType 		The specified businessType that might be hidden.
 * @return GIcon 							The markerIcon with a specific business type image,a specific 
 *                          				size and anchor.
 */
window.getMarkerIcon = function(businessType)
{
	var markerIcon = new GIcon();

	var prepend = 'Ribbon-Shadowed-';
	var append = '-3x.png';
	markerIcon.image = getBusinessTypeIcon(businessType, prepend, append);

	markerIcon.iconSize = new GSize(70, 49);
	markerIcon.iconAnchor = new GPoint(15, 46);
	markerIcon.infoWindowAnchor = new GPoint(17, 1);

	return markerIcon;
}

/**
 * The addMarkerToArray method goes and adds the specified marker to the specified businessType array stored
 * in the markers object.
 * 
 * @param  Marker       marker 				The specified marker to be added.
 * @param  String       businessType 		The specified businessType to add to.
 */
window.addMarkerToArray = function(marker, businessType) 
{
	var businessType = businessType.toLowerCase();
	businessType = businessType.replace(" ", "_");
	markers[businessType].push(marker);
}

/**
 * The hideMarker method goes to hide the marker if its businessType is already hidden, the business type
 * is specified and if a call to the hideCatagory returns true then the marker must be hidden.
 * 
 * @param  Marker       marker 				The specified marker to be hidden.
 * @param  String       businessType 		The specified businessType that might be hidden.
 */
window.hideMarker = function(marker, businessType)
{
	if (hideCatagory(businessType))
	{
		marker.hide();
	}
}

/**
 * The hideCatagory method goes and returns a true or false depending on if the specified businessType
 * should be hidden or not.
 * 
 * @param  String       businessType 		The specified businessType that should or should not be hidden.
 * @return boolean 							If the businessType should or should not be hidden.
 */
window.hideCatagory = function(businessType)
{
	for (var i = 0; i < businessTypeList.length; i ++)
	{
		if(docCookies.getItem(businessTypeList[i]) == 'hide' && businessType == businessTypeList[i])
		{
			return true;
		}
	}
	return false;
}

/**
 * The toggleActiveCookies method goes and toggles all of the businessTypes depending on if their cookie 
 * is set to 'hide.'  This method is usually called when the view creates all of the markers for the first
 * time.
 */
window.toggleActiveCookies = function()
{
	for (var i = 0; i < businessTypeList.length; i ++)
	{
		if(docCookies.getItem(businessTypeList[i]) == 'hide')
		{
			toggleActive(businessTypeList[i]);
		}
	}
}

/**
 * The hideMarkerType method goes and hides all of the markers of a specific business type by getting 
 * the marker name stored in the markers object, and then hides all of the markers associated with that
 * specific name. 
 * 
 * @param  String       businessType 		The specified businessType to hide all of the markers.
 */
window.hideMarkerType = function(businessType) 
{
	var businessType = businessType.toLowerCase();
	businessType = businessType.replace(" ", "_");

	for (var j = 0; j < markers[businessType].length; j ++)
	{
		markers[businessType][j].hide();
	}
}

/**
 * The showMarkerType method goes and shows all of the markers of a specific business type by getting 
 * the marker name stored in the markers object, and then shows all of the markers associated with that
 * specific name. 
 * 
 * @param  String       businessType 		The specified businessType to show all of the markers.
 */
window.showMarkerType = function(businessType) 
{
	var businessType = businessType.toLowerCase();
	businessType = businessType.replace(" ", "_");

	for (var j = 0; j < markers[businessType].length; j ++)
	{
		markers[businessType][j].show();
	}
}

/**
 * The toggleActive method goes and toggles the businessType in the view and map, meaning that if
 * the id of the businessType is active then the method hides all of the pins, if not then the pins
 * for the specified businessType are to be shown. After that is all done, then the method goes to 
 * hide all of the Sale Buttons. 
 * 
 * @param  String       businessType 		The specified businessType to toggle.
 */
window.toggleActive = function(businessType) 
{
	var businessTypeID = businessType.replace(' ', '_');
	if ($('#' + businessTypeID + '-Nav').hasClass('active'))
	{
		hidePins(businessType);
	}
	else
	{
		showPins(businessType);
	}
	hideSaleButtons();
}

/**
 * The hidePins method goes and hides all of the pins on the map and changes the view based off of the business
 * type. This means that first the view is changed, specifically in the navigation and in all of the modals. In
 * the navigation the active class is removed from the specified business type button and the image is changed to
 * red for better contrast with the non-active functionality. 
 * The modals are changed so that the buttons of the businessType on the button navigation bar are hidden and any
 * of the sales displayed in the modal are hidden as well. 
 * After the view has been changed the markers on the map that associate with the businessType are hidden, and a 
 * cookie is set for the specified businessType to be equal to hidden. This is to hide the pins on load.
 * 
 * @param  String       businessType 		The specified businessType to hide all of the pins.
 */
window.hidePins = function(businessType) 
{
	var businessTypeID = businessType.replace(' ', '_');
	var prepend = '';
	var append = '-2x-red.png';

	$('#' + businessTypeID + '-Nav').removeClass('active');
	$('#' + businessTypeID + '-Img').attr('src', getBusinessTypeIcon(businessType, prepend, append));
	$('.' + businessType + '-sale').hide();
	$('.' + businessType + '-button').hide();
	hideMarkerType(businessType);
	docCookies.setItem(businessType, 'hide');
}

/**
 * The showPins method goes and shows all of the pins on the map and changes the view based off of the business
 * type. This means that first the view is changed, specifically in the navigation and in all of the modals. In
 * the navigation the active class is added to the specified business type button and the image is changed to
 * white for better contrast with the active functionality. 
 * The modals are changed so that the buttons of the businessType on the button navigation bar are shown and any
 * of the sales displayed in the modal are shown as well. 
 * After the view has been changed the markers on the map that associate with the businessType are shown, and a 
 * cookie is removed that is equal to the business. This is to hide the pins on load.
 * 
 * @param  String       businessType 		The specified businessType to show all of the pins.
 */
window.showPins = function(businessType)
{
	var businessTypeID = businessType.replace(' ', '_');
	var prepend = '';
	var append = '-2x-white.png';

	$('#' + businessTypeID + '-Nav').addClass('active');
	$('#' + businessTypeID + '-Img').attr('src', getBusinessTypeIcon(businessType, prepend, append));
	$('.' + businessType + '-sale').show();
	$('.' + businessType + '-button').show();
	showMarkerType(businessType);
	docCookies.removeItem(businessType);
}

/**
 * The hideAllPins method goes and gets all of the pins to be hidden by calling the hidePins function with the
 * specific index of the businessTypeList object. It then goes to change the method of the hidePins button to 
 * show all of the pins, removes the favicons and shows a favicon to show of the pins, and then simply changes 
 * the text to say "Show Pins".
 */
window.hideAllPins = function() 
{
	for (var i = 0; i < businessTypeList.length; i ++)
	{
		hidePins(businessTypeList[i]);
	}
	
	$("#hidePinsButton").attr("onclick", "showAllPins()");
	$("#hidePinsButton .sub_icon").removeClass("fa-check-square");
	$("#hidePinsButton .sub_icon").removeClass("fa-minus-square");
	$("#hidePinsButton .sub_icon").addClass("fa-square");
	$("#hidePinsButton .word-describe").text(" Show Pins ");
}

/**
 * The showAllPins method goes and shows all of the pins in the business list and then goes to change the
 * method of the hidePins button to hide all of the pins, removes the favicons and shows a favicon to check
 * all of the pins, and then simply changes the text to say "Hide Pins".
 */
window.showAllPins = function()
{
	for (var i = 0; i < businessTypeList.length; i ++)
	{
		showPins(businessTypeList[i]);
	}

	$("#hidePinsButton").attr("onclick", "hideAllPins()");
	$("#hidePinsButton .sub_icon").removeClass("fa-square");
	$("#hidePinsButton .sub_icon").removeClass("fa-minus-square");
	$("#hidePinsButton .sub_icon").addClass("fa-check-square");
	$("#hidePinsButton .word-describe").text(" Hide Pins ");
}