pipeline {
    agent none

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    parameters {
        string(
            name: "VITE_API_URL",
            defaultValue: "http://localhost:8000/api",
            description: "Public API URL compiled into the frontend image"
        )
    }

    environment {
        IMAGE_NAME = "language-flashcards-frontend"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage("Install dependencies") {
            agent {
                docker {
                    image "node:22-alpine"
                    reuseNode true
                }
            }
            steps {
                sh "npm ci"
            }
        }

        stage("Test") {
            agent {
                docker {
                    image "node:22-alpine"
                    reuseNode true
                }
            }
            steps {
                sh "npm test"
            }
        }

        stage("Build frontend") {
            agent {
                docker {
                    image "node:22-alpine"
                    reuseNode true
                }
            }
            steps {
                sh "npm run build"
            }
        }

        stage("Build Docker image") {
            agent {
                docker {
                    image "docker:27-cli"
                    args "-v /var/run/docker.sock:/var/run/docker.sock"
                    reuseNode true
                }
            }
            steps {
                sh 'docker build --build-arg "VITE_API_URL=$VITE_API_URL" --tag "$IMAGE_NAME:$IMAGE_TAG" .'
            }
        }
    }

}
