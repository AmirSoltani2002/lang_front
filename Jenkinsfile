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
        stage("Test and build frontend") {
            steps {
                sh '''
                    docker run --rm \
                      --user "$(id -u):$(id -g)" \
                      -e HOME=/tmp \
                      -v "$PWD:/workspace" \
                      -w /workspace \
                      node:22-alpine \
                      sh -c 'npm ci --cache /tmp/npm-cache && npm test && npm run build'
                '''
            }
        }

        stage("Build Docker image") {
            steps {
                sh 'docker build --build-arg "VITE_API_URL=$VITE_API_URL" --tag "$IMAGE_NAME:$IMAGE_TAG" .'
            }
        }
    }

}
