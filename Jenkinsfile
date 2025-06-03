pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DEPLOY_PATH   = "/var/www/html/recuperacionNext"
        BUILD_DIR     = "out"
        WORKSPACE_DIR = "/var/lib/jenkins/workspace/${env.JOB_NAME}"
    }

    stages {
        stage('Preparar Workspace') {
            steps {
                sh '''
                echo "🔐 Corrigiendo permisos del workspace..."
                sudo chown -R jenkins:jenkins "${WORKSPACE_DIR}" || true
                sudo chmod -R u+rwX "${WORKSPACE_DIR}"         || true

                echo "🧹 Limpiando el workspace..."
                rm -rf *
                '''
            }
        }

        stage('Clonar Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Sergiogz29/recuperacionNext.git'
            }
        }

        stage('Instalar dependencias y Build') {
            steps {
                sh '''
                echo "📦 Instalando dependencias..."
                npm install

                echo "⚙️ Ejecutando build de Next.js (output: export)..."
                npm run build || { echo "❌ Error en build"; exit 1; }

                echo "✅ Build finalizado con éxito"
                '''
            }
        }

        stage('Desplegar en Nginx') {
            steps {
                script {
                    if (fileExists("${BUILD_DIR}/index.html")) {
                        sh """
                        echo "🚚 Desplegando a ${DEPLOY_PATH}..."
                        sudo rm -rf ${DEPLOY_PATH}/*
                        sudo mkdir -p ${DEPLOY_PATH}
                        sudo cp -r ${BUILD_DIR}/* ${DEPLOY_PATH}/
                        sudo chown -R www-data:www-data ${DEPLOY_PATH}
                        sudo chmod -R 755 ${DEPLOY_PATH}
                        """
                    } else {
                        error "❌ No se encontró '${BUILD_DIR}/index.html'. El build falló."
                    }
                }
            }
        }

        stage('Reiniciar Nginx') {
            steps {
                sh 'sudo systemctl reload nginx || sudo service nginx reload'
            }
        }
    }

    post {
        success {
            echo '✅ ¡Despliegue completado y Nginx recargado!'
        }
        failure {
            echo '❌ Hubo un error en el pipeline. Revisa la consola de Jenkins.'
        }
    }
}
