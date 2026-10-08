# SWE 645 – Assignment 2
## Docker, Kubernetes, Rancher, and Jenkins CI/CD Deployment

**Student:** Meet Rajesh Popat  
**Course:** SWE 645 – Component-Based Software Development  
**University:** George Mason University  
**GitHub Repository:** https://github.com/404Meet/SWE645-Assignment2  
**Docker Hub Repository:** `404meet/swe645-web`

---

## 1. Project Overview

This project extends the web application developed in Assignment 1 by containerizing it with Docker, deploying it on Kubernetes, and automating the build and deployment process using Jenkins.

The application is a static web application built using HTML, CSS, and JavaScript. It is served using Nginx inside a Docker container.

The overall DevOps workflow is:

```text
Developer
   |
   | git push
   v
GitHub
   |
   v
Jenkins CI/CD
   |
   | docker build
   v
Docker Image
   |
   | docker push
   v
Docker Hub
   |
   | kubectl deployment
   v
Kubernetes
   |
   +-- Pod 1
   +-- Pod 2
   +-- Pod 3
   |
   v
NodePort Service
   |
   v
Public Web Application
```

---

## 2. Technologies Used

- HTML5
- CSS3
- JavaScript
- Git
- GitHub
- Docker
- Docker Hub
- AWS EC2
- Rancher
- Kubernetes / RKE2
- kubectl
- Jenkins
- Nginx

---

## 3. Project Structure

```text
SWE645-Assignment2/
|
├── index.html
├── survey.html
├── error.html
├── styles.css
├── survey.js
|
├── assets/
│   └── image.png
|
├── Dockerfile
├── .dockerignore
├── .gitignore
├── Jenkinsfile
|
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
|
└── README.md
```

---

## 4. Application

The web application contains:

- Personal SWE 645 homepage
- Student Survey page
- Client-side form validation
- Custom error page
- GMU-inspired styling
- Responsive design

The application is static and does not require a backend application server.

---

## 5. Docker Containerization

The application is containerized using Nginx.

The `Dockerfile` uses the Nginx Alpine image and copies the website files into the Nginx web root.

```dockerfile
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY index.html survey.html error.html styles.css survey.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Build the Docker image

```bash
docker build -t 404meet/swe645-web:0.1 .
```

### Run locally

```bash
docker run -d -p 8080:80 404meet/swe645-web:0.1
```

Open:

```text
http://localhost:8080
```

### Push to Docker Hub

```bash
docker login
docker push 404meet/swe645-web:0.1
```

Docker Hub stores the built application image so Kubernetes can pull and run it.

---

## 6. AWS EC2 Environment

A single Ubuntu EC2 instance is used for this assignment.

The instance runs:

```text
AWS EC2
├── Docker
├── Rancher
├── Kubernetes / RKE2
├── kubectl
└── Jenkins
```

Using one EC2 instance keeps the homework environment simple and reduces AWS resource usage.

### Required Security Group Ports

```text
22      SSH
80      HTTP
443     Rancher HTTPS
8080    Jenkins
30080   Kubernetes Web Application
```

---

## 7. Rancher and Kubernetes

Rancher is used to create and manage the Kubernetes cluster.

The EC2 instance is configured with the following Kubernetes node roles:

```text
etcd
Control Plane
Worker
```

Verify the cluster using:

```bash
kubectl get nodes
```

The node should show `Ready` status.

---

## 8. Kubernetes Deployment

The Kubernetes deployment is defined in:

```text
k8s/deployment.yaml
```

The deployment runs three replicas of the website container:

```yaml
spec:
  replicas: 3
```

The application image is pulled from Docker Hub:

```yaml
image: 404meet/swe645-web:0.1
```

Deploy manually using:

```bash
kubectl apply -f k8s/deployment.yaml
```

Verify:

```bash
kubectl get deployments
kubectl get pods
```

Three application pods should be running.

---

## 9. Kubernetes Service

The application is exposed using a Kubernetes NodePort Service defined in:

```text
k8s/service.yaml
```

The service uses:

```yaml
type: NodePort
```

and exposes the application through:

```yaml
nodePort: 30080
```

The request flow is:

```text
Browser
   |
   v
EC2 Public IP : 30080
   |
   v
Kubernetes Service
   |
   v
One of the 3 Pods
   |
   v
Nginx : 80
   |
   v
Website
```

The application can be accessed using:

```text
http://<EC2-PUBLIC-IP>:30080
```

Current development/demo address:

```text
http://54.196.87.89:30080
```

> Note: A normal EC2 public IPv4 address can change after stopping and restarting the instance. An Elastic IP is recommended for a stable final demonstration URL.

---

## 10. Kubernetes Resiliency

The deployment maintains three running pods at all times.

Verify:

```bash
kubectl get pods
```

Delete one pod:

```bash
kubectl delete pod <POD-NAME>
```

Then monitor:

```bash
kubectl get pods -w
```

Kubernetes automatically creates a replacement pod because the desired replica count is three.

---

## 11. Jenkins CI/CD

Jenkins runs on the same EC2 instance.

Jenkins URL:

```text
http://<EC2-PUBLIC-IP>:8080
```

Current development/demo address:

```text
http://54.196.87.89:8080
```

The Jenkins pipeline is defined in:

```text
Jenkinsfile
```

### Pipeline Stages

The pipeline performs the following:

```text
1. Checkout source code from GitHub
2. Verify required application files
3. Build a Docker image
4. Push the Docker image to Docker Hub
5. Deploy the new image to Kubernetes
6. Verify the Kubernetes deployment
```

Jenkins creates Docker image tags using the Jenkins build number.

Example:

```text
404meet/swe645-web:1
404meet/swe645-web:2
404meet/swe645-web:3
```

---

## 12. Jenkins Credentials

Two Jenkins credentials are used.

### Docker Hub

```text
Credential ID: docker-hub-creds
Type: Username with password
Username: 404meet
Password: Docker Hub Personal Access Token
```

### Kubernetes

```text
Credential ID: kubeconfig-id
Type: Secret file
File: Kubernetes kubeconfig
```

No passwords, tokens, `.pem` files, or kubeconfig credentials are committed to GitHub.

---

## 13. Automatic CI/CD Flow

After the initial setup, application deployment is automated.

A typical update works as follows:

```text
1. Modify application code
2. Commit the changes
3. Push to GitHub
4. Jenkins detects the repository change
5. Jenkins checks out the latest source
6. Jenkins builds a new Docker image
7. Jenkins pushes the image to Docker Hub
8. Jenkins updates the Kubernetes Deployment
9. Kubernetes performs a rolling update
10. The updated website becomes available
```

Example Git commands:

```bash
git add .
git commit -m "Update website"
git push
```

---

## 14. Jenkins Poll SCM

The Jenkins Pipeline can be configured to monitor GitHub using Poll SCM.

Example schedule:

```text
* * * * *
```

This checks the repository approximately every minute and starts a new build when a commit is detected.

---

## 15. Useful Kubernetes Commands

### View cluster nodes

```bash
kubectl get nodes
```

### View deployments

```bash
kubectl get deployments
```

### View pods

```bash
kubectl get pods
```

### Watch pods

```bash
kubectl get pods -w
```

### View services

```bash
kubectl get services
```

### Apply Kubernetes files

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Check rollout status

```bash
kubectl rollout status deployment/swe645-web-deployment
```

### View deployment details

```bash
kubectl describe deployment swe645-web-deployment
```

---

## 16. Local Kubernetes Kubeconfig

When working directly on the EC2 instance, the local RKE2 kubeconfig can be used.

```bash
sudo kubectl --kubeconfig /etc/rancher/rke2/rke2.yaml get nodes
```

It can also be copied for the Ubuntu user:

```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/rke2/rke2.yaml ~/.kube/config
sudo chown ubuntu:ubuntu ~/.kube/config
chmod 600 ~/.kube/config
```

Then:

```bash
kubectl get nodes
```

---

## 17. Complete System Flow

### Development / Deployment Flow

```text
Mac
 |
 | git push
 v
GitHub
 |
 | source checkout
 v
Jenkins
 |
 | docker build
 v
Docker Image
 |
 | docker push
 v
Docker Hub
 |
 | kubectl update
 v
Kubernetes Deployment
 |
 +--> Pod 1
 +--> Pod 2
 +--> Pod 3
```

### Runtime User Flow

```text
Browser
   |
   | HTTP request
   v
EC2 Public IP : 30080
   |
   v
Kubernetes NodePort Service
   |
   v
Available Pod
   |
   v
Nginx : 80
   |
   v
HTML / CSS / JavaScript
```

Rancher is used to manage Kubernetes, while Jenkins is used to automate application deployment. Neither Rancher nor Jenkins is directly in the normal website request path.

---

## 18. Verification Checklist

```text
[ ] GitHub contains all source files
[ ] Dockerfile exists
[ ] Jenkinsfile exists
[ ] deployment.yaml exists
[ ] service.yaml exists
[ ] Docker image exists on Docker Hub
[ ] Kubernetes node is Ready
[ ] Deployment shows 3/3 replicas
[ ] Three pods are Running
[ ] Kubernetes Service exposes NodePort 30080
[ ] Website opens using the EC2 public URL
[ ] Deleted pod is automatically replaced
[ ] Jenkins pipeline completes successfully
[ ] Git change automatically triggers Jenkins
[ ] New Docker image is pushed
[ ] Updated website appears after Kubernetes rollout
```

---

## 19. Final CI/CD Summary

```text
GitHub
   ↓
Jenkins
   ↓
Docker Build
   ↓
Docker Hub
   ↓
Kubernetes Deployment
   ↓
3 Running Pods
   ↓
NodePort Service
   ↓
Public AWS Website
```

This project demonstrates containerization, container orchestration, resiliency, automated builds, and automated deployment using a complete CI/CD pipeline.
