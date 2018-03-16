<?php

namespace App\Respond\Libraries;

use App\Respond\Models\Site;
use App\Respond\Models\Setting;

// Wrapper for Amazon S3 utilities
class S3
{

	// creates a bucket on S3
	public static function createBucket($site, $bucket) {


	  // get s3 key from settings
    $s3_key = Setting::getById('s3-key', $site->id);
    $s3_secret = Setting::getById('s3-secret', $site->id);
    $region = Setting::getById('s3-region', $site->id);


    // check for keys in settings
    if($s3_key != NULL && $s3_secret != NULL) {

      // create AWS client
  		$client = \Aws\S3\S3Client::factory(array(
    		  'version' => 'latest',
          'region'  => $region,
          'credentials' => array(
            'key' => $s3_key,
            'secret'  => $s3_secret
          )
  		));

  		// check to see if bucket exists
  		$doesExist = $client->doesBucketExist($bucket);

  		// create a bucket for the site if it does not exists
  		if($doesExist == false){

  			// #ref: http://docs.aws.amazon.com/aws-sdk-php/latest/class-Aws.S3.S3Client.html#_createBucket
  			$result = $client->createBucket(array(
  			    'Bucket' => $bucket,
  			    'ACL'	 => 'public-read'
  			));

  			// enable hosting for the bucket
  			$result = $client->putBucketWebsite(array(
  			    // Bucket is required
  			    'Bucket' => $bucket,
  			    'ErrorDocument' => array(
  			        // Key is required
  			        'Key' => 'error.html',
  			    ),
  			    'IndexDocument' => array(
  			        // Suffix is required
  			        'Suffix' => 'index.html',
  			    )));

  		}

  		return true;

    }


    return false;


	}

	// saves a file to S3
	public static function saveFile($site, $contentType, $filename, $file, $meta = array(), $folder = 'files') {

	  // get s3 key from settings
    $s3_key = Setting::getById('s3-key', $site->id);
    $s3_secret = Setting::getById('s3-secret', $site->id);
    $bucket = Setting::getById('s3-bucket', $site->id);
    $region = Setting::getById('s3-region', $site->id);

    // check for keys in settings
    if($s3_key != NULL && $s3_secret != NULL) {

  		// create AWS client
  		$client = \Aws\S3\S3Client::factory(array(
    		  'version' => 'latest',
          'region'  => $region,
          'credentials' => array(
            'key' => $s3_key,
            'secret'  => $s3_secret
          )
  		));

  		// create a bucket if it doesn't already exist
  		S3::CreateBucket($bucket);

  		$result = $client->putObject(array(
  		    'Bucket'       => $bucket,
  		    'Key'          => $site->id.'/'.$folder.'/'.$filename,
  		    'Body'   	   => file_get_contents($file),
  		    'ContentType'  => $contentType,
  		    'ACL'          => 'public-read',
  		    'StorageClass' => 'REDUCED_REDUNDANCY',
  		    'Metadata'	   => $meta
  		));

  		return true;

		}
		else {
  		return false;
		}

	}

	// removes a file from S3
	public static function removeFile($site, $filename, $folder = 'files'){

	  // get s3 key from settings
    $s3_key = Setting::getById('s3-key', $site->id);
    $s3_secret = Setting::getById('s3-secret', $site->id);
    $bucket = Setting::getById('s3-bucket', $site->id);
    $region = Setting::getById('s3-region', $site->id);

    // check for keys in settings
    if($s3_key != NULL && $s3_secret != NULL) {

		  // create AWS client
  		$client = \Aws\S3\S3Client::factory(array(
    		  'version' => 'latest',
          'region'  => $region,
          'credentials' => array(
            'key' => $s3_key,
            'secret'  => $s3_secret
          )
  		));

  		// remove file
      $result = $client->deleteObject(array(
  		    'Bucket' => $bucket,
  		    'Key' => $site->id.'/'.$folder.'/'.$filename
  		));

  		// remove thumb
  		$result = $client->deleteObject(array(
  		    'Bucket' => $bucket,
  		    'Key' => $site->id.'/'.$folder.'/thumbs/'.$filename
  		));

  		return true;

		}
		else {
  		return false;
		}

	}

	// get file
	public static function getFile($site, $filename, $folder = 'files'){

	  // get s3 key from settings
    $s3_key = Setting::getById('s3-key', $site->id);
    $s3_secret = Setting::getById('s3-secret', $site->id);
    $bucket = Setting::getById('s3-bucket', $site->id);
    $region = Setting::getById('s3-region', $site->id);

    // check for keys in settings
    if($s3_key != NULL && $s3_secret != NULL) {

  		// create AWS client
  		$client = \Aws\S3\S3Client::factory(array(
    		  'version' => 'latest',
          'region'  => $region,
          'credentials' => array(
            'key' => $s3_key,
            'secret'  => $s3_secret
          )
  		));

  		// get object
  		$result = $client->getObject(array(
  		    'Bucket' => $bucket,
  		    'Key'    => $site->id.'/'.$folder.'/'.$filename
  		));

  		return $result;

		}
		else {
  		return NULL;
		}

	}

	// saves contents to S3
	public static function saveContents($site, $contentType, $filename, $contents, $meta = array(), $folder = 'files'){

	  // get s3 key from settings
    $s3_key = Setting::getById('s3-key', $site->id);
    $s3_secret = Setting::getById('s3-secret', $site->id);
    $bucket = Setting::getById('s3-bucket', $site->id);
    $region = Setting::getById('s3-region', $site->id);

    // check for keys in settings
    if($s3_key != NULL && $s3_secret != NULL) {

  		// create AWS client
  		$client = \Aws\S3\S3Client::factory(array(
    		  'version' => 'latest',
          'region'  => $region,
          'credentials' => array(
            'key' => $s3_key,
            'secret'  => $s3_secret
          )
  		));

  		// create a bucket if it doesn't already exist
  		S3::CreateBucket($bucket);

  		$result = $client->putObject(array(
  		    'Bucket'       => $bucket,
  		    'Key'          => $site['FriendlyId'].'/'.$folder.'/'.$filename,
  		    'Body'   	   => $contents,
  		    'ContentType'  => $contentType,
  		    'ACL'          => 'public-read',
  		    'StorageClass' => 'REDUCED_REDUNDANCY',
  		    'Metadata'	   => $meta
  		));

  		return $result;

		}
		else {
  		return NULL;
		}

	}

	// lists files on S3
	public static function listFiles($site, $imagesOnly = false, $folder = 'files'){

		$arr = array();

		// get s3 key from settings
    $s3_key = Setting::getById('s3-key', $site->id);
    $s3_secret = Setting::getById('s3-secret', $site->id);
    $bucket = Setting::getById('s3-bucket', $site->id);
    $region = Setting::getById('s3-region', $site->id);

    // check for keys in settings
    if($s3_key != NULL && $s3_secret != NULL) {

  		// create AWS client
  		$client = \Aws\S3\S3Client::factory(array(
    		  'version' => 'latest',
          'region'  => $region,
          'credentials' => array(
            'key' => $s3_key,
            'secret'  => $s3_secret
          )
  		));

  		$prefix = $site->id.'/'.$folder.'/';
      $url = str_replace('{{bucket}}', $bucket, S3_URL);
  		$url = str_replace('{{site}}', $site->id, $url);

  		// list objects in a bucket
  		$iterator = $client->getIterator('ListObjects', array(
  		    'Bucket' => $bucket,
  		    'Prefix' => $prefix
  		));


  		foreach ($iterator as $object) {
  			$filename = $object['Key'];
  			$size = $object['Size'];

  			$headers = $client->headObject(array(
  				'Bucket' => $bucket,
  				'Key' => $object['Key']
  			));

  			$headers = $headers->toArray();

  			// defaults
  			$width = 0;
  			$height = 0;

  			// get width and height from head
  			if($headers !== NULL){
  				if(isset($headers['Metadata']['width'])){
  					$width = $headers['Metadata']['width'];
  				}

  				if(isset($headers['Metadata']['height'])){
  					$height = $headers['Metadata']['height'];
  				}
  			}


  			$filename = str_replace($prefix, '', $filename);

  			// get extension
  			$parts = explode(".", $filename);
      		$ext = end($parts); // get extension
      		$ext = strtolower($ext); // convert to lowercase

      		// init
      		$file = array();

    			// exclude thumbs and empty directories
    			if(strpos($filename, 'thumbs/') === FALSE && $filename !== ''){

    				// determine whether the file is an image
    				if($ext=='png' || $ext=='jpg' || $ext=='gif' || $ext == 'svg'){ // upload image
    	            	$isImage = true;

    	            	$file = array(
    		                'filename' => $filename,
    		                'fullUrl' => $url.'/'.$folder.'/'.$filename,
    		                'thumbUrl' => $url.'/'.$folder.'/thumbs/'.$filename,
    		                'extension' => $ext,
    		                'isImage' => $isImage,
    		                'size' => round(($size / 1024 / 1024), 2),
    		                'width' => $width,
    		                'height' => $height
    		            );

    		            // push file to array
    					array_push($arr, $file);
    	    		}
    	    		else{

    	    			// list file if it is allowed
    	    			if($imagesOnly == false){

    						$isImage = false;

    						$file = array(
    			                'filename' => $filename,
    			                'fullUrl' => $url.'/'.$folder.'/'.$filename,
    			                'thumbUrl' => NULL,
    			                'extension' => $ext,
    			                'isImage' => $isImage,
    							'size' => $size,
    							'width' => NULL,
    							'height' => NULL
    			            );

    			            // push file to array
    						array_push($arr, $file);
    					}

    	    		}

        		}


    		}

  		  return $arr;

      }
      else {
        return array();
      }
	}

	// gets the size in MB of files stored in /file
	public static function retrieveFilesSize($site, $imagesOnly = false){

		$arr = array();

		// get s3 key from settings
    $s3_key = Setting::getById('s3-key', $site->id);
    $s3_secret = Setting::getById('s3-secret', $site->id);
    $bucket = Setting::getById('s3-bucket', $site->id);
    $region = Setting::getById('s3-region', $site->id);

    // check for keys in settings
    if($s3_key != NULL && $s3_secret != NULL) {

  		// create AWS client
  		$client = \Aws\S3\S3Client::factory(array(
    		  'version' => 'latest',
          'region'  => $region,
          'credentials' => array(
            'key' => $s3_key,
            'secret'  => $s3_secret
          )
  		));

  		$bucket = $site['Bucket'];

  		$prefix = $site['FriendlyId'].'/files/';

  		// list objects in a bucket
  		$iterator = $client->getIterator('ListObjects', array(
  		    'Bucket' => $bucket,
  		    'Prefix' => $prefix
  		));

  		// totalsize
  		$total_size = 0;

  		// walk through objects
  		foreach ($iterator as $object) {

  			$filename = $object['Key'];
  			$size = $object['Size'];

  			$filename = str_replace($prefix, '', $filename);

      		// init
      		$file = array();

  			// exclude thumbs and empty directories
  			if(strpos($filename, 'thumbs/') === FALSE && $filename !== ''){

  				$total_size += $size;

      		}


  		}

  		return round(($total_size / 1024 / 1024), 2);

		}
		else {
  		return NULL;
		}

	}

	// deploys the site to Amazon S3
	public static function sync($site){

		// get s3 key from settings
    $s3_key = Setting::getById('s3-key', $site->id);
    $s3_secret = Setting::getById('s3-secret', $site->id);
    $bucket = Setting::getById('s3-bucket', $site->id);
    $region = Setting::getById('s3-region', $site->id);

    // check for keys in settings
    if($s3_key != NULL && $s3_secret != NULL) {

      try {

    		// create AWS client
    		$client = \Aws\S3\S3Client::factory(array(
      		  'version' => 'latest',
            'region'  => $region,
            'credentials' => array(
              'key' => $s3_key,
              'secret'  => $s3_secret
            )
    		));

        // site directory
        $dest = app()->basePath() . '/public/sites/' . $site->id;

    		// prefix
    		$keyPrefix = '';

    		// set permissions
    		$options = array(
              'concurrency' => 20,
              'debug'       => true,
              'before' => function (\Aws\Command $command) {
              $command['ACL'] = strpos($command['Key'], 'CONFIDENTIAL') === false
                  ? 'public-read'
                  : 'private';
          }

          );

    		// sync folders, #ref: http://blogs.aws.amazon.com/php/post/Tx2W9JAA7RXVOXA/Syncing-Data-with-Amazon-S3
    		$client->uploadDirectory($dest, $bucket, $keyPrefix, $options);

      }
      catch (\Exception $e) {
        return false;
      }

  		return true;
    }
		else {
  		return false;
		}

	}

	// deploys the directory to Amazon S3
	public static function deployDirectory($site, $local_dir, $keyPrefix){

	  // get s3 key from settings
    $s3_key = Setting::getById('s3-key', $site->id);
    $s3_secret = Setting::getById('s3-secret', $site->id);
    $bucket = Setting::getById('s3-bucket', $site->id);

    // check for keys in settings
    if($s3_key != NULL && $s3_secret != NULL) {

  		// create AWS client
  		$client = \Aws\S3\S3Client::factory(array(
    		  'version' => 'latest',
          'region'  => $region,
          'credentials' => array(
            'key' => $s3_key,
            'secret'  => $s3_secret
          )
  		));

  		// create a bucket if it doesn't already exist
  		S3::CreateBucket($bucket);

  		// set permissions
  		$options = array(
  		    'params'      => array('ACL' => 'public-read'),
  		    'concurrency' => 20,
  		    'debug'       => true
  		);

  		// sync folders, #ref: http://blogs.aws.amazon.com/php/post/Tx2W9JAA7RXVOXA/Syncing-Data-with-Amazon-S3
  		$client->uploadDirectory($local_dir, $bucket, $site['FriendlyId'].'/'.$keyPrefix, $options);

  		return true;
    }
		else {
  		return false;
		}

	}

}