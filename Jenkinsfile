
// Builds both application images and deploys the Helm release to Kubernetes.

pipeline {
    agent any

    environment {
        DOCKER_USER = '404meet'
        NAMESPACE = 'swe645-hw3'
        RELEASE_NAME = 'survey'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                    docker build \
                      -t $DOCKER_USER/swe645-frontend:$BUILD_NUMBER \
                      ./frontend
                '''
            }
        }

        stage('Build Backend') {
            steps {
                sh '''
                    docker build \
                      -t $DOCKER_USER/swe645-backend:$BUILD_NUMBER \
                      ./backend
                '''
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | \
                          docker login -u "$DOCKER_USERNAME" --password-stdin

                        docker push \
                          $DOCKER_USER/swe645-frontend:$BUILD_NUMBER

                        docker push \
                          $DOCKER_USER/swe645-backend:$BUILD_NUMBER
                    '''
                }
            }
        }

        stage('Validate Helm Chart') {
            steps {
                sh '''
                    helm lint ./helm/student-survey

                    helm template $RELEASE_NAME \
                      ./helm/student-survey \
                      --set frontend.image.tag=$BUILD_NUMBER \
                      --set backend.image.tag=$BUILD_NUMBER \
                      > /dev/null
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl get namespace $NAMESPACE || \
                      kubectl create namespace $NAMESPACE

                    helm upgrade --install \
                      $RELEASE_NAME \
                      ./helm/student-survey \
                      --namespace $NAMESPACE \
                      --set frontend.image.tag=$BUILD_NUMBER \
                      --set backend.image.tag=$BUILD_NUMBER \
                      --wait \
                      --timeout 5m
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl rollout status \
                      deployment/survey-frontend \
                      -n $NAMESPACE

                    kubectl rollout status \
                      deployment/survey-backend \
                      -n $NAMESPACE

                    kubectl get pods -n $NAMESPACE
                    kubectl get services -n $NAMESPACE
                '''
            }
        }
    }
}
