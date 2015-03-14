var DATA_MAP = 0;
var BASE_N = 1;
var MAIN_COLOR_MAP = [];


function createImage(fileData)
{
	var myHeader = new Header(HEADER_CONSTANTS.HEADER_INIT);
	return createDataMap(fileData, myHeader);
}

function createDataMap(fileData, header)
{	
	//set encode type
	header.encodeType.setEncodeType(DATA_MAP);
	
	//set encode base
	header.encodeBase.setEncodeBase(256);
	
	//set boolean isEncrypted
	header.encodeEncryption.setEncodeEncryption(0);
	
	//set file extension
	header.fileExtension.setFileExtension("hello.txt");
	
	//set data length
	header.encodeSize.setEncodeSize(fileData.length);
	
	
	//----------------------------------------------------------------------------
	//compress data goes here
	//----------------------------------------------------------------------------
	
	
	var x = parseInt(Math.ceil(Math.sqrt((fileData.length + header.getHeaderLength())/3)));
	var colorMap = new Array(x);
	var headerData = header.getData();
	
	var p = 0;
	for(var i = 0; i < x; i ++)
	{
		var l = new Array(x);
		for(var j = 0; j < x; j++)
		{
			var s = new Array(3);
			for(var k = 0; k < 3; k++)
			{
				if(p < header.getHeaderLength())
				{
					s[k] = headerData[p];
				}
				else if(p >= fileData.length + header.getHeaderLength())
				{
					s[k] = Math.floor((Math.random() * 256));
				}
				else
				{
					s[k] = fileData[p - header.getHeaderLength()].charCodeAt(0);

					console.log(s[k]);
				}
				p++;
			}
			l[j] = s;
		}
		colorMap[i] = l;

	}
	
	return colorMap;
}

function hideInImage(imageSource, text)
{
	var reader = new FileReader();
	text = text + " ";
    reader.onload = function (e) {
        var img = new Image();
        img.src = e.target.result;

        document.getElementById('myCanvasDecode').width = img.width;
        document.getElementById('myCanvasDecode').height = img.height;
        var context = document.getElementById('myCanvasDecode').getContext('2d');

		context.drawImage(img, 0, 0);

		var colorMap = new Array(img.width);
		for (var i = 0; i < img.width; i ++)
		{
			var l = new Array(img.height);
			for (var j = 0; j < img.height; j ++)
			{
				var m = new Array(3);
		        var data = context.getImageData(i, j, 1, 1).data;
				for (var k = 0; k < 3; k ++)
				{
					m[k] = data[k];
				}
				l[j] = m;
			}
			colorMap[i] = l;
		}
		var myHeader = new Header(HEADER_CONSTANTS.HEADER_INIT);
		hideInColorMap(colorMap, myHeader, text);
    }

    reader.readAsDataURL(imageSource);
}

function hideInColorMap(colorMap, myHeader, text)
{
	var sizeData = text.length;
	var sizeStorage = colorMap.length * colorMap[0].length * colorMap[0][0].length;
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
			console.log("file too large");
		}
				
		b++;
	}
	fileData = transformDataToBaseN(base, text);
	console.log(fileData);

	//set encode type
	myHeader.encodeType.setEncodeType(BASE_N);
			
	//set encode base
	myHeader.encodeBase.setEncodeBase(base);
		
	//set boolean isEncrypted
	myHeader.encodeEncryption.setEncodeEncryption(0);
			
	//set file extension
	myHeader.fileExtension.setFileExtension('image.txt');
			
	//set data length
	myHeader.encodeSize.setEncodeSize(fileData.length);
	
	var header = myHeader.getData();

	var p = 0;
	var current;
	var headerBase = myHeader.getHeaderBase();
	for(var i = 0; i < colorMap.length; i ++)
	{
		for(var j = 0; j < colorMap[0].length; j++)
		{
			for(var k = 0; k < colorMap[0][0].length; k++)
			{
				current = colorMap[i][j][k];
				if(current + base > 255)
				{
					current = current - base;
				}
				if(p < myHeader.getHeaderLength())
				{
					colorMap[i][j][k] = current - current%headerBase + header[p];
				}
				else if(p >= fileData.length + myHeader.getHeaderLength())
				{
					colorMap[i][j][k] = current - current%base + Math.floor((Math.random() * base));
				}
				else
				{
					colorMap[i][j][k] = current - current%base + fileData[p - myHeader.getHeaderLength()];
				}
				p++;
			}
		}
	}
	document.getElementById('myCanvasEncode').width = colorMap.length;
    document.getElementById('myCanvasEncode').height = colorMap[0].length;
    
    var canvas = document.getElementById('myCanvasEncode');
    var context = canvas.getContext('2d');
    for (var i = 0; i < colorMap.length; i ++)
    {
        for (var j = 0; j < colorMap[0].length; j ++)
        {
            context.fillStyle = "rgba("+colorMap[i][j][0]+","+colorMap[i][j][1]+","+colorMap[i][j][2]+","+255+")";
            context.fillRect( i, j, 1, 1 );
        }
    }
    var dataURL = canvas.toDataURL();
    document.getElementById('canvasImgEncode').src = dataURL;
}

function transformDataToBaseN(base, fileData)
{
	console.log(fileData);
	var convertedFileData = [];
	var tempList = [];
	var byteLength = Transformations.baseNByteLength(base);
	for(var i = 0; i < fileData.length; i++)
	{
		var numberToBeChanged = fileData[i].charCodeAt(0);
		for(var j = 0; j < byteLength; j++)
		{
			tempList.push(numberToBeChanged%base);
			numberToBeChanged = parseInt(Math.floor(numberToBeChanged/base));
		}
		
		for(var k = tempList.length - 1; k >= 0; k--)
		{
			convertedFileData.push(tempList[k]);
		}
		tempList = [];
	}
	return convertedFileData; 
}

function pullFromImage(imageSource)
{
	var reader = new FileReader();

    reader.onload = function (e) {
        var img = new Image();
        img.src = e.target.result;

        document.getElementById('myCanvasDecode').width = img.width;
        document.getElementById('myCanvasDecode').height = img.height;
        var context = document.getElementById('myCanvasDecode').getContext('2d');

		context.drawImage(img, 0, 0);

		var colorMap = new Array(img.width);
		for (var i = 0; i < img.width; i ++)
		{
			var l = new Array(img.height);
			for (var j = 0; j < img.height; j ++)
			{
				var m = new Array(3);
		        var data = context.getImageData(i, j, 1, 1).data;
				for (var k = 0; k < 3; k ++)
				{
					m[k] = data[k];
				}
				l[j] = m;
			}
			colorMap[i] = l;
		}
		var myHeader = new Header(HEADER_CONSTANTS.HEADER_INIT);
		pullFromColorMap(colorMap, myHeader);
    }

    reader.readAsDataURL(imageSource);
}

function pullFromColorMap(colorMap, header)
{
	var p = 0;
	var headerBase = header.getHeaderBase();
	console.log(headerBase);
	var fileData = [];
	for(var i = 0; i < colorMap.length; i ++)
	{
		for(var j = 0; j < colorMap[0].length; j++)
		{
			for(var k = 0; k < colorMap[0][0].length; k++)
			{
				if(p < header.getHeaderLength())
				{
					header.setDataFromPosition(p, colorMap[i][j][k] % headerBase);
				}
				else if(p <= header.encodeSize.getEncodeSize() + header.getHeaderLength())
				{
					fileData.push(colorMap[i][j][k]);
				}
				else
				{
					break;
				}
				p++;
			}
		}
	}
	console.log(header.encodeType.getEncodeType());
	if(header.encodeType.getEncodeType() == DATA_MAP)
	{
		
	}
	else if(header.encodeType.getEncodeType() == BASE_N)
	{
		fileData = decodeBaseN(colorMap, header, fileData);
	}
	download(fileData, header.fileExtension.getFileExtension());
}

function download(fileData, filename) {
	var text = "";
	for (var i = 0; i < fileData.length - 1; i ++)
	{
		text += String.fromCharCode(fileData[i]);
	}

	var pom = document.createElement('a');
	pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	pom.setAttribute('download', filename);
	pom.click();
}

function decodeBaseN(colorMap, header, fileData)
{
	var base = header.encodeBase.getEncodeBase();
	for(var i = 0; i < fileData.length; i++)
	{
		fileData[i] =  fileData[i]%base;
	}
	return transformDataFromBaseN(base, fileData);
}

function transformDataFromBaseN(base, fileData)
	{
		var tempData = [];
		var byteLength = Transformations.baseNByteLength(base);
		var tempInt = 0;
		for(var i = 0; i < fileData.length; i++)
		{
			tempInt = tempInt * base;
			tempInt = tempInt + fileData[i];
			if(i % byteLength == byteLength - 1)
			{
				tempData.push(tempInt);
				tempInt = 0;
			}
		}
		return tempData;
	}