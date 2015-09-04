
var Index = (function() {

    var _blob = "";
    var self = this;

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

        $(".option-header").typed({
            strings: [''],
            cursorChar: ''
        });

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
     * By default the Generate Modal will always have its submit buttons hidden
     * from plain sight until the user has put in an input. In this way the
     * user is not given the action to click until all of the proper
     * information has been given.
     * 
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
     *
     *     5.) When the user goes to input a message, if the message exists 
     *         then the submit button will be shown, if not then the submit 
     *         button will be hidden from the user.
     *
     *     6.) When the user goes to input a file, if the user did not select a
     *         file then the submit button will be hidden (e.g. if they
     *         pressed "cancel"). Otherwise the submit button will be shown.
     */
    var _initGenerate = function() {

        // 1.)
        $('#generateModal .btn-message').click(function(e) {
            $("#generateModal .option-header")
                .addStrings(["Type in the message to generate"]);

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
            $("#generateModal .option-header")
                .addStrings(["Select your desired file . . . any file"]);

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
                    Stego.generate(e.target.result, _generateDisplay, selectedFile.name);
                };

                reader.readAsBinaryString(selectedFile);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }
        });

        // 5.)
        $('#generateModal .options.message .text-area').on('input', function(e) {
            if (!$(this).val())
            {
                self.typeGenerateMessage = false;
                $("#generateModal .option-header")
                    .addStrings(["hmmm thats not a message  . . . try again"]);

                $('#generateModal .options.message .btn-submit').fadeOut('fast');
            }
            else
            {
                if (!self.typeGenerateMessage)
                {
                    self.typeGenerateMessage = true;

                    $("#generateModal .option-header")
                        .addStrings([
                            "Nice message, I wish I thought of that",
                            "Click Generate to create your image"
                        ]);
                }
                $('#generateModal .options.message .btn-submit').fadeIn('slow');
            }
        });

        // 6.)
        $('#generateModal .options.file .input-file').on('change', function(e) {
            if (!$(this).val())
            {  
                $("#generateModal .option-header")
                    .addStrings(["hmmm  . . . I don't think thats a file"]);
                $('#generateModal .options.file .btn-submit').fadeOut('fast');
            }
            else
            {
                $("#generateModal .option-header")
                    .addStrings([
                        "Nice file. I think I've seen that one before",
                        "Click Generate to create your image"
                    ]);
                $('#generateModal .options.file .btn-submit').fadeIn('slow');
            }
        });

        // hide the submit buttons before the modal is opened
        $('#generateModal .options.file .btn-submit').fadeOut('fast');
        $('#generateModal .options.message .btn-submit').fadeOut('fast');


        $(document).on('opened.fndtn.reveal', '#generateModal[data-reveal]', function(e) {
            $("#generateModal .option-header")
                .addStrings(["What kind of image do you want to make?"]);
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
        return;
    };

    /**
     * The init encode defines several UX functions for the encode modal:
     *
     *     1.) When the message button is selected the select view is hidden 
     *         from the user nad the message option div is shown.
     *
     *     2.) When the submit button is pressed inside of the message div the
     *         message div fades out, and the loading screen is shown. The
     *         encode function is called with the source of the input image, 
     *         the contents of the text file, and the final function to display
     *         the encoded image.
     *
     *     3.) When the file button is selected from the user the select div is
     *         hidden and the file div is shown.
     *
     *     4.) When the submit button is clicked the loading screen is shown
     *         and the file option div is faded. The selected file is then 
     *         and once all of the contents have been gathered the encode 
     *         function with the source of the image, the result of the read
     *         file, the name of the file and the final function to display the
     *         encoded image.
     *         
     */
    var _initEncode = function() {

        // 1.)
        $('#encodeModal .options.select .btn-message').click(function(e) {

            $("#encodeModal .option-header")
                .addStrings(["Type in the message to hide"]);

            $('#encodeModal .options.select').fadeOut("slow");
            $('#encodeModal .options.message').fadeIn("slow");
        });

        // 2.)
        $('#encodeModal .options.message .btn-submit').click(function(e) {

            document.getElementById('loading').style.display = "block";
            $('#encodeModal .options.message').fadeOut("slow");

            $('#encodeModal .option-header').addStrings(['']);

            Stego.encode($('#encodeModal .options.message .input-image').get(0).files[0], $('#encodeModal .options.message .text-area').val(), 'file.txt', _encodeDisplay);
        });

        // 3.)
        $('#encodeModal .options.select .btn-file').click(function(e) {

            $("#encodeModal .option-header")
                .addStrings([
                    "Select your file you want to hide",
                    "Don't worry . . . It can be anything"
                ]);

            $('#encodeModal .options.select').fadeOut("slow");
            $('#encodeModal .options.file').fadeIn("slow");
        });

        // 4.)
        $('#encodeModal .options.file .btn-submit').click(function(e) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {

                document.getElementById('loading').style.display = "block";
                $('#encodeModal .options.file').fadeOut("slow");

                $('#encodeModal .option-header').addStrings(['']);

                var selectedFile = $('#encodeModal .options.file .input-file').get(0).files[0];

                var reader = new FileReader();
                reader.onload = function(e) {

                    Stego.encode($('#encodeModal .options.file .input-image').get(0).files[0], e.target.result, selectedFile.name, _encodeDisplay);
                };

                reader.readAsBinaryString(selectedFile);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }
        });

        // 5.)
        $('#encodeModal .options.message .text-area').on('input', function(e) {
            if (!$(this).val()) 
            {  
                self.typeEncodeMessage = false;
                $("#encodeModal .option-header")
                    .addStrings([
                        "All you need to do is type some letters . . .",
                        "Look down . . . See those keys? . . . Start typing"
                    ]);

                $('#encodeModal .options.message .btn-image').fadeOut('fast');
                $('#encodeModal .options.message .btn-submit').fadeOut('fast');
            }
            else 
            {
                $('#encodeModal .options.message .btn-image').fadeIn('slow');
                if ($('#encodeModal .options.message .input-image').val())
                {
                    $('#encodeModal .options.message .btn-submit').fadeIn('slow');
                }
                else
                {

                    if (!self.typeEncodeMessage)
                    {
                        self.typeEncodeMessage = true;

                        $("#encodeModal .option-header")
                            .addStrings(["What image do you want to hide your message in?"]);
                    }
                }
            }
        });

        // 6.)
        $('#encodeModal .options.file .input-file').on('change', function(e) {
            if (!$(this).val())
            {   
                $('#encodeModal .options.file .btn-file span').text('Select File');
                $("#encodeModal .option-header")
                    .addStrings([
                        "Just a thought here . . . ",
                        "You need to select an actual file . . ."
                    ]);

                $('#encodeModal .options.file .btn-image').fadeOut('fast');
                $('#encodeModal .options.file .btn-submit').fadeOut('fast');
            }
            else 
            {
                var parts = $(this).val().split('\\');
                $('#encodeModal .options.file .btn-file span').text(parts[parts.length - 1]);

                $('#encodeModal .options.file .btn-image').fadeIn('slow');
                if ($('#encodeModal .options.file .input-image').val())
                {
                    $('#encodeModal .options.file .btn-submit').fadeIn('slow');
                }
                else
                {
                    $("#encodeModal .option-header")
                        .addStrings(["What image do you want to hide your file in?"]);
                }
            }
        });

        // 7.)
        $('#encodeModal .options.message .input-image').on('change', function(e) {
            if (!$(this).val() || !_isImage($(this).val()))
            {
                $('#encodeModal .options.message .btn-image span').text('Select Image');
                $("#encodeModal .option-header")
                    .addStrings([
                        'Its ok, not everyone can select an image <i class="fa fa-smile-o"></i>'
                    ]);

                $('#encodeModal .options.message .btn-submit').fadeOut('fast');
            }
            else 
            {
                var parts = $(this).val().split('\\');
                $('#encodeModal .options.message .btn-image span').text(parts[parts.length - 1]);

                $("#encodeModal .option-header")
                    .addStrings([
                        'Nice Image . . . I think I\'ve seen it before . . .',
                        'Ok! Now select Encode to hide your message!'
                    ]);
                $('#encodeModal .options.message .btn-submit').fadeIn('fast');
            }
        });

        // 8.)
        $('#encodeModal .options.file .input-image').on('change', function(e) {
            if (!$(this).val() || !_isImage($(this).val()))
            {
                $('#encodeModal .options.file .btn-image span').text('Select Image');
                $("#encodeModal .option-header")
                    .addStrings([
                        'Its ok, not everyone can select an image <i class="fa fa-smile-o"></i>'
                    ]);

                $('#encodeModal .options.file .btn-submit').fadeOut('fast');
            }
            else
            {
                var parts = $(this).val().split('\\');
                $('#encodeModal .options.file .btn-image span').text(parts[parts.length - 1]);

                $("#encodeModal .option-header")
                    .addStrings([
                        'Ok! Now select Encode to hide your file!'
                    ]);

                $('#encodeModal .options.file .btn-submit').fadeIn('fast');
            }
        });

        $('#encodeModal .options.message .btn-image').fadeOut('fast');
        $('#encodeModal .options.file .btn-image').fadeOut('fast');

        $('#encodeModal .options.message .btn-submit').fadeOut('fast');
        $('#encodeModal .options.file .btn-submit').fadeOut('fast');

        $(document).on('opened.fndtn.reveal', '#encodeModal[data-reveal]', function(e) {
            $("#encodeModal .option-header")
                .addStrings(["What do you want to hide?"]);


            $('#encodeModal .options.file .btn-file span').text('Select File');
            $('#encodeModal .options.message .btn-image span').text('Select Image');
            $('#encodeModal .options.file .btn-image span').text('Select Image');
        });

        return;
    };


    /**
     * Goes and displays the encoded image as well as hiding the loading div,
     * file div and message div and goes to show the success div.
     */
    var _encodeDisplay = function(imageData) {
        var imageID = 'encodeCanvasImage';
        var dataURL = _displayImage(imageData, imageID);

        self._blob = _dataURItoBlob(dataURL);

        download(self._blob, 'image.png');

        $('#encodeModal .options.message').fadeOut('slow');
        $('#encodeModal .options.file').fadeOut('slow');
        $('#encodeModal .options.success').fadeIn('slow');

        document.getElementById('loading').style.display = "none";

        $("#encodeModal .option-header")
            .addStrings([
                'We\'re done!!! Now its time to share your image <i class="fa fa-smile-o"></i>'
            ]);

        return;
    };

    var _dataURItoBlob = function(dataURI) {
        var binary = atob(dataURI.split(',')[1]), array = [];
        for(var i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
        return new Blob([new Uint8Array(array)], {type: 'image/png'});
    }

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

            $("#decodeModal .option-header").addStrings([""]);

            Stego.decode($('#decodeModal .input-file').get(0).files[0], _decodeDownload);
        });

        $('#decodeModal .input-file').change(function(e) {
            if (!$(this).val() || !_isImage($(this).val()))
            {
                $('#decodeModal .btn-file span').text('Select Image');
                $("#decodeModal .option-header")
                    .addStrings(["You kinda have to select an image to decode something . . ."]);
                $('#decodeModal .btn-submit').fadeOut('fast');
            }
            else
            {    
                var parts = $(this).val().split('\\');
                $('#decodeModal .btn-file span').text(parts[parts.length - 1]);
                $("#decodeModal .option-header")
                    .addStrings([
                        "Alright, let's see whats in here",
                        "Press decode and you will extract its data."
                    ]);
                $('#decodeModal .btn-submit').fadeIn('slow');
            }
        });

        $('#decodeModal .btn-submit').fadeOut('fast');

        $(document).on('opened.fndtn.reveal', '#decodeModal[data-reveal]', function(e) {
            $("#decodeModal .option-header")
                .addStrings(["Select the Image you want to decode"]);

            $('#decodeModal .btn-file span').text('Select Image');
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
        var url = URL.createObjectURL(self._blob);
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

        self._blob = new Blob([new Uint8Array(fileData)], {type: FileType.getFileType(filename)});

        download(self._blob, filename);

        document.getElementById('loading').style.display = "none";
        $('#decodeModal .options.success').fadeIn("slow");

        $("#decodeModal .option-header")
                .addStrings(['Hope thats the file you\'re looking for <img src="images/nyancat.gif"></img>']);
        return;
    };

    /**
     * Goes and sets the canvas height and width from the image Data, clears
     * the canvas, places the image inside of the canvas and then sets the
     * source of the image Element to the canvases data in the form of a URL.
     * 
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

        return dataURL;
    };

    /**
     * Checks if the filename represents an image
     * 
     * @param  {string}  fileName The name of the file
     * @return {Boolean}          If the file is an image
     */
    var _isImage = function(fileName) {
        var ext = _getExtension(fileName);
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':
                return true;
        }
        return false;
    }

    /**
     * Gets the extension of the file based off of the file name.
     * 
     * @param  {string}  fileName The name of the file.
     * @return {string}           The extension of the file.
     */
    var _getExtension = function(fileName) {
        var parts = fileName.split('.');
        return parts[parts.length - 1];
    }

    /**
     * Calls all of the necessary initialization functions.
     */
    var _init = function() {
        _initPhoneOS();
        _initOptionElements();
        // _initGenerate();
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