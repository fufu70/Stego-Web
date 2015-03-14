HEADER_CONSTANTS = Object.freeze({
	HEADER_INIT:  Object.freeze([4, 1, 4, 1, 8, 12]),
	HEADERBASE_INDEX: 0,
	ENC_TYPE_LENGTH_INDEX: 1,
	ENC_BASE_LENGTH_INDEX: 2,
	ENC_ENCRYPT_LENGTH_INDEX: 3,
	FILE_EXTENSION_CHAR_LENGTH_INDEX: 4,
	ENC_SIZE_LENGTH_INDEX: 5,
});

var Header = function(headerInit) 
{
	this.myHeaderBase = headerInit[HEADER_CONSTANTS.HEADERBASE_INDEX];
	var fileExtensionLength = headerInit[HEADER_CONSTANTS.FILE_EXTENSION_CHAR_LENGTH_INDEX] * Transformations.baseNByteLength(this.myHeaderBase);
	this.myHeaderLength = headerInit[HEADER_CONSTANTS.ENC_TYPE_LENGTH_INDEX] 
							+ headerInit[HEADER_CONSTANTS.ENC_BASE_LENGTH_INDEX] 
							+ headerInit[HEADER_CONSTANTS.ENC_ENCRYPT_LENGTH_INDEX] 
							+ fileExtensionLength + headerInit[HEADER_CONSTANTS.ENC_SIZE_LENGTH_INDEX];
	this.myHeaderData = new Array(this.myHeaderLength);

	this.encodeType = new EncodeType(0, headerInit[HEADER_CONSTANTS.ENC_TYPE_LENGTH_INDEX], this);
	this.encodeBase = new EncodeBase(this.encodeType.getPosition() + this.encodeType.getLength(), headerInit[HEADER_CONSTANTS.ENC_BASE_LENGTH_INDEX], this);
	this.encodeEncryption = new EncodeEncryption(this.encodeBase.getPosition() + this.encodeBase.getLength(), headerInit[HEADER_CONSTANTS.ENC_ENCRYPT_LENGTH_INDEX], this);
	this.fileExtension = new FileExtension(this.encodeEncryption.getPosition() + this.encodeEncryption.getLength(), fileExtensionLength, this);
	this.encodeSize = new EncodeSize(this.fileExtension.getPosition() + this.fileExtension.getLength(), headerInit[HEADER_CONSTANTS.ENC_SIZE_LENGTH_INDEX], this);
};

Header.prototype.getHeaderLength = function()
{
	return this.myHeaderLength;
}

Header.prototype.setHeaderData = function(pos, val)
{
	this.myHeaderData[pos] = val;
}

Header.prototype.getHeaderData = function(pos)
{
	return this.myHeaderData[pos];
}
Header.prototype.getHeaderBase = function()
{
	return this.myHeaderBase;
}

Header.prototype.setDataFromArray = function(data)
{
	if(data.length != myHeaderLength)
	{
		console.log("Header.EncodeType.setData() - incorrect data length");
	}
	else
	{
		for(var i = 0; i < this.myHeaderLength; i++)
		{
			this.myHeaderData[i] = data[i];
		}
	}
}
	
Header.prototype.setDataFromPosition = function(pos, data)
{	
	if(data >= this.myHeaderBase)
	{
		console.log("incorrect data");
	}
	this.myHeaderData[pos] = data;
}

Header.prototype.getData = function()
{
	return this.myHeaderData;
}

Header.prototype.reset = function()
{
	for (var i = 0; i < this.myHeaderData.length; i ++)
	{
		this.myHeaderData[i] = 0;
	}
}
