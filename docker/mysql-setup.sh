#!/bin/bash

echo === Initializing Respond ===
mysql -uroot -e "create database respond"
mysql -uroot respond < /app/schema.sql

