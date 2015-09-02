function Transformations() {};

Transformations.byteToBaseN = function(base, data)
{
	if(base < 2)
	{
		console.log("byteToBaseN base too small error");
	}
	
	var length = Transformations.baseNByteLength(base);
	var transformedData = new Array(length);
	
	var numberToBeChanged = data;
	for(var i = length - 1; i >= 0 ; i--)
	{
		transformedData[i] = numberToBeChanged%base;
		numberToBeChanged = parseInt(Math.floor(numberToBeChanged/base));
	}
	
	return transformedData;
}

Transformations.baseNByteLength = function(base)
{
	if(base == 2)
	{
		return 8;
	}
	else if(base == 3)
	{
		return 6;
	}
	else if(base == 4 || base == 5 || base == 6)
	{
		return 4;
	}
	else if(base >= 7 && base <= 15)
	{
		return 3;
	}
	else if(base == 16)
	{
		return 2;
	}
	else if(base > 16)
	{
		return 1;
	}
	
	return 0;	
};

Transformations.intBase10ToBaseN = function(base, length, data)
{
	if(base < 2)
	{
		console.log("intBase10ToBaseN base too small error");
	}
	
	var transformedData = new Array(length);
	
	var numberToBeChanged = data;

	for(var i = length - 1; i >= 0 ; i--)
	{
		transformedData[i] = numberToBeChanged%base;
		numberToBeChanged = parseInt(Math.floor(numberToBeChanged/base));
	}
	
	if(transformedData[length - 1] >= base)
	{
		console.log("intBase10ToBaseN size mismatch error");
	}
	
	return transformedData;
};

Transformations.intBaseNToBase10 = function(base, data)
{
	if(base < 2)
	{
		console.log("intBaseNToBase10 base too small error");
	}
	
	var temp = 0;
	
	for(var i = 0; i < data.length; i++)
	{
		temp = temp * base;
		temp = temp + data[i];
	}
	
	return temp;
}