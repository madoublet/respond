<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;
//use Symfony\Component\HttpFoundation\File\UploadedFile;

use App\Respond\Libraries\Utilities;

use App\Respond\Models\Site;
use App\Respond\Models\User;

use App\Respond\Models\File;

class FileController extends Controller
{

  /**
   * Lists all images for a site
   *
   * @return Response
   */
  public function listImages(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $id = $request->input('auth-id');

    $arr = File::listImages($id);

    return response()->json($arr);

  }

  /**
   * Lists all files for a site
   *
   * @return Response
   */
  public function listFiles(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $id = $request->input('auth-id');

    // get a reference to the site
    $site = Site::getById($id);

    // list files
    $arr = File::listFiles($id);

    // set image extensions
    $image_exts = array('gif', 'png', 'jpg', 'svg');

    $files = array();

    foreach($arr as $file) {

      $filename = str_replace('files/', '', $file);

      $path = app()->basePath().'/public/sites/'.$id.'/files/'.$filename;

      // get extension
      $parts = explode(".", $filename);
      $ext = end($parts); // get extension
      $ext = strtolower($ext); // convert to lowercase

      // determine if it is an image
      $is_image = in_array($ext, $image_exts);

      // get the filesize
      $size = filesize($path);

      if($is_image === TRUE) {
        $width = 0;
        $height = 0;

        try{
          list($width, $height, $type, $attr) = Utilities::getImageInfo($path);
        }
        catch(Exception $e){}

        // set url, thumb
        $url = $thumb = 'sites/'.$site->id.'/files/'.$filename;

        // check for thumb
        if(file_exists(app()->basePath().'/public/sites/'.$id.'/files/thumbs/'.$filename)) {
          $thumb = 'sites/'.$site->id.'/files/thumbs/'.$filename;
        }

        // push file to the array
        array_push($files, array(
          'name' => $filename,
          'url' => $url,
          'thumb' => $thumb,
          'extension' => $ext,
          'isImage' => $is_image,
          'width' => $width,
          'height' => $height,
          'size' => number_format($size / 1048576, 2)
        ));

      }
      else {

        // push file to the array
        array_push($files, array(
          'name' => $filename,
          'url' => 'files/'.$filename,
          'thumb' => '',
          'extension' => $ext,
          'isImage' => $is_image,
          'width' => NULL,
          'height' => NULL,
          'size' => number_format($size / 1048576, 2)
        ));

      }

    }


    return response()->json($files);

  }


  /**
   * Uploads a file
   *
   * @return Response
   */
  public function upload(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $id = $request->input('auth-id');

    // get site
    $site = Site::getById($id);

    // get file
    $file = $request->file('file');

    // get file info
    $filename = $file->getClientOriginalName();
		$contentType = $file->getMimeType();
		$size = intval($file->getClientSize()/1024);

		// get the extension
		$ext = $file->getClientOriginalExtension();

    // allowed filetypes
    $allowed = explode(',', env('ALLOWED_FILETYPES'));

    // trim and lowercase all items in the aray
    $allowed = array_map('trim', $allowed);
		$allowed = array_map('strtolower', $allowed);

		// directory to save
    $directory = app()->basePath().'/public/sites/'.$site->id.'/files';

		// save image
    if($ext=='png' || $ext=='jpg' || $ext=='gif' || $ext == 'svg'){ // upload image

      // move the file
      $file->move($directory, $filename);

      // set path
      $path = $directory.'/'.$filename;

      $arr = Utilities::createThumb($site, $path, $filename);

      // create array
      $arr = array(
        'filename' => $filename,
        'fullUrl' => '/files/'.$filename,
        'thumbUrl' => '/files/thumbs/'.$filename,
        'extension' => $ext,
        'isImage' => true,
        'width' => $arr['width'],
        'height' => $arr['height'],
      );

    }
    else if(in_array($ext, $allowed)){ // save file if it is allowed

      // move the file
      $file->move($directory, $filename);

      // set url
      $url = 	$site->domain;

      $arr = array(
        'filename' => $filename,
        'fullUrl' => $url.'/files/'.$filename,
        'thumbUrl' => NULL,
        'extension' => $ext,
        'isImage' => false,
        'width' => -1,
        'height' => -1
        );
    }
    else{

      return response('Unauthorized', 401);

    }

    // return OK
    return response()->json($arr);

  }

  /**
   * Removes the file
   *
   * @return Response
   */
  public function remove(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $id = $request->input('auth-id');

    // get url, title and description
    $name = $request->json()->get('name');

    // remove the file
    File::remove($name, $id);

    // return OK
    return response('OK', 200);

  }

}