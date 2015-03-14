<div style='padding-top: 55px; z-index: 1;' >
	<div class="panel panel-default col-lg-12 userImages">
	  	<div class="panel-body ">
	  	</div>
	</div>
</div>

<script type="text/javascript">
	function displayUserImages(images)
	{
		console.log(images);
		for (var i = 0; i < images.length; i ++)
		{
			var imageDiv = "<div class='col-lg-4'><img class='img-responsive' src='" + images[i].get('Image')._url + "'></div>";
			$('.userImages .panel-body').append(imageDiv);
		}
		$('.userImages').show();
	}
</script>