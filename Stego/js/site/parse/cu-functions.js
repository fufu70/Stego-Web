/**
 *  The cu-functions.js file is there to create or update parse objects for The Parse Business
 *  or Sale classes and then submit the form that is associated with that specific create or update. 
 *  These functions follow the callNextFunction method standard in the site/global.js javascript file.
 * 
 *      @author Christian Micklisch    christian.micklisch@successwithsos.com 
 */

/*
    Update Functions:
        Functions that are there to update a parse object
 */

/**
 * The updateBusiness method goes and updates all of the privy information regarding the Business itself.
 * This means that it only updates the name, type, logo, homePage, and phoneNumber of the business. 
 * 
 * The info is usually the "form" itself, the "append", and the "business."
 * The source of this function is usually the beforeBusinessUpdate function in the before.js file.
 * 
 * @param  function[]   nextFunction    The next function or array of functions to call.
 * @param  array        info            The information to pass to the next method.
 */
function updateBusiness(nextFunction, info)
{
    info['business'].set("name", $('#Business_companyName' + info['append']).val());
    if ($('#Business_companyLogo' + info['append'])[0].files !== undefined)
    {
        info['business'].set("logo", new Parse.File("companyLogo.png", $('#Business_companyLogo' + info['append'])[0].files[0]));   
    }
    info['business'].set("businessType", $('#Business_companyType' + info['append']).val());
    info['business'].set("homePage", $('#Business_homePage' + info['append']).val());
    info['business'].set("phoneNumber", $('#Business_phoneNumber' + info['append']).val());
    
    info['business'].save(null, {
        success: function(business) {
            if (nextFunction !== undefined)
            {
                info['business'] = business;
                callNextFunction(nextFunction, info);
            }
            else
            {
                info['form'].submit();   
            }
        },
        error: function(business, error) {
            console.log("Cannot Update Business");
        },
    })
}

/**
 * The updateParseSale method goes and updates all of the privy information regarding the sale itself.
 * This means that it only updates the name, and the description of the sale, but only after it finds 
 * the sale first, it does this by using the parse_object_id that is stored in the #Sale_id input.
 * 
 * The info is usually the "form" itself, and the "append".
 * The source of this function is usually the beforeSaleUpdate function in the before.js file.
 * 
 * @param  function[]   nextFunction    The next function or array of functions to call.
 * @param  array        info            The information to pass to the next method.
 */
function updateParseSale(nextFunction, info)
{
    var Sale = Parse.Object.extend(SALE_CLASS);
    var query = new Parse.Query(Sale);
    var saleID = $('#Sale_id' + info['append']).val();

    query.get(saleID, {
        success: function(sale) {
            sale.set('name', $('#Sale_name' + info['append']).val());
            sale.set('description', $('#Sale_description' + info['append']).val());
            sale.save(null, {
                success: function(sale) {
                    if (nextFunction !== undefined)
                    {
                        info['sale'] = sale;
                        callNextFunction(nextFunction, info);
                    }
                    else
                    {
                        info['form'].submit();   
                    }
                },
                error: function(sale, error) {
                    console.log("could not update Sale");
                }
            });
        },
        error: function(error) {
            console.log("Sale does not exist");
        },
    });

}

/**
 * The updateParseBusinessForLocation method goes and updates all of the privy information regarding 
 * the location of the business itself. This means that it only updates the name of the location, and 
 * the location itself of the business.
 * 
 * The info is usually the "form" itself, the "append", the "parseLocation" (the latitude and longitude
 * in a parse object), and the "business" object itself (this allows the business to be updated with the
 * new location).
 * The source of this function is usually the beforeLocationUpdate function in the before.js file.
 * 
 * @param  function[]   nextFunction    The next function or array of functions to call.
 * @param  array        info            The information to pass to the next method.
 */
function updateParseBusinessForLocation(nextFunction, info)
{
    info['business'].set('locationName', $('#Location_address' + info['append']).val());
    info['business'].set("location", info['parseLocation']);
    info['business'].save(null, {
        success: function(business) {
            if (nextFunction !== undefined)
            {
                info['business'] = business;
                callNextFunction(nextFunction, info);
            }
            else
            {
                info['form'].submit();   
            }
        },
        error: function(business, error) {
            console.log("Location could not be updated");
        }
    });
}

/*
    Create Functions:
        Functions that are there to create parse objects.
 */

/**
 * The createParseBusiness method goes and creates a business for the parse database that includes all 
 * of the privy information regarding the business. This means that it will create a business with the 
 * name of the location, the location itself of the business, the name of the company, the home page, the
 * phone number, the time difference, and the business type. Once the business has been saved, then the
 * parse_object_id is saved in the form to be stored in the MySQL database.
 * 
 * The info is usually the "form" itself, and the "append".
 * The source of this function is usually the beforeSubmit function in the before.js file.
 * 
 * @param  function[]   nextFunction    The next function or array of functions to call.
 * @param  array        info            The information to pass to the next method.
 */
function createParseBusiness(nextFunction, info)
{
    var Business = Parse.Object.extend(BUSINESS_CLASS);
    var business = new Business();
    var parseLocation = new Parse.GeoPoint(parseFloat($('#Location_latitude' + info['append']).val()), 
                                            parseFloat($('#Location_longitude' + info['append']).val()));

    business.set("name", $('#Business_companyName' + info['append']).val());
    business.set("logo", new Parse.File("companyLogo.png", $('#Business_companyLogo' + info['append'])[0].files[0]));
    business.set("businessType", $('#Business_companyType' + info['append']).val());
    business.set("homePage", $('#Business_homePage' + info['append']).val());
    business.set("phoneNumber", $('#Business_phoneNumber' + info['append']).val());
    // business.set("businessEmail", $('#Business_contactEmail').val());
    business.set("timeDifference", $('#time_difference' + info['append']).val());
    business.set("location", parseLocation);
    business.set("locationName", $('#Location_address' + info['append']).val());
    
    business.save(null, {
        success: function(business) {
            info['form'].append('<input name="Business[business_parse_object_id]" type="text" value="' + business.id + '">');
            if (nextFunction !== undefined)
            {
                info['business'] = business;
                callNextFunction(nextFunction, info);
            }
            else
            {
                info['form'].submit();   
            }
        },
        error: function(business, error) {
            console.log("Cannot Create Business");
        },
    })
}

/**
 * The createParseSale method goes and creates a Sale for the parse database that includes all of the
 * privy information regarding the sale. This means that it will create a sale with the name of the 
 * location, the location itself of the sale, the name of the sale, the description of the sale, the id
 * of the business, the name of the business, the type of the business, the beginning date and end date
 * of the sale, and the amount of users that will been reached. Once the sale has been saved, then the
 * parse_object_id is saved in the form to be stored in the MySQL database.
 * 
 * The info is usually the "form" itself, the "append", the "parseLocation" (the latitude and longitude
 * in a parse object), and the "business" object itself (this allows the sale to associate itself in parse
 * with that specific business).
 * The source of this function is usually the beforeSubmit and beforeSaleSubmit functions in the before.js 
 * file.
 * 
 * @param  function[]   nextFunction    The next function or array of functions to call.
 * @param  array        info            The information to pass to the next method.
 */
function createParseSale(nextFunction, info)
{
    var Sale = Parse.Object.extend(SALE_CLASS);
    var sale = new Sale();

    sale.set("name", $('#Sale_name' + info['append']).val());
    sale.set("description", $('#Sale_description' + info['append']).val());
    sale.set("beginningDate", moment($('#Sale_beginning_date' + info['append']).val(), "MMM DD YYYY hh:mm A").toDate());
    sale.set("endDate", moment($('#Sale_end_date' + info['append']).val(), "MMM DD YYYY hh:mm A").toDate());
    sale.set("location", info['parseLocation']);
    sale.set("locationName", info['business'].get('locationName'));
    sale.set("businessID", info['business']);
    sale.set("businessName", info['business'].get('name'));
    sale.set("businessType", info['business'].get('businessType'));
    sale.set("usersReached", info['count']);
    sale.set("usersViewed", 0);
    sale.set("usersAskedDirections", 0);
    
    sale.save(null, {
        success: function(sale) {
            info['form'].append('<input name="Sale[sale_parse_object_id]" type="hidden" value="' + sale.id + '">');
            if (nextFunction !== undefined)
            {
                info['sale'] = sale;
                callNextFunction(nextFunction, info);
            }
            else
            {
                info['form'].submit();   
            }
        },
        error: function(sale, error) {
            console.log("Cannot Create Sale");
        },
    });
}

/*
    Helper Functions:
        Functions used to setup information for either a create or an update function.
 */

/**
 * The findBusiness method goes and gets the Business depending on the hashID saved in info. once the business
 * is found its stored in the info object.
 * 
 * The info is usually the "form" itself, the "append", and the "hashID."
 * The source of this function is usually the beforeSaleSubmit, beforeLocationUpdate, and beforeBusinessUpdate
 * functions in the before.js file.
 * 
 * @param  function[]   nextFunction    The next function or array of functions to call.
 * @param  array        info            The information to pass to the next method.
 */
function findBusiness(nextFunction, info)
{
    var Business = Parse.Object.extend(BUSINESS_CLASS);
    var query = new Parse.Query(Business);

    query.equalTo('hashID', info['hashID']);
    query.first({
        success: function(business) {
            if (nextFunction !== undefined)
            {
                info['business'] = business;
                callNextFunction(nextFunction, info);
            }
            else
            {
                info['form'].submit();   
            }
        },
        error: function(error) {
            console.log("Cannot Find business");
        }
    });
}

/**
 * The getUsernames method goes and gets the app users that will be receiving the push notification by finding all
 * of the users in a 100 mile radius and then comparing the users set radius to see if that user will be in the
 * location. Once the users are found they are counted and stored in the "count" value in the info object, stating
 * the amout of users that have been reached.
 * 
 * The info is usually the "form" itself, the "append", and the "parseLocation" (the latitude and longitude
 * in a parse object).
 * The source of this function is usually the beforeSaleSubmit, beforeLocationUpdate, and beforeBusinessUpdate
 * functions in the before.js file.
 * 
 * @param  function[]   nextFunction    The next function or array of functions to call.
 * @param  array        info            The information to pass to the next method.
 */
function getUsernames(nextFunction, info)
{
    var query = new Parse.Query(Parse.User);
    query.withinMiles("userslastlocation", info['parseLocation'], 100);
    query.find({
        success: function(users) {
            var count = 0;
            for (var i = 0; i < users.length; i ++)
            {
                if (calculateDistance(info['parseLocation'].latitude, info['parseLocation'].longitude, users[i].attributes.userslastlocation.latitude, users[i].attributes.userslastlocation.longitude) 
                        <= users[i].attributes.usersaleradius)
                {
                    info['form'].append('<input name="Sale[sale_users][]" type="hidden" value="' + users[i].attributes.username + '">');
                    count ++;
                }
            }
            if (nextFunction !== undefined)
            {
                info['count'] = count;
                callNextFunction(nextFunction, info);
            }
            else
            {
                info['form'].submit();   
            }
        },
        error: function(error) {
            console.log("Error: Cannot find users");
            createParseSale(form, append, business, parseLocation, 0);
        }
    });
}