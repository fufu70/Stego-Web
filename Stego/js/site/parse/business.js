window.getMapLink = function( latitude, longitude, businessLat, businessLong) 
{
	var link = 'https://maps.google.com/maps?saddr=' + latitude + ',' + longitude + '&daddr=' +
													businessLat + ',' + businessLong;

    if( (navigator.platform.indexOf("iPhone") != -1) 
        || (navigator.platform.indexOf("iPod") != -1)
        || (navigator.platform.indexOf("iPad") != -1))
    {
		var link = 'http://maps.apple.com/maps?saddr=' + latitude + ',' + longitude + '&daddr=' +
														businessLat + ',' + businessLong;	
    }
    else
    {
		var link = 'https://maps.google.com/maps?saddr=' + latitude + ',' + longitude + '&daddr=' +
														businessLat + ',' + businessLong;
    }
	return link;
}

window.loadUserInformation = function(objectId)
{
    Parse.initialize("pujHnbi6OhC9od6ubdQMoVpjcOKwzGZRct8n60Is", "KGfbWg2FLoq1aU6SyQdE8mrxI0uEFhRDhKUZr9oZ");
    var User = Parse.Object.extend("Business");
    var business = new User();
    business.id = objectId;

    var Sale = Parse.Object.extend('Sale');
    var query = new Parse.Query(Sale);
    var timeDifference = getTimeDifference();

    var todaysDate = new Date(moment().subtract('hour', timeDifference)); 
    query.lessThanOrEqualTo("beginningDate", todaysDate);
    query.greaterThanOrEqualTo("endDate", todaysDate);
    query.equalTo('businessID', business);
    query.find({
        success: function(results) {
            for (var i = 0; i < results.length; i ++)
            {
                if (results[i] !== undefined)
                {
                    var beginning_date = moment(results[i].get('beginningDate')).add('hour', timeDifference);
                    var end_date = moment(results[i].get('endDate')).add('hour', timeDifference);
                    htmlMarkup = '<tr>' +
                                    '<td>' + results[i].get('name') + '</td>' +
                                    '<td>' + results[i].get('description') + '</td>' +
                                    '<td>' + String(beginning_date).replace(/GMT.+/g, '') + '</td>' +
                                    '<td>' + String(end_date).replace(/GMT.+/g, '') + '</td>' +
                                '</tr>';
                    $('#current-sale-table-body').append(htmlMarkup);
                }
                $('.current-sales .no-sale').hide();
            }
            
        },
        error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });

    query = new Parse.Query(Sale);
    query.greaterThanOrEqualTo("beginningDate", todaysDate);
    query.greaterThanOrEqualTo("endDate", todaysDate);
    query.equalTo('businessID', business);
    query.find({
        success: function(results) {
            for (var i = 0; i < results.length; i ++)
            {
                if (results[i] !== undefined)
                {
                    var beginning_date = moment(results[i].get('begininngDate')).add('hour', timeDifference);
                    var end_date = moment(results[i].get('endDate')).add('hour', timeDifference);
                    htmlMarkup = '<tr>' +
                                    '<td>' + results[i].get('name') + '</td>' +
                                    '<td>' + results[i].get('description') + '</td>' +
                                    '<td>' + String(beginning_date).replace(/GMT.+/g, '') + '</td>' +
                                    '<td>' + String(end_date).replace(/GMT.+/g, '') + '</td>' +
                                '</tr>';
                    $('#coming-sale-table-body').append(htmlMarkup);
                }
                $('.coming-sales .no-sale').hide();
            }
            
        },
        error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
}

window.loadBusinessInformation = function(objectId)
{
    Parse.initialize("pujHnbi6OhC9od6ubdQMoVpjcOKwzGZRct8n60Is", "KGfbWg2FLoq1aU6SyQdE8mrxI0uEFhRDhKUZr9oZ");
    var User = Parse.Object.extend("Business");
    var business = new User();
    business.id = objectId;

    var Sale = Parse.Object.extend('Sale');
    var query = new Parse.Query(Sale);

    var timeDifference = getTimeDifference();

    var todaysDate = new Date(moment().subtract('hour', timeDifference)); 
    query.equalTo('businessID', business);
    query.find({
        success: function(results) {
            for (var i = 0; i < results.length; i ++)
            {
                if (results[i] !== undefined)
                {
                    var users_reached = 0;
                    var users_viewed = 0;
                    var users_asked_directions = 0;
                    if (results[i].get('usersReached') !== undefined)
                    {
                        users_reached = results[i].get('usersReached');
                    }
                    if (results[i].get('usersViewed') !== undefined)
                    {
                        users_viewed = results[i].get('usersViewed');
                    }
                    if (results[i].get('usersAskedDirections') !== undefined)
                    {
                        users_asked_directions = results[i].get('usersAskedDirections');
                    }

                    var beginning_date = moment(results[i].get('beginningDate')).add('hour', timeDifference);
                    var end_date = moment(results[i].get('endDate')).add('hour', timeDifference);
                    htmlMarkup = '<tr style="cursor:pointer;" id="' + results[i].id + '" data-toggle="modal" data-target="#update_sale">' +
                                    '<td id="id" style="display:none">' + results[i].id + '</td>' + 
                                    '<td id="name">' + results[i].get('name') + '</td>' +
                                    '<td id="description">' + results[i].get('description') + '</td>' +
                                    '<td id="beginning_date">' + String(beginning_date).replace(/:00 GMT.+/g, '') + '</td>' +
                                    '<td id="end_date">' + String(end_date).replace(/:00 GMT.+/g, '') + '</td>' +
                                    '<td>' + users_reached + '</td>' +
                                    '<td>' + users_viewed + '</td>' +
                                    '<td>' + users_asked_directions + '</td>' +
                                '</tr>';
                    $('#business-sales-table-body').append(htmlMarkup);
                }
            }

            jQuery(function($) {
                $('[data-target="#update_sale"]').click(function(event) {
                    var itemID = $(this).attr('id');
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
            
        },
        error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
}

window.setupDirectionLink = function(latitude, longitude, businessLat, businessLong)
{
    $(".btn-direction").attr("href", getMapLink(latitude, longitude, businessLat, businessLong));
}