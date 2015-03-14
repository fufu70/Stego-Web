<?php

/**
 * The AdminController class is there to communicate the Yii framework, and
 * Restful API to the Admin class, this includes creating actions to all of the 
 * functions that an Admin may have.
 *
 * @author   <cmicklis@stetson.edu>, <jsalis@stetson.edu>
 * @since 	 v0.0.0
 */
class SiteController extends Controller
{
	const DEFAULT_LAYOUT = 'site-layout';

	public $layout = SiteController::DEFAULT_LAYOUT;


	public function actionIndex()
	{
		$this->render('/site/index');
	}
}
