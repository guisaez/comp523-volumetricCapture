### Infra Documentation

This corresponds to the different Kubernetes deployments that will be created once the projects is ran with `skaffold`.

1. `k8s`
    * Corresponds to the deployments that will be created both in in production and dv environments.
    * Each of the deployments is either created from the Dockerfile corresponding to each service or using images that already exists.
    * Each deployment also creates a service if the server is going to be connected to other containers.
    * The configuration file contains information about the environment variables used for the container such as `MONGO_URI`

2. `k8s-dev`
    * Ingress nginx load balancer configuration in a developer environment (current) while using docker. 

If this application where to be deployed a k8s-prod directory should be create with the cloud configuration.
