
hideData = function(fileData, context, headerBase, headerLength, headerData, dataBase, imageWidth, imageHeight) {
	var p = 0;
	var current;
	var width = imageWidth;
	var height = imageHeight;
	var RGBSize = 3;
	var fileDataLength = fileData.length;

	// keep track of functions
	var floor = Math.floor;
	var random = Math.random;

	var i;
	var j;
	var k;

	var point = 0;


	for(i = 0; i < width; i ++)
	{
		for(j = 0; j < height; j++)
		{
			point = (j * width * 4) + (i * 4);
			for(k = 0; k < RGBSize; k++)
			{
				current = context[point];
				if(current + dataBase > 255)
				{
					current = current - dataBase;
				}
				if(p < headerLength)
				{
					current = current - current%headerBase + headerData[p];
				}
				else if(p >= fileDataLength + headerLength)
				{
					current = current - current%dataBase + floor((random() * dataBase));
				}
				else
				{
					current = current - current%dataBase + fileData[p - headerLength];
				}
				context[point] = current;
				p++;
				point ++;
			}
			context[point] = 255;
		}
	}

	postMessage({context: context});
	return;
}

onmessage = function(event) {
	hideData(
		event.data.fileData,
		event.data.context,
		event.data.headerBase,
		event.data.headerLength,
		event.data.headerData,
		event.data.dataBase,
		event.data.imageWidth,
		event.data.imageHeight
	);
}