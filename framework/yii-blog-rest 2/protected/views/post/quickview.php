<!DOCTYPE html>
<html lang="en">
	<head>
		<!-- Meta tags -->
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content>
		<meta name="author" content>
		
		<!-- Title -->
		<title>Full Calendar Preview</title>

		<!-- Latest compiled and minified Bootstrap CSS CDN graciously provided by NetDNA -->
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css">
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-theme.min.css">

		<!-- Calendar -->
		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/fullcalendar/1.6.4/fullcalendar.css">
		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/fullcalendar/1.6.4/fullcalendar.print.css">
	</head>

	<body>
		<!-- Fixed navbar -->
		<div class="navbar navbar-default navbar-fixed-top">
			<div class="container">
				<div class="navbar-header">
					<!-- If screen size is too small for the entire navbar, condense it -->
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button> <!-- /navbar-toggle -->
					<a class="navbar-brand" href="./index.php">Xeres</a>
				</div> <!-- /navbar-header -->
				<div class="navbar-collapse collapse">
					<ul class="nav navbar-nav">
						<li class="active"><a href="#">Quick View</a></li>
						<li class=""><a href="#">Reservation</a></li>
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">Reports <b class="caret"></b></a>
							<!-- TODO: Need to take reports that require a specific item to be selected in order to generate.
						 	           Ultimately, we will migrate this to a side-bar nav (more than likely, though this is still TBA)
								   on a specific items page. E.g. 'Current Status'
							-->
							<ul class="dropdown-menu">
								<li class="dropdown-header">Total</li>
								<li><a href="#">Total Reservation Items</a></li>
								<li><a href="#">Total Reservation</a></li>

								<li class="dropdown-header">Items</li>
								<li><a href="#">Items by Type</a></li>
								<li><a href="#">Items by Number</a></li>
								<li><a href="#">Items by Person</a></li>

								<li class="dropdown-header">Misc</li>
								<li><a href="#">Reservation # with Delivery & Setup</a></li>
								<li><a href="#">Status Type</a></li>
								<li><a href="#">Current Status</a></li>
								<li><a href="#">Overdue Items</a></li>
							</ul> <!-- /dropdown-menu -->
						</li> <!-- /dropdown -->
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">Add <b class="caret"></b></a>
							<ul class="dropdown-menu">
								<li><a href="#">Person</a></li>
								<li><a href="#">Equipment</a></li>
								<li><a href="#">Location</a></li>
							</ul> <!-- /dropdown-menu -->
						</li> <!-- /dropdown -->
					</ul> <!-- /nav navbar-nav -->
				</div> <!-- /navbar-collapse -->
			</div> <!-- /container -->
		</div> <!-- /navbar -->
		<div class="container">
			<div class="row" style="margin-top:30px">
				<div id='calendar' style='margin:3em 0;font-size:13px' class="fc fc-ltr"></div>
			</div>
		</div> <!-- /container -->
	</body>

	<!-- JavaScript at the end of the file to improve loading times -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>              <!-- Google's jQuery CDN -->
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>        <!-- Google's jQuery UI CDN-->
	<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>           <!-- NetDNA's Bootstrap 3.0.0 CDN-->
	<script src="//cdnjs.cloudflare.com/ajax/libs/fullcalendar/1.6.4/fullcalendar.min.js"></script> <!-- CDNJS's Full-Calendar jQuery Plugin CDN -->

	<script type="text/javascript">
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();

	// Initialize the full-calendar jQuery plugin
	$('#calendar').fullCalendar({

		// This sets up the calendar header
		header: {
			left: 'prev,next,today', // Date navigation buttons:  [ < ][ > ][ today ]
			center: 'title', // Title goes in the center
			right: 'month,agendaWeek,agendaDay' // Different display modes: [ Month ][ Week ][ Day ]
		},

		// Enables drag & drop if jQuery UI is linked to.
		editable: true,

		// Some sample events to play around with.
		events: [
			{
				// Events are all day if no end date is specified
				title: 'All Day Event',
				start: new Date(y, m, 1)
			},
			{
				title: 'Long Event',
				start: new Date(y, m, d-5),
				end: new Date(y, m, d-2)
			}
		]
	});
        </script>
</html>
