deploy:
	rsync -v -essh -a build/* root@voting-web-prod.epfl.ch:/var/www/html
