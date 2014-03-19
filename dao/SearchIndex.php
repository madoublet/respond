<?php

// SearchIndex model
class SearchIndex{
    
	// adds a page to the index
	public static function Add($pageUniqId, $siteUniqId, $language, $url, $name, $image, $isSecure, $h1s, $h2s, $h3s, $description, $content){
		
        try{
            
            $db = DB::get();
    	
    		$q = "INSERT INTO SearchIndex (PageUniqId, SiteUniqId, Language, Url, Name, Image, IsSecure, H1s, H2s, H3s, Description, Content) 
    			    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $s = $db->prepare($q);
            $s->bindParam(1, $pageUniqId);
            $s->bindParam(2, $siteUniqId);
            $s->bindParam(3, $language);
            $s->bindParam(4, $url);
            $s->bindParam(5, $name);
            $s->bindParam(6, $image);
            $s->bindParam(7, $isSecure);
            $s->bindParam(8, $h1s);
            $s->bindParam(9, $h2s);
            $s->bindParam(10, $h3s);
            $s->bindParam(11, $description);
            $s->bindParam(12, $content);
            
            $s->execute();
            
            return array(
                'PageUniqId' => $pageUniqId,
                'SiteUniqId' => $siteUniqId,
                'Language' => $language,
                'Url' => $url,
                'Name' => $name,
                'Image' => $image,
                'IsSecure' => $isSecure,
                'H1s' => $h1s,
                'H2s' => $h2s,
                'H3s' => $h3s,
                'Description' => $description,
                'Content' => $content
                );
                
        } catch(PDOException $e){
            die('[SearchIndex::Add] PDO Error: '.$e->getMessage());
        }
	}
	
	// searches the index
	public static function Search($siteUniqId, $language, $term, $showSecure){
		
        try{

            $db = DB::get();
            
            $arr = explode(' ', $term);
            
            $s_term = '';
            
            foreach($arr as $val) {
	             $s_term .= '+'.$val.' ';
	        }
	        
	        $s_term = trim($s_term);
            
            /* #basic */
            if($showSecure == true){  // a logged in user can see all results
	            $q = "SELECT Name, Url, Description, Image FROM SearchIndex
						WHERE SiteUniqId = ? AND Language = ? AND MATCH (Name, H1s, H2s, H3s, Description, Content) AGAINST (? IN BOOLEAN MODE)";

            }
            else{  // a non-logged in user can only see non-secured results
				$q = "SELECT Name, Url, Description, Image FROM SearchIndex
						WHERE SiteUniqId = ? AND Language = ? AND IsSecure = 0 AND MATCH (Name, H1s, H2s, H3s, Description, Content) AGAINST (? IN BOOLEAN MODE)";
			}
				
        			
            $s = $db->prepare($q);
            $s->bindParam(1, $siteUniqId);
            $s->bindParam(2, $language);
            $s->bindParam(3, $s_term);
            
            $s->execute();
            
            $arr = array();
            
            while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[SearchIndex::SEARCH] PDO Error: '.$e->getMessage());
        } 
        
	}
	
	// removes index for a page
	public static function Remove($pageUniqId){
		
        try{
            
            $db = DB::get();
            
            $q = "DELETE FROM SearchIndex WHERE PageUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $pageUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[SearchIndex::Remove] PDO Error: '.$e->getMessage());
        }
        
	}
	
	
}

?>