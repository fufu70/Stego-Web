importScripts('/js/stegonagraphy/Transformations.js');

setDataFromPosition = function(pos, data, headerData, headerBase)
{
	if (data >= headerBase)
	{
		console.log("incorrect data");
	}
	headerData[pos] = data;
	return headerData;
}

getEncodeSizeData = function(headerData, headerEncodePosition, headerEncodeLength)
{
	var data = new Array(headerEncodeLength);
	for (var i = 0; i < headerEncodeLength; i ++)
	{
		data[i] = headerData[headerEncodePosition + i];
	}
	return data;
}

pullData = function(width, height, context, headerData, headerBase, headerLength, headerEncodePosition, headerEncodeLength)
{
	var buffer;
	var fileData;
	var p = 0;
	var encodeSize = 0;
	var point = 0;

	var i = 0;
	var j = 0;
	var k = 0;

	for(i = 0; i < width; i ++)
	{
		for(j = 0; j < height; j++)
		{
			point = (j * width * 4) + (i * 4);
			for(k = 0; k < 3; k++)
			{
				if(p < headerLength)
				{
					headerData = setDataFromPosition(p, context[point] % headerBase, headerData, headerBase);
					encodeSize = Transformations.intBaseNToBase10(headerBase, getEncodeSizeData(headerData, headerEncodePosition, headerEncodeLength));
				}
				else if(p < encodeSize + headerLength)
				{
					if (p - headerLength === 0)
					{
						fileData = new Uint8Array(encodeSize);
					}
					fileData[p - headerLength] = context[point];
				}
				else
				{
					break;
				}

				p++;
				point ++;
			}
		}
	}

	postMessage({fileData: fileData, headerData: headerData});
	return;
}

onmessage = function(event) 
{
	pullData(
		event.data.width,
		event.data.height,
		event.data.context,
		event.data.headerData,
		event.data.headerBase,
		event.data.headerLength,
		event.data.headerEncodePosition,
		event.data.headerEncodeLength
	);
}

