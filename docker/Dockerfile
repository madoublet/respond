FROM coderstephen/php7:latest

# install supervisord
RUN apt-get install -y supervisor && \
mkdir -p /var/log/supervisor

# install nodejs 6
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - && \
apt-get install -y nodejs

# Rebuild PHP for the required mbstring
RUN cd /usr/local/src/php/ && \
./configure --prefix=/usr/local/php70 \
--with-config-file-path=/usr/local/php70 \
--with-config-file-scan-dir=/usr/local/php70/conf.d \
--with-libdir=/lib/x86_64-linux-gnu \
--enable-fpm --without-pear --with-openssl --with-curl \
--enable-mbstring --enable-zip && \
make install clean

# checkout the source from respond cms
# and create required directories
RUN cd /var/www/ && \
rm -rf html && \
git clone https://github.com/madoublet/respond6.git . && \
mkdir -p public/sites && \
mkdir -p resources/sites && \
chown -R www-data public/sites && \
chown -R www-data resources/sites && \
ln -s /var/www/public html && \
ln -s /var/www/node_modules public/node_modules && \
cp .env.example .env

# install required nodejs and PHP modules
RUN cd /var/www/ && \
npm install && \
composer install

# update apache config and mod
RUN sed -i "s/var\\/www/var\\/www\\/public/" /etc/apache2/sites-enabled/000-default.conf
RUN a2enmod rewrite

VOLUME /var/www

EXPOSE 80
VOLUME ["/var/www/public/sites", "/var/www/resources"]

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
