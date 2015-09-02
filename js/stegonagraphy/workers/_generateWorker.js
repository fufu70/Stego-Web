
generate =  function(fileData, headerData, headerLength, dataSize) {

	// our counter for our data (its only in rgb value)
	var p = 0;
	var x = 0;
	var y = 0;
	var i = 0;
	// counter for each individual pixel finished
	var pixel = 0;
	// index in relation to the data map for the current two dimensional array
	var index = 0;
	var contextSize = dataSize * dataSize * 4;
	var buffer = new ArrayBuffer(contextSize);
	var contextArray = new Uint8ClampedArray(buffer);


	var floor = Math.floor;
	var random = Math.random;

	for (i = 0; i < contextSize; i ++)
	{
		x = floor(pixel / dataSize);
		y = pixel % dataSize;
		index = (y * dataSize * 4) + (x * 4) + (i % 4);

		if (i % 4 === 3)
		{
			contextArray[index] = 255;
			pixel ++;
		}
		else if(p < headerLength)
		{
			contextArray[index] = headerData[p];
			p ++;
		}
		else if(p >= fileData.length + headerLength)
		{
			contextArray[index] = floor((random() * 256));
			p ++;
		}
		else
		{
			contextArray[index] = fileData[p - headerLength].charCodeAt(0);
			p ++;
		}
	}

	postMessage({context: contextArray});
	return;
};

onmessage = function(event) {
	generate(
		event.data.fileData, 
		event.data.headerData, 
		event.data.headerLength, 
		event.data.dataSize
	);
}