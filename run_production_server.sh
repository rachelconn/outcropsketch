#!/bin/bash

if [ "$EUID" -ne 0 ]
	then echo "Please ensure this script is run as root, and that your python virtual environment is set up correctly."
	exit
fi


mod_wsgi-express setup-server webserver/outcropsketch/wsgi.py \
	--setup-only \
	--port=80 \
	--user=www-data \
	--group=www-data \
	--server-root=/etc/mod_wsgi-express-outcropsketch \

/etc/mod_wsgi-express-outcropsketch/apachectl start

# To stop or restart: run /etc/mod_wsgi-express-outcropsketch/apachectl [stop, restart]
