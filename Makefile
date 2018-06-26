deploy-securekg:
	rsync -v -essh -a build/* securekg@securekg.dedis.ch:www

deploy:
	rsync -v -essh -a build/* status2@status.dedis.ch:www

