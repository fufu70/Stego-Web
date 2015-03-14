<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.

return array(
	'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',

	'name' => 'Stego',

	// preloading 'log' component
	'preload' => array('log'),

	// autoloading model and component classes
	'import' => array(
		'application.models.*',
		'application.components.*',
		'application.controllers.*',
		'ext.giix-components.*',
	),

	'defaultController' => 'site',

	// application components
	'components' => array(		
        'urlManager' => array(
        	'class' => 'UrlManager',
        	'urlFormat' => 'path',
        	'rules' => array(
	            // REST patterns
	            array('api/list', 'pattern' => 'api/<model:\w+>', 'verb' => 'GET'),
	            array('api/view', 'pattern' => 'api/<model:\w+>/<id:\d+>', 'verb' => 'GET'),
	            array('api/update', 'pattern' => 'api/<model:\w+>/<id:\d+>', 'verb' => 'PUT'),  // Update
	            array('api/delete', 'pattern' => 'api/<model:\w+>/<id:\d+>', 'verb' => 'DELETE'),
	            array('api/create', 'pattern' => 'api/<model:\w+>', 'verb' => 'POST'), // Create
	            '<controller:[\w\-]+>/<action:[\w\-]+>' => '<controller>/<action>',
        	),
        ),
		'errorHandler' => array(
			'errorAction' => 'doorkeeper/error',
		),
		'log' => array(
			'class' => 'CLogRouter',
			'routes' => array(
				array(
					'class' => 'CFileLogRoute',
					'levels' => 'error, warning',
				),
			),
		),
		'hash' => array('class' => 'PBKDF2Hash'),
	),

	// application-level parameters that can be accessed using Yii::app()->params['paramName']
	'params' => require (dirname(__FILE__) . '/params.php'),
	
	'controllerMap' => array(
		'site' => 'application.controllers.SiteController',
	),
);
