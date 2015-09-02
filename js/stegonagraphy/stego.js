var Stego = (function() {

	var _constants = Object.freeze({
		DATA_MAP_TYPE: 0,
		BASE_N_TYPE: 1,
		GENERATE_BASE: 256,
		NO_ENCRYPTION: 0,
		USE_ENCRYPTION: 1,
		DEFAULT_EXTENSION: "file.txt",
		DEFAULT_SIZE: 0
	});

	/**
	 * Generates an image based off of the given file data. When the file has 
	 * been generated into an image then the final function is called to 
	 * display the image and allow it to be downloaded. If a fileName is not
	 * included then the fileName will be set to "file.txt". 
	 *
	 * The function goes to first create the necessary header defining the
	 * encode base, the encryption type, the encode type, the file extension,
	 * and the encoding size (the file size). 
	 *
	 * Once that is done it goes to find the maximum amount of size needed to 
	 * store the file as an image. It creates a Web Worker to generate the 
	 * image, send the fileData, the header data, the headers length, and the
	 * maximum amount of size needed to generate the image.
	 *
	 * Once the web worker sends back a response as a postMessage we terminate
	 * the worker and create create an ImageData object to send the predefined
	 * final function.
	 * 
	 * @param  {ArrayBuffer} fileData      All of the contents of the selected
	 *                                     file.
	 * @param  {function} 	 finalFunction The final function to call when the 
	 *                                     web worker has generated the image.
	 * @param  {string} 	 fileName      The name of the selected file.
	 */
	var _generate = function(fileData, finalFunction, fileName)
	{
		if (fileName === undefined)
		{
			fileName = "file.txt";
		}
		var header = _createHeader({
			type: _generate.DATA_MAP_TYPE, 
			base: _constants.GENERATE_BASE,
			encryption: _constants.NO_ENCRYPTION,
			extension: fileName,
			size: fileData.length
		});		
		
		var dataSize = parseInt(Math.ceil(Math.sqrt((fileData.length + header.getHeaderLength())/3)));

		var stegoWorker = new Worker('/js/stegonagraphy/workers/_generateWorker.js');
		stegoWorker.postMessage({
			fileData: fileData, 
			headerData: header.getData(), 
			headerLength: header.getHeaderLength(),
			dataSize: dataSize
		});

		stegoWorker.onmessage = function(event) {
			this.terminate();
			finalFunction(new ImageData(event.data.context, dataSize, dataSize));
		}
		return;
	};

	/**
	 * Goes to encode data inside an image based off of the users given
	 * imageSource and the fileValue that was read in. Once the file has been
	 * encoded into the image properly then the finalFunction defined is
	 * called.
	 *
	 * First the image source is read as a data URL, and placed inside of the
	 * canvas by first setting up the canvas based off of the width and height,
	 * getting the 2 dimensional context, and then drawing the image on to the
	 * context.
	 *
	 * Then the fileData is transformed to the proper base by checking what the
	 * lowest base is for the file to still fit inside of the image. The size
	 * data is the width * height * 3 (the file data is stored in the RGB 
	 * values of each pixel). 
	 *
	 * Once the file data is transformed the header is generated for the
	 * correct encoding properties. 
	 *
	 * A Web Worker is then created to encode the data into the image, the
	 * function then sends the  web worker a postMessage with all of the 
	 * necessary data to encode the file into the image. Once the web worker
	 * is finished it send back the context of the encoded image and the final
	 * function is called with the newly created ImageData object.
	 * 
	 * @param  {string} 	 imageSource   The location of the image.
	 * @param  {ArrayBuffer} fileValue     All of the contents of the selected
	 *                                     file.
	 * @param  {string} 	 fileName      The name of the selected file.
	 * @param  {function} 	 finalFunction The final function to call when the 
	 *                                     web worker has generated the image.
	 */
	var _encode = function(imageSource, fileValue, fileName, finalFunction)
	{
		var reader = new FileReader();
		reader.onload = function (e) {
			var img = new Image();
			img.onload = function() {
				document.getElementById('stegoCanvas').width = img.width;
				document.getElementById('stegoCanvas').height = img.height;
				var context = document.getElementById('stegoCanvas').getContext('2d');

				context.drawImage(img, 0, 0);

				// setup header
				var sizeData = fileValue.length;
				var sizeStorage = img.width * img.height * 3;

				var base = 0;
				var b = 2;
				while(base == 0)
				{
					if(sizeData * Transformations.baseNByteLength(b) < sizeStorage)
					{
						base = b;
					}
					
					if(b > 16)
					{
						console.log("too large");
						return;
					}
							
					b++;
				}
				fileData = _transformDataToBaseN({
					base: base,
					fileData: fileValue
				});

				var header = _createHeader({
					type: _constants.BASE_N_TYPE,
					base: base,
					encryption: _constants.NO_ENCRYPTION,
					extension: fileName,
					size: fileData.length
				});

				stegoWorker = new Worker('/js/stegonagraphy/workers/_encodeWorker.js');

				stegoWorker.postMessage({
					fileData: fileData,
					context: context.getImageData(0, 0, img.width, img.height).data,
					headerBase: header.getHeaderBase(),
					headerLength: header.getHeaderLength(),
					headerData: header.getData(),
					dataBase: base,
					imageWidth: img.width,
					imageHeight: img.height
				});

				stegoWorker.onmessage = function(event) {
					this.terminate();
					finalFunction(new ImageData(event.data.context, img.width, img.height));
				}
			}
			img.src = reader.result;
		}
		reader.readAsDataURL(imageSource);
	};

	/**
	 * Decodes an image from the given image source and calls the final 
	 * function given once the data has been decoded from the file.
	 *
	 * First the function goes to read the image as a data URL, and then place
	 * the image inside of the canvas. The context is then read from the canvas
	 * as an imageData object and sent to the Web Worker for decoding along
	 * with information about the header such as the default data, base, 
	 * length, encode position and encode length.
	 *
	 * Once the Web Worker is finished it send the file data inside of the 
	 * image back with the header data. The function then decodes the file data
	 * based off of the encode base stored in the header, and then calls the
	 * final function with the file data in the proper encode type.
	 * 
	 * @param  {string}   imageSource   The source of the image (file 
	 *                                  location).
	 * @param  {function} finalFunction The final function to be called when
	 *                                  the file data has been decoded.
	 */
	var _decode = function(imageSource, finalFunction) 
	{
		var reader = new FileReader();

		reader.onload = function (e) {	
			var img = new Image();

			img.onload = function() {
				document.getElementById('stegoCanvas').width = img.width;
				document.getElementById('stegoCanvas').height = img.height;
				var context = document.getElementById('stegoCanvas').getContext('2d');

				context.drawImage(img, 0, 0);

				var header = new Header(HEADER_CONSTANTS.HEADER_INIT);

				var stegoWorker = new Worker('/js/stegonagraphy/workers/_decodeWorker.js');

				stegoWorker.postMessage({
					width: img.width,
					height: img.height,
					context: context.getImageData(0, 0, img.width, img.height).data,
					headerData: header.getData(),
					headerBase: header.getHeaderBase(),
					headerLength: header.getHeaderLength(),
					headerEncodePosition: header.encodeSize.getPosition(),
					headerEncodeLength: header.encodeSize.getLength()
				});

				stegoWorker.onmessage = function(event) {
					this.terminate();
					header.setHeaderDataFully(event.data.headerData);
					var fileData = event.data.fileData;

					if(header.encodeType.getEncodeType() == _constants.BASE_N_TYPE)
					{
						fileData = _decodeBaseN({
							header: header, 
							fileData: fileData
						});
					}

					finalFunction(fileData, header.fileExtension.getFileExtension());
				};

			}

			img.src = reader.result;
		}

		reader.readAsDataURL(imageSource);
	}

	/**
	 * Generates a header based off of the specified options given. If any of 
	 * the options have not been defined then the default parameters are set to
	 * assume that of a generated image, that is the base is set to a generate
	 * base, and the type is set to that of a data map type.
	 * 
	 * @param  {Object} options 		   The values for creating a header.
	 * @param  {int}    options.type 	   The type of image that is going to 
	 *                                     be created or read.
	 * @param  {int}    options.base 	   The base of the data to be stored 
	 *                                     in the image.
	 * @param  {int}    options.encryption If the data is encrypted or not.
	 * @param  {string} options.extension  The name of the file.
	 * @param  {int}    options.size 	   The size of the file data.
	 * @return {Header}         		   A new header defining the image that
	 *                                 	   will either be read or generated.
	 */
	var _createHeader = function(options) 
	{
		var options = options || {};
		options.type = options.hasOwnProperty('type') ? options.type : _constants.DATA_MAP_TYPE;
		options.base = options.hasOwnProperty('base') ? options.base : _constants.GENERATE_BASE;
		options.encryption = options.hasOwnProperty('encryption') ? options.encryption : _constants.NO_ENCRYPTION;
		options.extension = options.hasOwnProperty('extension') ? options.extension : _constants.DEFAULT_EXTENSION;
		options.size == options.hasOwnProperty('size') ? options.size : _constants.DEFAULT_SIZE;

		var header = new Header(HEADER_CONSTANTS.HEADER_INIT);

		//set encode type
		header.encodeType.setEncodeType(options.type);
		
		//set encode base
		header.encodeBase.setEncodeBase(options.base);
		
		//set boolean isEncrypted
		header.encodeEncryption.setEncodeEncryption(options.encryption);
		
		//set file extension
		header.fileExtension.setFileExtension(options.extension);
		
		//set data length
		header.encodeSize.setEncodeSize(options.size);

		return header;
	};


	/**
	 * Transforms the fileData's individual value over to the defined base and
	 * goes to change the 
	 *
	 * @param  {Object} options 		   The values for creating a header.
	 * @param  {int}    options.base 	   The base the the file data needs to
	 *                                     be transformed to.
	 * @param  {Array}  options.fileData   The file data as an array of
	 *                                     integers.
	 * @return {Array}  				   The file data  transformed into the 
	 *                             		   specified base.
	 */
	var _transformDataToBaseN = function(options)
	{
		var options = options || {};
		options.base = options.hasOwnProperty('base') ? options.base : _constants.GENERATE_BASE;
		options.fileData = options.hasOwnProperty('fileData') ? options.fileData : [];

		var convertedFileData = [];
		var tempList = [];
		var byteLength = Transformations.baseNByteLength(options.base);
		for(var i = 0; i < options.fileData.length; i++)
		{
			var numberToBeChanged = options.fileData[i].charCodeAt(0);
			for(var j = 0; j < byteLength; j++)
			{
				tempList.push(numberToBeChanged%options.base);
				numberToBeChanged = parseInt(Math.floor(numberToBeChanged/options.base));
			}
			
			for(var k = tempList.length - 1; k >= 0; k--)
			{
				convertedFileData.push(tempList[k]);
			}
			tempList = [];
		}
		return convertedFileData; 
	};


	/**
	 * Goes and decodes the file data based off of the base stored in the
	 * Header.
	 * 
	 * @param  {Object} options 		   The values decoding the data.
	 * @param  {int}    options.header 	   The Header object containing all
	 *                                     information about the file data.
	 * @param  {Array}  options.fileData   The file data as an array of
	 *                                     integers.
	 * @return {Array} 					   The decoded file data.
	 */
	var _decodeBaseN = function(options)
	{
		var options = options || {};
		options.header = options.hasOwnProperty('header') ? options.header : new Header(HEADER_CONSTANTS.HEADER_INIT);
		options.fileData = options.hasOwnProperty('fileData') ? options.fileData : [];

		var base = options.header.encodeBase.getEncodeBase();

		for(var i = 0; i < options.fileData.length; i++)
		{
			options.fileData[i] =  options.fileData[i]%base;
		}

		return _transformDataFromBaseN({
			base: base, 
			fileData: options.fileData
		});
	}

	/**
	 * Transforms the given data from the initial base of the data.
	 * 
	 * @param  {Object} options 		 The values for tranforming the data 
	 *                             		 from a base.
	 * @param  {int} 	options.base 	 The base of the current file data.
	 * @param  {Array}  options.fileData The file data encoded in the certain
	 *                                   base.
	 * @return {Array}         			 The transformed file data.
	 */
	var _transformDataFromBaseN = function(options)
	{
		var options = options || {};
		options.base = options.hasOwnProperty('base') ? options.base : _constants.GENRATE_BASE;
		options.fileData = options.hasOwnProperty('fileData') ? options.fileData : [];


		var tempData = [];
		var byteLength = Transformations.baseNByteLength(options.base);
		var tempInt = 0;
		for(var i = 0; i < options.fileData.length; i++)
		{
			tempInt = tempInt * options.base;
			tempInt = tempInt + options.fileData[i];
			if(i % byteLength == byteLength - 1)
			{
				tempData.push(tempInt);
				tempInt = 0;
			}
		}
		return tempData;
	}


	return {
		generate: _generate,
		encode: _encode,
		decode: _decode
	};

})();