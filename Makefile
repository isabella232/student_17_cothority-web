deploy:
	rsync -z -v -essh -a build/* agora@agora.dedis.ch:www
