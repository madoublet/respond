FROM coderstephen/php7:latest

# install supervisord
RUN apt-get install -y supervisor && \
mkdir -p /var/log/supervisor

# install nodejs 6
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - && \
apt-get install -y nodejs

# Rebuild PHP for the required mbstring
RUN \
cd /usr/local/src/php/ && \
./configure --prefix=/usr/local/php70 \
--with-config-file-path=/usr/local/php70 \
--with-config-file-scan-dir=/usr/local/php70/conf.d \
--with-libdir=/lib/x86_64-linux-gnu \
--enable-fpm --without-pear --with-openssl --with-curl \
--enable-mbstring --enable-zip && \
make install clean && \
cd /var/www && \
rm -rf /usr/local/src/php && \
rm -rf html && \
git clone https://github.com/madoublet/respond.git . && \
git checkout rc1 && \
mkdir -p public/sites && \
mkdir -p resources/sites && \
chown -R www-data public/sites && \
chown -R www-data resources/sites && \
ln -s /var/www/public html && \
cp .env.example .env && \
composer install && \
npm install --only=dev && \
npm install angular2-jwt && \
npm install && \
ln -s /var/www/node_modules /var/www/public/node_modules && \
node ./node_modules/gulp/bin/gulp.js && \
sed -i "s/var\\/www/var\\/www\\/public/" /etc/apache2/sites-enabled/000-default.conf && \
a2enmod rewrite

EXPOSE 80
VOLUME ["/var/www/public/sites", "/var/www/resources"]

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
