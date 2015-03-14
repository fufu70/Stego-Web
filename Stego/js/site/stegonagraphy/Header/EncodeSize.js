EncodeSize.prototype = Object.create(HeaderInfo.prototype)

EncodeSize.prototype.constructor = EncodeSize;

function EncodeSize(position, length, header)
{
	HeaderInfo.call(this, position, length, header);
}

EncodeSize.prototype.setEncodeSize = function(encSize)
{
	var data = Transformations.intBase10ToBaseN(this.myHeader.getHeaderBase(), this.myLength, encSize);
			
	this.setData(data);
}

EncodeSize.prototype.getEncodeSize = function()
{
	var size = Transformations.intBaseNToBase10(this.myHeader.getHeaderBase(), this.getData());
	
	return size;
}