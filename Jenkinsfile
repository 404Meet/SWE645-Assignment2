// Author: Meet Rajesh Popat
// Purpose: Builds the SWE 645 web application Docker image, pushes it to
// Docker Hub, and automatically deploys the new image to Kubernetes.

pipeline {
    agent any

    environment {
        DOCKERHUB_USER = '404meet'
        IMAGE_NAME = 'swe645-web'
        DEPLOYMENT_NAME = 'swe645-web-deployment'
        CONTAINER_NAME = 'swe645-web'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Application') {
            steps {
                sh '''
                    test -f index.html
                    test -f survey.html
                    test -f styles.css
                    test -f survey.js
                    test -f Dockerfile
                    test -f k8s/deployment.yaml
                    test -f k8s/service.yaml
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build(
                        "${DOCKERHUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER}"
                    )
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry(
                        'https://index.docker.io/v1/',
                        'docker-hub-creds'
                    ) {
                        docker.image(
                            "${DOCKERHUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER}"
                        ).push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'kubeconfig-id',
                        variable: 'KUBECONFIG'
                    )
                ]) {
                    sh '''
                        kubectl apply -f k8s/deployment.yaml
                        kubectl apply -f k8s/service.yaml

                        kubectl set image deployment/${DEPLOYMENT_NAME} \
                        ${CONTAINER_NAME}=${DOCKERHUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER}

                        kubectl rollout status deployment/${DEPLOYMENT_NAME} \
                        --timeout=180s
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'kubeconfig-id',
                        variable: 'KUBECONFIG'
                    )
                ]) {
                    sh '''
                        kubectl get deployments
                        kubectl get pods
                        kubectl get services
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'CI/CD pipeline failed. Check the stage logs.'
        }
    }
}