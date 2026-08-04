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
        string(
            name: "NPM_REGISTRY",
            defaultValue: "https://registry.npmjs.org/",
            description: "npm registry or reachable mirror, for example https://registry.npmmirror.com/"
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
                    tar -czf - \
                      --exclude=.git \
                      --exclude=node_modules \
                      --exclude=dist \
                      . | docker run --rm -i \
                      -e HOME=/tmp \
                      -e NPM_CONFIG_REGISTRY="$NPM_REGISTRY" \
                      node:22-alpine \
                      sh -c 'mkdir /workspace && tar -xzf - -C /workspace && cd /workspace && npm ci --cache /tmp/npm-cache && npm test && npm run build'
                '''
            }
        }

        stage("Build Docker image") {
            steps {
                sh 'docker build --build-arg "VITE_API_URL=$VITE_API_URL" --build-arg "NPM_REGISTRY=$NPM_REGISTRY" --tag "$IMAGE_NAME:$IMAGE_TAG" .'
            }
        }
    }

}
