EncodeType.prototype = Object.create(HeaderInfo.prototype)

EncodeType.prototype.constructor = EncodeType;

function EncodeType(position, length, header)
{
	HeaderInfo.call(this, position, length, header);
}

EncodeType.prototype.setEncodeType = function(encodeType)
{
	var data = new Array(this.myLength);
			
	data[0] = encodeType;
	this.setData(data);
}

EncodeType.prototype.getEncodeType = function()
{
	var data = this.getData();
	return data[0];
}