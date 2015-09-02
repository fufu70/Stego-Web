
var Index = (function() {

    var _blob = "";
    var that = this;

    /**
     * The _initPhoneOS goes and checks to see what the current phone
     * operating system is and hides all other icons that are not associated
     * with that operating system.
     */
    var _initPhoneOS = function() {
        // if its iOS show only the iOS icon
        if (isMobile.iOS())
        {
            $('.windows').hide();
            $('.android').hide();
        }
        // if its windows show only the windows icon
        else if (isMobile.Windows())
        {
            $('.apple').hide();
            $('.android').hide();
        }
        // if its android show only the android icon
        else if (isMobile.Android())
        {
            $('.apple').hide();
            $('.windows').hide();
        }
        return;
    };

    /**
     * Each modal has a group of option div's inside of it. The first option
     * div is always the .select div. The elements change in visiblility when 
     * the user goes through each different modal so to keep with consistency
     * when the user closes the modal all of the options need to be viewed in
     * their initial form. That is the menu starts back from the beginning if
     * the user decides to close the modal.
     *
     * So when the user decides to open a modal it must always show the select
     * div.
     */
    var _initOptionElements = function() {

        // hide all options initially
        $('.options').fadeOut("fast");

        // whenver a modal is opened the select option needs to be shown
        $(document).on('opened.fndtn.reveal','.full[data-reveal]', function(e) {
            $(this).find('.options.select').fadeIn("slow");
        });
        // whenever a modal is closed all options inside of that modal need
        // to be hidden
        $(document).on('closed.fndtn.reveal','.full[data-reveal]', function(e) {
            $(this).find('.options').fadeOut("fast");
        });

        return;
    };

    /**
     * The _initGenerate method goes and defines some functions:
     * 
     *     1.) When the btn-message button is clicked the select div is faded
     *         out and the message div is shown.
     *
     *     2.) When the btn-submit is clicked in the message div then the 
     *         message div is faded, loading screen is shown and the generate
     *         image function is called with the contexts of the textarea,
     *         the default filename is set to file.txt for the header
     *         information, and the final function to display the generated
     *         image.
     *         
     *     3.) When the btn-file button is clicked then the select div is faded
     *         out and the file div is shown.
     *
     *     4.) When the btn-submit is clicked in the file div the file div 
     *         fades, the loading screen is shown and the contents of the given
     *         file will be read and sent to the generate image method along 
     *         with the filename and the final function to display the
     *         generated image.
     */
    var _initGenerate = function() {

        // 1.)
        $('#generateModal .btn-message').click(function(e) {
            $('#generateModal .options.select').fadeOut("slow");
            $('#generateModal .options.message').fadeIn("slow");
        });

        // 2.)
        $('#generateModal .options.message .btn-submit').click(function(e) {

            document.getElementById('loading').style.display = "block";
            $('#generateModal .options.message').fadeOut("slow");
            Stego.generate($('#generateModal .text-area').val(), _generateDisplay, 'file.txt');
        });

        // 3.)
        $('#generateModal .btn-file').click(function(e) {
            $('#generateModal .options.select').fadeOut("slow");
            $('#generateModal .options.file').fadeIn("slow");
        });

        // 4.)
        $('#generateModal .options.file .btn-submit').click(function(e) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {

                document.getElementById('loading').style.display = "block";

                var selectedFile = $('#generateModal .input-file').get(0).files[0];

                var reader = new FileReader();
                reader.onload = function(e) {
                    start = performance.now();
                    Stego.generate(e.target.result, _generateDisplay, selectedFile.name);
                };

                reader.readAsBinaryString(selectedFile);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }
        });

        return;  
    };

    /**
     * Goes and displays the generated image as well as hiding the loading div,
     * file div and message div and goes to show the success div.
     */
    var _generateDisplay = function(imageData) {
        var imageID = 'generateCanvasImage';
        _displayImage(imageData, imageID);

        $('#generateModal .options.message').fadeOut('slow');
        $('#generateModal .options.file').fadeOut('slow');
        $('#generateModal .options.success').fadeIn('slow');

        document.getElementById('loading').style.display = "none";
        end = performance.now();
        console.log(end-start);
        return;
    };

    var _initEncode = function() {

        // 1.)
        $('#encodeModal .btn-message').click(function(e) {
            $('#encodeModal .options.select').fadeOut("slow");
            $('#encodeModal .options.message').fadeIn("slow");
        });

        // 2.)
        $('#encodeModal .options.message .btn-submit').click(function(e) {

            document.getElementById('loading').style.display = "block";
            $('#encodeModal .options.message').fadeOut("slow");
            Stego.encode($('#encodeModal .options.message .input-image').get(0).files[0], $('#encodeModal .options.message .text-area').val(), 'file.txt', _encodeDisplay);
        });

        // 3.)
        $('#encodeModal .btn-file').click(function(e) {
            $('#encodeModal .options.select').fadeOut("slow");
            $('#encodeModal .options.file').fadeIn("slow");
        });

        // 4.)
        $('#encodeModal .options.file .btn-submit').click(function(e) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {

                document.getElementById('loading').style.display = "block";

                var selectedFile = $('#encodeModal .options.file .input-file').get(0).files[0];

                var reader = new FileReader();
                reader.onload = function(e) {
                    start = performance.now();

                    Stego.encode($('#encodeModal .options.file .input-image').get(0).files[0], e.target.result, selectedFile.name, _encodeDisplay);
                };

                reader.readAsBinaryString(selectedFile);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }
        });

        return;
    };


    /**
     * Goes and displays the encoded image as well as hiding the loading div,
     * file div and message div and goes to show the success div.
     */
    var _encodeDisplay = function(imageData) {
        var imageID = 'encodeCanvasImage';
        _displayImage(imageData, imageID);

        $('#encodeModal .options.message').fadeOut('slow');
        $('#encodeModal .options.file').fadeOut('slow');
        $('#encodeModal .options.success').fadeIn('slow');

        document.getElementById('loading').style.display = "none";
        end = performance.now();
        console.log(end-start);
        return;
    };

    /**
     * The _initDecode defines a function that is called when the btn-submit is
     * clicked and simply fades out the select option, makes the loading view 
     * visible and sends the selected file to the stegonagraphy class's decode
     * image method with the decodeDownload method as the final method.
     */
    var _initDecode = function() {

        $('#decodeModal .btn-submit').click(function(e) {
            document.getElementById('loading').style.display = "block";
            $('#decodeModal .options.select').fadeOut("slow");
            Stego.decode($('#decodeModal .input-file').get(0).files[0], _decodeDownload);
        });

        return;
    };

    /**
     * The _download method is there to force a download on the user with the 
     * current blob of the Index object (that is the file that was decoded).
     * 
     * The button associated with file is only visible once the decoding
     * process is done and the blob has been associated with the Index object.
     */
    var _download = function() {
        var url = URL.createObjectURL(that._blob);
        window.open(url,"_blank","");
        return;
    };

    /**
     * The _decodeDownload method is there to create a blob sets the Index 
     * objects blob to the blob data from the fileData and force downloads the
     * blob.
     *
     * Once those actions have been finished the loading screen is hidden and
     * decode modals success view is visible.
     * 
     * @param  {array}  fileData The Data that was stored in the given image to
     *                           decode.
     * @param  {string} filename The name of the file stored in the header of
     *                           the given image.
     */
    var _decodeDownload = function(fileData, filename) {

        that._blob = new Blob([new Uint8Array(fileData)], {type: FileType.getFileType(filename)});

        download(that._blob, filename);

        document.getElementById('loading').style.display = "none";
        $('#decodeModal .options.success').fadeIn("slow");
        return;
    };

    /**
     * Goes and sets the canvas height and width from the image Data, clears
     * the canvas, places the image inside of the canvas and then sets the
     * source of the image Element to the canvases data in the form of a URL.
     * @param  {ImageData}  imageData The data that was created by either 
     *                                generating or encoding some image.
     * @param  {string}     imageID   The id of the desired image element to
     *                                display.
     */
    var _displayImage = function(imageData, imageID) {
        var canvas = document.getElementById('stegoCanvas');
        canvas.width = imageData.width;
        canvas.height = imageData.height;

        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(imageData, 0, 0);

        var dataURL = canvas.toDataURL();
        document.getElementById(imageID).src = dataURL;
    };

    /**
     * Calls all of the necessary initialization functions.
     */
    var _init = function() {
        _initPhoneOS();
        _initOptionElements();
        _initGenerate();
        _initEncode();
        _initDecode();
        return;
    };

    return {
        init: _init,
        download: _download
    };

})();

$(document).ready(function() {

    Index.init();

});

var _initEncode = function() {

    $('#encodeModal .btn-submit').click(function(e) {
        if (window.File && window.FileReader && window.FileList && window.Blob) {

            document.getElementById('loading').style.display = "block";

            var selectedFile = $('#encodeModal .input-file').get(0).files[0];

            var reader = new FileReader();
            reader.onload = function(e) {
                start = performance.now();

                encodeImage($('#encodeModal .input-image').get(0).files[0], e.target.result, selectedFile.name, encodeImageTwo);
            };

            reader.readAsBinaryString(selectedFile);
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    });
};


var encodeImageTwo = function(imageData) {
    var canvas = document.getElementById('stegoCanvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.putImageData(imageData, 0, 0);

    var dataURL = canvas.toDataURL();
    document.getElementById('encodeCanvasImage').src = dataURL;
    $('#encodeModal .options.encode').fadeOut("slow");
    $('#encodeModal .options.success').fadeIn("slow");

    document.getElementById('loading').style.display = "none";
    end = performance.now();
    console.log(end-start);
}
