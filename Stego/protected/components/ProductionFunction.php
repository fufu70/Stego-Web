<?php

/**
 * 	The ProductionFunction class is there to allow the Econ-Sim to calculate out the amount
 *  of items that the worker needs to produce. This is done by using a Production Function
 *  specified by the Teacher or Econ-Sim to use, utilizing the constants that are specified
 *  for that production function (specified in the rule of the economy), and the pre-defined
 *  function in this class.
 *
 *  @author   <cmicklis@stetson.edu>
 *  @since 	  v0.0.0
 */

class ProductionFunction extends CApplicationComponent
{
    const PRODUCTION_FUNCTION_COBB_DOUGLAS = "Cobb-Douglas";

    /**
     * 	The amountOfItemsToProduce function exists to calculate out the amount of items that
     * 	the worker needs to produce given the Economy ID, Company ID, and Worker ID. This
     * 	allows the function to get all of the constants and rules defined by the economy,
     * 	get the amount of items that the Company has created so far, or the amount of job 
     * 	offers that have been accepted that day, and then calculate aout the amount of 
     * 	work that the worker does given the efficiency of that worker.
     * 	
     *  @param  int   	 $economyID 	The Primary Key of the Economy.
     *  @param  int  	 $companyID 	The Primary Key of the Company.
     *  @param  int 	 $workerID  	The Primary Key of the Worker.
     *  @return int 					The amount of items that the worker must complete.
     */
    public static function amountOfItemsToProduce($economyID, $companyID, $workerID)
    {
    	$functionName = Economy::getEconomyProductionFunction($economyID);
    	if ($functionName == ProductionFunction::PRODUCTION_FUNCTION_COBB_DOUGLAS)
    	{
    		$company = Company::model()->findByPk($companyID);
    		$A = $company->getTotalFactorProductivity($economyID);
    		$alpha = $company->getOutputElasticity($economyID);
            $K = $company->getCompanyEfficiency();

    		return ProductionFunction::cobbDouglasDifference($economyID, $company, $workerID, $A, $alpha, $K);
    	}
    	return 0;
    }

    /**
     *	The cobbDouglasDifference calculates out the difference of when the worker
     *	is included in the production and when he is excluded. This allows the Econ-Sim
     *	to know specifically the amount that the worker needs to create.
     * 
     *  @param  int   	 $economyID 	The Primary Key of the Economy.
     *  @param  int  	 $companyID 	The Primary Key of the Company.
     *  @param  int 	 $workerID  	The Primary Key of the Worker.
     *  @param  int      $A         	The A of the Company.
     *  @param  int      $alpha     	The alpha of that company's type.
     *  @param  int      $K         	The Capital of the Company.
     *  @return double 				    The difference of when the Worker is included and when
     *                      		    he is not included.
     */
    public static function cobbDouglasDifference($economyID, $company, $workerID, $A, $alpha, $K)
    {
    	$employees = $company->getCurrentEmployees();
    	$x = ProductionFunction::cobbDouglas($A, $alpha, $K, $employees, $workerID);
    	$y = ProductionFunction::cobbDouglas($A, $alpha, $K, $employees);
    	return $y - $x;
    }

    /**
     *	The cobbDouglas function calculates out the result of the Cobb-Douglas 
     *	Production Function. The function is as follows:
     *
     * 			r = A * (K^alpha) * (L^(1-alpha))
     *
     * 	The variable L is the sum of all of the workers efficiencies, A is the 
     * 	technology of the Company, alpha is set by the teacher and is for the
     * 	specific type of Company (Food/Non-Food), and K is the capital of the 
     * 	company (how many machines and land the company has).	
     * 
     *  @param  int           $A         	      The A of the Company.
     *  @param  int           $alpha     	      The alpha of that companies type.
     *  @param  int           $K         	      The Capital of the Company.
     *  @param  array<Entity> $employees          The Employees of the Company that have 
     *                                            done work.
     *  @param  int 	      $workerIgnoreID     The Primary Key of the Worker to ignore when
     *                                            calculating out the result.
     *  @return double                            The result of the production function.
     */
    public static function cobbDouglas($A, $alpha, $K, $employees, $workerIgnoreID = null)
    {
    	$L = 0;
    	for ($i = 0; $i < sizeof($employees); $i++)
    	{
    		if ($workerIgnoreID != $employees[$i]->getEntityID())
    		{
    			$L += $employees[$i]->getEntityEfficiency();
    		}
    	}
    	return (($A) * pow($K, $alpha) * pow($L, (1 - $alpha)));
    }
}
