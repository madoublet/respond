# Respond CMS Docker Image
## Building from DockerFile
To build your own Image you need to copy `Dockerfile`, `env.example` and `vhost-config` into one directory. 
Modify the `env.example` to your needs (change password, jwt-token, ...). 
You may also modify `vhost-config.conf`.


Then start the following command inside the directory to create a image called `respond`.
``` bash
$ docker build -t respond .
```

## Starting a container from the docker image
After the image is ready, you can start a container from the docker image. 
 
```bash
$ docker run --name=web --restart=always -p 8088:80
$ -v /srv/respond/sites:/var/www/public/sites 
$ -v /srv/respond/resources:/var/www/resources 
$ -d respond
```

### Paramerter explanation
Run a container called `web` and let it start with the host `--restart=always`.
Map the container port `80` to `8080` on the host to make respond available on `http://hostdomain:8088`.
Map the `sites` and `resources` directories with `-v` from the container outside to host `/srv/respond/*` 
**Note:** `www-data` needs write permission to `/srv/respond/*` on the host
Start the container in `detached` mode and use our `respond` image.

### Tools
You can output apache error and access logs
```bash
$ docker logs web
```

Check your installation by navigating to `http://yourhostdomain:8088/install/`

## Summary
With this configuration you can easily upgrade your respond container. 
Since your data is saved outside of the container you can delete the container and recreate it with a new version. 