<?php

namespace App\Respond\Libraries;

class Zip
{

    /**
     * Zips a folder and enables a doanlod
     *
     * @return {String} app folder
     */
    public static function zipSite($site) {

      $dir = realpath(app()->basePath() . '/public/sites/'.basename($site->id));
      $zip_file = $dir.'/archive.zip';

      // Initialize archive object
      $zip = new \ZipArchive();
      $zip->open($zip_file, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

      // Create recursive directory iterator
      /** @var SplFileInfo[] $files */
      $files = new \RecursiveIteratorIterator(
          new \RecursiveDirectoryIterator($dir),
          \RecursiveIteratorIterator::LEAVES_ONLY
      );

      foreach ($files as $name => $file)
      {
          // Skip directories (they would be added automatically)
          if (!$file->isDir())
          {
              // Get real and relative path for current file
              $filePath = $file->getRealPath();

              // do not zip the zip file
              if(strpos($filePath, 'archive.zip') == FALSE) {
                $relativePath = substr($filePath, strlen($dir) + 1);

                // Add current file to archive
                $zip->addFile($filePath, $relativePath);
              }

          }
      }

      // Zip archive will be created only after closing object
      $zip->close();

      return $zip_file;
    }

}