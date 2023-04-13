## Guide to Run and Test Application in Development Environment

1. Make sure you install `Docker Desktop`
    * [Get Docker](https://docs.docker.com/get-docker/)
    * Make sure to login with with the team credentials.
        * `username`: teamg2023
        * `password`: TeamG2023
2. In your terminal verify that `docker CLI` is installed.
```shell
docker --version
```
3. Login to the `docker CLI` using the following command.
```shell
docker login

// This should indicate you are already authenticated
```
4. Verify  `kubectl` was installed with Docker Desktop
```shell
kubectl version --short
```
5. Make sure that in Docker Desktop Kubernetes is enabled.
![Kubernetes Enabled](./images/kubernetes_enabled.png)
6. You should see that Kubernetes is running when starting Docker Client. (Top right of your screen for MacOS)
![Kubernetes Running](./images/kubernetes_running.png)
7. Install Skaffold
[Skaffold Setup](https://skaffold.dev/docs/install/)


### Context Environment

1. Verify your `kubectl` context using the following command.
```shell
kubectl config current-context

// docker-desktop
```
2. Create JWT secret within the context
```shell
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=volumetric-capture-523-jwt
```
3. Start and Ingress-Inginx Controller 
```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.7.0/deploy/static/provider/cloud/deploy.yaml
```
4. Verify `ingress-nginx` was created
```shell
kubectl get pods --namespace=ingress-nginx

NAME                                        READY   STATUS      RESTARTS       AGE
ingress-nginx-admission-create-s87ql        0/1     Completed   0              5d19h
ingress-nginx-admission-patch-qphfl         0/1     Completed   1              5d19h
ingress-nginx-controller-7d9674b7cf-2nwgg   1/1     Running     8 (167m ago)   5d19h
```
5. Modify your `etc/host` file.
    * Add the following line to the file
    ```plaintext
    127.0.0.1 volumetric.dev
    ```

## Running the Application

1. In a separate terminal window run the following.
```
kubectl port-forward --namespace=ingress-nginx service/ingress-nginx-controller 8080:80
```
2. Open a second terminal window and run the following command.
```shell
skaffold dev
```

After all deployments have initialized, you will be able to access the application at: [http://volumetric.dev](http://volumetric.dev)
