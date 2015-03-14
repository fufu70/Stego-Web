/**
 *  The before.js file is there to setup the cu-functions that are defined in the cu-functions.js file.
 *  This means that the before functions are there to set the info and nextFunction lists for those previously
 *  mentioned functions. Also, each before function makes the submit button display the loading text.
 * 
 *      @author Christian Micklisch    christian.micklisch@successwithsos.com 
 */

/**
 * The beforeSubmit function goes and is called to create a sale and business object in the parse
 * database. The information that is to be stored is the append and form that is given. The functions
 * to be called in order are to create the parse business, then get all of the usernames to get the push
 * notification about the sale, and then create the sale.
 * 
 * @param  DOMElement   submitButton    The submit button that is to be pressed by the user.
 * @param  DOMElement   formGiven       The form that is to be submitted after all of the functions have 
 *                                      been passed.
 * @param  String       appendGiven     The append that is given.
 */
function beforeSubmit(submitButton, formGiven, appendGiven)
{
    submitButton.button('loading');
    var infoList = {
        form: formGiven,
        append: appendGiven
    };
    var functionList = [createParseBusiness, getUsernames, createParseSale];
    callNextFunction(functionList, infoList);
}

/**
 * The beforeSaleSubmit function goes and is called to create a sale in the parse database. The information that
 * is to be stored is the append, the form, the hashID, and the parseLocation which is just a parse object that
 * is a geopoint acting as a wrapper for latitude and longitude objects. The functions to be called in order are 
 * to find the business, get all of the users in the area to receive a push notification about the sale, and to
 * create the sale.
 * 
 * @param  DOMElement   submitButton    The submit button that is to be pressed by the user.
 * @param  DOMElement   formGiven       The form that is to be submitted after all of the functions have 
 *                                      been passed.
 * @param  String       appendGiven     The append that is given.
 * @param  float        latitude        The latitude given by the business or user.
 * @param  float        longitude       The longitude given by the business or user.
 * @param  String       hashIdent       The hashID of the business.
 */
function beforeSaleSubmit(submitButton, formGiven, appendGiven, latitude, longitude, hashIdent)
{
    submitButton.button('loading');
    var infoList = {
        form: formGiven,
        append: appendGiven,
        hashID: hashIdent,
        parseLocation: new Parse.GeoPoint(latitude, longitude),
    };
    var functionList = [findBusiness, getUsernames, createParseSale];
    callNextFunction(functionList, infoList);
}

/**
 * The beforeSaleUpdate function goes and is called to update the sale class that is stored in the parse
 * database. The information that is to be stored is the append and form that is given. The function
 * to be called is just the updateParseSale method.
 * 
 * @param  DOMElement   submitButton    The submit button that is to be pressed by the user.
 * @param  DOMElement   formGiven       The form that is to be submitted after all of the functions have 
 *                                      been passed.
 * @param  String       appendGiven     The append that is given.
 */
function beforeSaleUpdate(submitButton, formGiven, appendGiven)
{
    submitButton.button('loading');
    var infoList = {
        form: formGiven,
        append: appendGiven
    };
    var functionList = [updateParseSale];
    callNextFunction(functionList, infoList);
}

/**
 * The beforeLocationUpdate function goes and is called to update a location stored in the business object in the 
 * parse database. The information that is to be stored is the append, the form, the hashID, and the parseLocation 
 * which is just a parse object that is a geopoint acting as a wrapper for latitude and longitude objects. The 
 * functions to be called in order are to find the business, and then to update the location stored in the business.
 * 
 * @param  DOMElement   submitButton    The submit button that is to be pressed by the user.
 * @param  DOMElement   formGiven       The form that is to be submitted after all of the functions have 
 *                                      been passed.
 * @param  String       appendGiven     The append that is given.
 * @param  float        latitude        The latitude given by the business or user.
 * @param  float        longitude       The longitude given by the business or user.
 * @param  String       hashIdent       The hashID of the business.
 */
function beforeLocationUpdate(submitButton, formGiven, appendGiven, latitude, longitude, hashIdent)
{
    submitButton.button('loading');
    var infoList = {
        form: formGiven,
        append: appendGiven,
        hashID: hashIdent,
        parseLocation: new Parse.GeoPoint(latitude, longitude),
    };
    var functionList = [findBusiness, updateParseBusinessForLocation];
    callNextFunction(functionList, infoList);
}

/**
 * The beforeBusinessUpdate function goes and is called to update a busines object in the parse database. The 
 * information that is to be stored is the append, the form, and the hashID. The functions to be called in order 
 * are to find the business, and then to update the business.
 * 
 * @param  DOMElement   submitButton    The submit button that is to be pressed by the user.
 * @param  DOMElement   formGiven       The form that is to be submitted after all of the functions have 
 *                                      been passed.
 * @param  String       appendGiven     The append that is given.
 * @param  float        latitude        The latitude given by the business or user.
 * @param  float        longitude       The longitude given by the business or user.
 * @param  String       hashIdent       The hashID of the business.
 */
function beforeBusinessUpdate(submitButton, formGiven, appendGiven, hashIdent)
{
    submitButton.button('loading');
    var infoList = {
        form: formGiven,
        append: appendGiven,
        hashID: hashIdent,
    };
    var functionList = [findBusiness, updateBusiness];
    callNextFunction(functionList, infoList);
}
