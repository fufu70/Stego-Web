<?php

/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 *
 * @author   <jsalis@stetson.edu>
 * @since 	 v0.0.0
 * 
 */
class Controller extends CController
{
	/**
	 * The default beforeAction redirects to the doorkeeper controller
	 * if the user is not logged in. Any subclass of Controller 
	 * (except DoorKeeperController) that overrides this function 
	 * should call this one first.
	 * 
	 * @param  Action   $action Represents the action to be called.
	 * @return boolean          Whether the action should be called.
	 */
	protected function beforeAction($action)
	{
		return true;
	}
}
