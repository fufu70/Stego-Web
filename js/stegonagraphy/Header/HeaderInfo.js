var HeaderInfo = function(position, length, header) 
{
	this.myPosition = position;
	this.myLength = length;
	this.myHeader = header;
};

HeaderInfo.prototype.getPosition = function()
{
	return this.myPosition;
};

HeaderInfo.prototype.getLength = function()
{
	return this.myLength;
};

HeaderInfo.prototype.setData = function(data)
{
	if(data.length != this.myLength)
	{
		console.log("- incorrect data length");
	}
	else
	{
		for(var i = 0; i < this.myLength; i++)
		{
			this.myHeader.setDataFromPosition(this.myPosition + i, data[i]);
		}
	}
	return this.myPosition;
};

HeaderInfo.prototype.getData = function()
{
	var data = new Array(this.myLength);
	for (var i = 0; i < this.myLength; i ++)
	{
		data[i] = this.myHeader.getHeaderData(this.myPosition + i);
	}
	return data;
}