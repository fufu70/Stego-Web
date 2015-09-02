EncodeEncryption.prototype = Object.create(HeaderInfo.prototype)

EncodeEncryption.prototype.constructor = EncodeEncryption;

function EncodeEncryption(position, length, header)
{
	HeaderInfo.call(this, position, length, header);
}

EncodeEncryption.prototype.setEncodeEncryption = function(isEncrypted)
{
	var data = new Array(this.myLength);
	if(isEncrypted)
	{
		data[0] = 1;
	}
	else
	{
		data[0] = 0;
	}
	this.setData(data);
}

EncodeEncryption.prototype.getEncodeEncryption = function()
{
	var data = this.getData();
	if(data[0] == 1)
	{
		return true;
	}
	else if(data[0] == 0)
	{
		return false;
	}
	else
	{
		console.log("Encryption boolean invalid");
		return false;
	}
}