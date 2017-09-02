FROM ubuntu:16.04
LABEL maintainer="Matthew Smith <matt@matthewsmith.com>" 
LABEL version="1.0"

# install apache, php + clean up
RUN apt-get update \ 
	&& apt-get install -y --no-install-recommends \		
		unzip \
		wget \
		curl \
		apache2 \
		php \		
		php-cli \
		libapache2-mod-php \
		php-gd \
		php-curl \
		php-json \
		php-zip \		
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# install respond
RUN	wget --content-disposition --no-check-certificate https://github.com/madoublet/respond/blob/master/dist/release.zip?raw=true \
	
	# unzip data to www 
	&& unzip -o release.zip -d /var/www \
	
	# create directories
	&& cd /var/www \
	&& mkdir public/sites \
	&& mkdir resources/sites \

	# set permissions
	&& chown -R www-data public/sites \
	&& chown -R www-data resources/sites \
	&& chown -R www-data storage \

	# copy config
	&& cp .env.example .env \

	# set symbolic links
	#&& rm -rf html \
	#&& ln -s /var/www/public html \
	#&& ln -s /var/www/node_modules public/node_modules \

	# enable url-rewrite
	&& a2enmod rewrite \

	# Forward request and error logs to docker log collector
	&& ln -sf /dev/stdout /var/log/apache2/access.log \
	&& ln -sf /dev/stderr /var/log/apache2/error.log

# set respond config 	
ADD ./env.example /var/www/.env

# overwrite apache config
ADD ./vhost-config.conf /etc/apache2/sites-enabled/000-default.conf

VOLUME /var/www

# Ports
EXPOSE 80
VOLUME ["/var/www/public/sites", "/var/www/resources"]

# By default, simply start apache.
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
