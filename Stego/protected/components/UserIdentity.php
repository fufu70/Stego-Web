<?php

/**
 * UserIdentity represents the data needed to identity a user.
 * It contains the authentication method that checks if the provided
 * data can identity the user, and stores session information.
 *
 * @author   <jsalis@stetson.edu>
 * @since    v0.0.0
 */
class UserIdentity extends CUserIdentity
{
    const NULL_STATE_VALUE = '';

	private $_id;

	/**
	 * Authenticates a user and retrieves the user ID.
     * 
	 * @return boolean	Whether authentication succeeded.
	 */
	public function authenticate()
	{
        if (User::verifyUserLogin($this->username, $this->password))
        {
            $this->_id = User::getUserIDByEmailAddress($this->username);
            $parts = explode("@", $this->username);
            $this->username = $parts[0];
            return true;
        }
        else return false;
	}

    /**
     * Sets up session information for the user represented by the ID.
     *
     * type :      Represents the user type. Used to control access rights and
     *             direct the user to appropriate controllers.
     * economyID : Represents the ID of the current economy.
     * roleID :    Represents the ID of the current entity role that the active 
     *             user is taking in the economy.
     * roleType :  Represents the type of the current entity role that the active 
     *             user is taking in the economy.
     */
    public function createSession()
    {
        $user = User::model()->findByPK($this->_id);
        $this->setState('type', strtolower($user->getUserType()));
        $this->setState('economyID', UserIdentity::NULL_STATE_VALUE);
        $this->setState('roleID', UserIdentity::NULL_STATE_VALUE);
        $this->setState('roleType', UserIdentity::NULL_STATE_VALUE);
    }

	public function getId()
    {
        return $this->_id;
    }
}
