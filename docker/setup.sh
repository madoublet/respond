# Lets hook in the /mysql-setup.sh to the /create_mysql_admin_user.sh script.
perl -p -i -e 's/echo "=> Done!"/. \/mysql-setup.sh
echo "=> Done!"/' /create_mysql_admin_user.sh 

#
# Install respond.
rm -fr /app; mkdir /app; cd /app
git clone https://github.com/madoublet/respond.git .
git checkout origin/dev -B dev
mkdir /app/sites
cat /app/setup.php | sed s/dbuser/root/ | sed s/dbpass// > /app/setup.local.php

# Adjust the apache config
perl -p -i -e "s/AllowOverride FileInfo/AllowOverride All/" /etc/apache2/sites-available/000-default.conf 

#
# Lets make sure we `chown -R www-data  /app/sites` before starting up 
# as the use might point it to a different voluem
perl -p -i -e 's/exec supervisord -n/
chown -R www-data \/app\/sites 
exec supervisord -n/' /run.sh 
