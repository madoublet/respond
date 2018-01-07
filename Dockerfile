FROM php:5-apache

WORKDIR /var/www

ADD ./docker/vhost-config.conf /etc/apache2/sites-available/000-default.conf
ADD . .

# Install system deps
RUN apt-get update \
 && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
 && apt-get install -y --no-install-recommends git libgd3 libgd-dev nodejs \
 && docker-php-ext-configure gd --with-gd=/usr \
 && docker-php-ext-install gd zip \
 && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
 && php composer-setup.php \
 # Install project deps
 && COMPOSER_ALLOW_SUPERUSER=1 ./composer.phar install -on --prefer-dist \
 && npm i \
 && ./node_modules/gulp-cli/bin/gulp.js \
 # Clean up
 && apt-get purge -y $PHPIZE_DEPS git libgd-dev nodejs \
 && apt-get autoremove -y \
 && apt-get clean \
 && rm -fr /var/lib/apt/lists/* /tmp/* /var/tmp/* docker \
    composer.* composer-setup.php /root/.composer \
    gulpfile.js package*.json node_modules /root/.npm \
 # Set up
 && mkdir public/sites resources/sites \
 && chown -R www-data:www-data public/sites resources/sites storage \
 && a2enmod rewrite \
 && mv .env.example .env

VOLUME ["/var/www/public/sites", "/var/www/resources"]
