<?php

class DB{
    
    public static $pdo = null;
    
    // gets a reference to the PDO object, #ref http://net.tutsplus.com/tutorials/php/why-you-should-be-using-phps-pdo-for-database-access/
	public static function get(){

        if(self::$pdo == null){

    		$host = DB_HOST;
        	$dbname = DB_NAME;
    		$dbuser = DB_USER;
    		$dbpass = DB_PASSWORD;
            
            self::$pdo = new PDO("mysql:host=$host;dbname=$dbname", $dbuser, $dbpass);
            self::$pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );  

        }
        
        return self::$pdo;
	}
}

?>