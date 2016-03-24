# Respond CMS Docker Image

## To Build

``` bash
$ docker build -t respond .
```

### To Run

Run below commands if you want to store mysql data and site content into your docker host instead of inside the docker image.
Please check [data volumes](https://docs.docker.com/engine/userguide/containers/dockervolumes/) for details.

``` bash
# run Respond CMS
$ DATA_DIR=${HOME}/respond-data
$ mkdir -p ${DATA_DIR}/sites 
$ mkdir -p ${DATA_DIR}/mysql 
$ docker run --name=respond -p 80:80 -v ${DATA_DIR}/sites:/app/sites:Z -v ${DATA_DIR}/mysql:/var/lib/mysql:Z respond

# Use `docker start` if you have stopped it.
$ docker start respond
```

