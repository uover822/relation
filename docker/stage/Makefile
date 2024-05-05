build :
	mkdir -p app/data
	mkdir -p app/srv
	cp -r ../../../relation/relation.js app
	cp -r ../../../relation/srv/*.js app/srv
	docker build -t msr-relation:1 .
	docker build -t msr-relation-prod:1 -f Dockerfile-prod .

clean :
	rm *~

.PHONY : build clean
