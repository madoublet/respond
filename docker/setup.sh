perl -p -i -e "s/AllowOverride FileInfo/AllowOverride All/" /etc/apache2/sites-available/000-default.conf 
perl -p -i -e 's/echo "=> Done!"/. \/mysql-setup.sh
echo "=> Done!"/' /create_mysql_admin_user.sh 
