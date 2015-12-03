#!/bin/bash

echo === Initializing Respond ===
chown -R www-data /app/sites 
if [ ! -f /app/index.html ]; then
  cd /app
  git clone https://github.com/madoublet/respond.git .
fi
if [ ! -f /app/setup.local.php ]; then
  cat /app/setup.php | sed s/dbuser/root/ | sed s/dbpass// > /app/setup.local.php
fi
mysql -uroot -e "create database respond"
mysql -uroot respond < /app/schema.sql

