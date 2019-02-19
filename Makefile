deploy:
	rm -rf build
	npm run build
	rsync -v -essh -a build/* status2@status.dedis.ch:www
