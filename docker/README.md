[![](https://imagelayers.io/badge/neoalienson/respond6:latest.svg)](https://imagelayers.io/?images=neoalienson/respond6:latest 'Get your own badge on imagelayers.io')

# Respond CMS Docker Image

## The docker image
You can have the image by either pulling from DockerHub or building it yourself from
DockerFile locally. Update port forwarding in `-p 80:80` if required. 

### Building from DockerFile

``` bash
$ docker build -t respond .
```

### Pulling from DockerHub

```bash
$ docker pull neoalienson/respond6
$ docker tag neoalienson/respond6 respond
```

## Starting a container from the docker image
After the image is ready, you can start a container from the docker image. 
 
### Run without data volumes
```bash
$ docker run --name=respond -p 80:80 respond
```

### Run with data volume

Run below commands if you want to store site contents into your docker host instead of inside the docker image.
Please check [data volumes](https://docs.docker.com/engine/userguide/containers/dockervolumes/) for details.

``` bash
$ export DATA_DIR=${HOME}/respond-data
$ mkdir -p ${DATA_DIR}/sites 
$ mkdir -p ${DATA_DIR}/resources 
$ docker run --name=respond -p 80:80 \
-v ${DATA_DIR}/sites:/var/www/public/sites:Z \
-v ${DATA_DIR}/resources:/var/www/resources/:Z \
respond
```

