<?php

/**
 * The DateUtility class is there to represent the time inside the economy.
 * It utilizes the date function as well as the date_format, date_create, and
 * strtotime functions to create a string for not only the database, but also
 * to utilize in the situation of the comparing when things have occured in 
 * the economy (such as when the economy ends each day, or what the current time
 * is according the the offset from the UTC time specified by the teacher).
 * 
 * @author   <cmicklis@stetson.edu>
 * @since    v0.0.0
 */

class DateUtility extends CApplicationComponent
{
    /**
     *  The getCurrentDate function gets the current date of the economy.
     *  Need to check if the browser the user is using is safari, if so,
     *  the date_format function reacts differently (automatically adjusts
     *  for time differences), and so different actions need to be made.
     *  
     *  @param  int        $economyID      The Primary Key of the economy.
     *  @return String                     The current date.
     */
    public static function getCurrentDate($economyID)
    {
        $timeDiff = Economy::getEconomyTimeDifference($economyID);
        $symbol = DateUtility::getSymbolByAmount($timeDiff);
        
        $date = date('Y-m-d H:i:s', strtotime(date_format(date_create(null, timezone_open('UTC')), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));

        return $date;
    }

    /**
     *  The getDateByHourOffset function gets the date from an hourly difference
     *  based off the economies time. It returns a date from that difference in the
     *  form of a String.
     *  
     *  @param  int        $economyID      The Primary Key of the economy.
     *  @return String                     The date.
     */
    public static function getDateByHourOffset($hourOffset, $economyID)
    {
        $timeDiff = Economy::getEconomyTimeDifference($economyID);
        $timeDiff += $hourOffset;
        $symbol = DateUtility::getSymbolByAmount($timeDiff);

        $date = date('Y-m-d H:i:s', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));

        return $date;
    }

    /**
     *  The getResetTomorrow method gets the time when the economy resets daily for 
     *  that specific day and that specific economy.
     *
     *  It does this by first getting the time difference of the economy from the
     *  UTC time, and getting the reset after hour. It then gets the current hour 
     *  its at, if the hour is greater than the reset hour, assuming both are positive,
     *  then it states that it overpassed the reset of the economy and so will
     *  get tomorrow's tomorrow reset, otherwise it will get the reset that will occur 
     *  tomorrow.
     *  
     *  @param  int        $economyID      The Primary Key of the economy.
     *  @return String                     The reset date.
     */
    public static function getResetTomorrow($economyID)
    {
        $timeDiff = Economy::getEconomyTimeDifference($economyID);
        $reset = Economy::getEconomyReset($economyID);

        $symbol = DateUtility::getSymbolByAmount($timeDiff);
        $hour = date('H', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
        if($hour > $reset)
        {
            $timeDiff += 48;
            $symbol = DateUtility::getSymbolByAmount($timeDiff);
            $date = date('Y-m-d', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
            $date .= ' '.$reset.':00:00';
        }
        else
        {
            $timeDiff += 24;
            $symbol = DateUtility::getSymbolByAmount($timeDiff);
            $date = date('Y-m-d', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
            $date .= ' '.$reset.':00:00';
        }
        return $date;
    }

    /**
     *  The getResetToday method gets the time when the economy resets daily for 
     *  that specific day and that specific economy.
     *
     *  It does this by first getting the time difference of the economy from the
     *  UTC time, and getting the reset after hour. It then gets the current hour 
     *  its at, if the hour is greater than the reset hour, assuming both are positive,
     *  then it states that it overpassed the reset of the economy and so will
     *  get tomorrow's reset, otherwise it will get the reset that will occur today.
     *  
     *  @param  int        $economyID      The Primary Key of the economy.
     *  @return String                     The reset date.
     */
    public static function getResetToday($economyID)
    {
        $timeDiff = Economy::getEconomyTimeDifference($economyID);
        $reset = Economy::getEconomyReset($economyID);

        $symbol = DateUtility::getSymbolByAmount($timeDiff);
        $hour = date('H', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
        if($hour > $reset)
        {
            $timeDiff += 24;
            $symbol = DateUtility::getSymbolByAmount($timeDiff);
            $date = date('Y-m-d', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
            $date .= ' '.$reset.':00:00';
        }
        else
        {
            $date = date('Y-m-d', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
            $date .= ' '.$reset.':00:00';
        }
        return $date;
    }

    /**
     *  The getResetYesterday method gets the time when the economy resets daily for 
     *  that specific day and that specific economy.
     *
     *  It does this by first getting the time difference of the economy from the
     *  UTC time, and getting the reset after hour. It then gets the current hour 
     *  its at, if the hour is greater than the reset hour, assuming both are positive,
     *  then it states that it overpassed the reset of the economy and so will
     *  get today's reset, otherwise it will get the reset that will occur yesterday.
     *  
     *  @param  int        $economyID      The Primary Key of the economy.
     *  @return String                     The reset date.
     */
    public static function getResetYesterday($economyID)
    {
        $timeDiff = Economy::getEconomyTimeDifference($economyID);
        $reset = Economy::getEconomyReset($economyID);

        $symbol = DateUtility::getSymbolByAmount($timeDiff);
        $hour = date('H', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
        if($hour > $reset)
        {
            $date = date('Y-m-d', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
            $date .= ' '.$reset.':00:00';
        }
        else
        {
            $timeDiff -= 24;
            $symbol = DateUtility::getSymbolByAmount($timeDiff);
            $date = date('Y-m-d', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
            $date .= ' '.$reset.':00:00';
        }
        return $date;
    }

    /**
     *  The getResetYesterdaysYesterday method gets the time when the economy resets daily for 
     *  that specific day and that specific economy.
     *
     *  It does this by first getting the time difference of the economy from the
     *  UTC time, and getting the reset after hour. It then gets the current hour 
     *  its at, if the hour is greater than the reset hour, assuming both are positive,
     *  then it states that it overpassed the reset of the economy and so will
     *  get today's reset, otherwise it will get the reset that will occur yesterday.
     *  
     *  @param  int        $economyID      The Primary Key of the economy.
     *  @return String                     The reset date.
     */
    public static function getResetYesterdaysYesterday($economyID)
    {
        $timeDiff = Economy::getEconomyTimeDifference($economyID);
        $reset = Economy::getEconomyReset($economyID);

        $symbol = DateUtility::getSymbolByAmount($timeDiff);
        $hour = date('H', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
        if($hour > $reset)
        {
            $timeDiff -= 24;
            $symbol = DateUtility::getSymbolByAmount($timeDiff);
            $date = date('Y-m-d', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
            $date .= ' '.$reset.':00:00';
        }
        else
        {
            $timeDiff -= 48;
            $symbol = DateUtility::getSymbolByAmount($timeDiff);
            $date = date('Y-m-d', strtotime(date_format(date_create(), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
            $date .= ' '.$reset.':00:00';
        }
        return $date;
    }

    /**
     *  The getDateByBeginningAndDayOffset method goes and uses the beginning date supplied
     *  to calculate out the reset date given a certain offset of days ahead in the future,
     *  or in the past.
     * 
     *  @param  Date       $beginningDate  The starting date at which the reset date is calculated.
     *  @param  int        $offset         The numeric day offset from the current date.
     *  @param  int        $economyID      The Primary Key of the economy.
     *  @return String                     The reset date.
     */
    public static function getResetDateByBeginningAndDayOffset($beginningDate, $offset, $economyID)
    {
        $timeDiff = Economy::getEconomyTimeDifference($economyID);
        $reset = Economy::getEconomyReset($economyID);
        $timeDiff += (24 * $offset);
        $symbol = DateUtility::getSymbolByAmount($timeDiff);
        $date = date('Y-m-d', strtotime(date_format(date_create($beginningDate), 'Y-m-d H:i:s').' '.$symbol.' '.abs($timeDiff).' hours'));
        $date .= ' '.$reset.':00:00';
        return $date;
    }   

    /**
     *  The getSymbolByAmount method gets excactly that, it returns a symbol of
     *  either positive or negative depending on the amount that has been entered
     *  in the parameter location.
     *  
     *  @param  int         $amount         The integer amount.
     *  @return char                        States if its either positive or negative.
     */
    public static function getSymbolByAmount($amount)
    {
        if($amount > 0)
        {
            return '+';
        }
        else
        {
            return '-';
        }
    }
}