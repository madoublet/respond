<?php

namespace App\Respond\Libraries;

class Zip
{

    /**
     * Zips a folder and enables a doanlod
     *
     * @return {String} app folder
     */
    public static function zipFolder($site) {

      $dir = 'dir';
      $zip_file = 'file.zip';

      // Get real path for our folder
      $rootPath = realpath($dir);

      // Initialize archive object
      $zip = new ZipArchive();
      $zip->open($zip_file, ZipArchive::CREATE | ZipArchive::OVERWRITE);

      // Create recursive directory iterator
      /** @var SplFileInfo[] $files */
      $files = new RecursiveIteratorIterator(
          new RecursiveDirectoryIterator($rootPath),
          RecursiveIteratorIterator::LEAVES_ONLY
      );

      foreach ($files as $name => $file)
      {
          // Skip directories (they would be added automatically)
          if (!$file->isDir())
          {
              // Get real and relative path for current file
              $filePath = $file->getRealPath();
              $relativePath = substr($filePath, strlen($rootPath) + 1);

              // Add current file to archive
              $zip->addFile($filePath, $relativePath);
          }
      }

      // Zip archive will be created only after closing object
      $zip->close();

      return $zip_file;

    }

}