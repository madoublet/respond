# Start from a Lamp container https://github.com/tutumcloud/lamp 
FROM tutum/lamp:latest

# Copy in the current dir as the respond app
COPY setup.sh /setup.sh
COPY mysql-setup.sh /mysql-setup.sh
RUN bash /setup.sh; rm /setup.sh

EXPOSE 80 3306
VOLUME ["/app/sites", "/var/lib/mysql"]
CMD ["/run.sh"]