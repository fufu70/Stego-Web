<?php

/**
 * UserIdentity represents the data needed to identity a user.
 * It contains the authentication method that checks if the provided
 * data can identity the user.
 */
class UserIdentity extends CUserIdentity
{
	/**
	 * Authenticates a user.
	 * The example implementation makes sure if the username and password
	 * are both 'demo'.
	 * In practical applications, this should be changed to authenticate
	 * against some persistent user identity storage (e.g. database).
	 * @return boolean whether authentication succeeds.
	 */

	public function authenticate()
	{
		$sqlUserAndPassCheck = "select name, pass from userbase";
		$connection = Yii::app()->db;
		$command = $connection->createCommand($sqlUserAndPassCheck);
		$userAndPass = $command->query();

		$this->errorCode=self::ERROR_PASSWORD_INVALID;

		while(($row = $userAndPass->read()) !== false)
		{
			if($this->username == $row['name'])
			{
				if($this->password == $row['pass'])
				{
					$this->errorCode = self::ERROR_NONE;
				}
			}
		}
		return !$this->errorCode;
	}

}