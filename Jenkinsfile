pipeline {
    agent any

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
            steps {
                sh "npm ci"
            }
        }

        stage("Test") {
            steps {
                sh "npm test"
            }
        }

        stage("Build frontend") {
            steps {
                sh "npm run build"
            }
        }

        stage("Build Docker image") {
            steps {
                sh 'docker build --build-arg "VITE_API_URL=$VITE_API_URL" --tag "$IMAGE_NAME:$IMAGE_TAG" .'
            }
        }
    }

    post {
        always {
            sh "node --version || true"
            sh "docker image rm ${IMAGE_NAME}:${IMAGE_TAG} || true"
            deleteDir()
        }
    }
}
