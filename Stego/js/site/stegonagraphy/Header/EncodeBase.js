EncodeBase.prototype = Object.create(HeaderInfo.prototype)

EncodeBase.prototype.constructor = EncodeBase;

function EncodeBase(position, length, header)
{
	HeaderInfo.call(this, position, length, header);
}

EncodeBase.prototype.setEncodeBase = function(base)
{
	var data = Transformations.intBase10ToBaseN(this.myHeader.getHeaderBase(), this.myLength, base);
			
	this.setData(data);
}

EncodeBase.prototype.getEncodeBase = function()
{
	var base = Transformations.intBaseNToBase10(this.myHeader.getHeaderBase(), this.getData());
	
	if(base < 2 || (base > 16 && base != 256))
	{
		console.log("Incorrect encode base - " + base);
	}
	
	return base;
}