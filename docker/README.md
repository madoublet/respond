# Respond CMS Docker Image

## To Build

``` bash
$ docker build -t respond .
```

### To Run

Use [docker volumes](http://docs.docker.io/use/working_with_volumes/) to expose
your web content to the apache web server.

``` bash
# run Respond CMS
$ DATA_DIR=${HOME}/respond-data
$ mkdir -p ${DATA_DIR}/sites 
$ mkdir -p ${DATA_DIR}/mysql 
$ docker run --name=respond -p 80:80 -v ${DATA_DIR}/sites:/app/sites:Z -v ${DATA_DIR}/mysql:/var/lib/mysql:Z respond

# Use `docker start` if you have stopped it.
$ docker start respond
```

