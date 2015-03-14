<!-- Fixed navbar -->
<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
	<div class="container">

		<div class="navbar-header">
            <!-- If screen size is too small for the entire navbar, condense it -->
			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button> <!-- /navbar-toggle -->
			<span class="navbar-brand"><a href="/index.php/business/index"><?php echo Yii::app()->name; ?></a></span>
		</div> <!-- /navbar-header -->

		<div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
            </ul> <!-- /.nav .navbar-nav .navbar-right -->
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown"><strong> <i class="fa fa-cog"></i> </strong><b class="caret"></b></a>
					<ul class="dropdown-menu">
						<li><a data-toggle="modal" data-target="#encode_stego"><i class="fa fa-plus-square"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Encode</a></li>
						<li><a data-toggle="modal" data-target="#decode_stego"><i class="fa fa-filter"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Decode</a></li>
						<li><a data-toggle="modal" data-target="#generate_stego"><i class="fa fa-qrcode"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Generate</a></li>
						<li><a id="logoutButton"><i class="fa fa-sign-out"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Log Out</a></li>
					</ul> <!-- /.dropdown-menu -->
				</li> <!-- /.dropdown -->
            </ul> <!-- /.nav .navbar-nav .navbar-right -->
		</div> <!-- /.navbar-collapse -->

	</div> <!-- /.container -->
</nav> <!-- /.navbar -->

<script type="text/javascript">
	$('#logoutButton').click(function() {
		logoutUser();
	});
</script>