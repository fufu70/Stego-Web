FileExtension.prototype = Object.create(HeaderInfo.prototype)

FileExtension.prototype.constructor = FileExtension;

function FileExtension(position, length, header)
{
	HeaderInfo.call(this, position, length, header);
}

FileExtension.prototype.setFileExtension = function(fileName)
{
	var data = new Array(this.myLength);
	var numChars = this.myLength / Transformations.baseNByteLength(this.myHeader.getHeaderBase());
	var tempData = [];
	var c;
	var chr = 'a';
	for(var i = 0; i < numChars; i++)
	{
		c = fileName.charAt(fileName.length - numChars + i);
		if(c == '/')
		{
			tempData = Transformations.byteToBaseN(this.myHeader.getHeaderBase(), chr.charCodeAt(0));
		}
		else
		{
			tempData = Transformations.byteToBaseN(this.myHeader.getHeaderBase(), c.charCodeAt(0));
		}
		
		for(var j = 0; j < tempData.length; j++)
		{
			data[i * tempData.length + j] = tempData[j];
			
		}
	}
	
	this.setData(data);
}

FileExtension.prototype.getFileExtension = function()
{
	var fileExt = "";
	var charLength = Transformations.baseNByteLength(this.myHeader.getHeaderBase());
	var data = this.getData();
	var tempData = new Array(charLength);
	
	for(var i = 0; i < this.myLength/charLength; i++)
	{
		for(var j = 0; j < charLength; j++)
		{
			tempData[j] = data[i * charLength + j];
		}
		fileExt = fileExt + String.fromCharCode(Transformations.intBaseNToBase10(this.myHeader.getHeaderBase(), tempData));
	}
	
	return fileExt;
}