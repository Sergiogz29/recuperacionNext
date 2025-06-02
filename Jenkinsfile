pipeline {
    agent any

    triggers {
        githubPush() // Se disparará al hacer push a la rama main
    }

    environment {
        DEPLOY_PATH = "/var/www/html/reactasir"  // Donde Nginx servirá los archivos
        BUILD_DIR = "out"                        // Carpeta que generará `next export`
        WORKSPACE_DIR = "/var/lib/jenkins/workspace/${env.JOB_NAME}"
    }

    stages {
        stage('Preparar Workspace') {
            steps {
                script {
                    sh '''
                    echo "🔐 Corrigiendo permisos del workspace..."
                    sudo chown -R jenkins:jenkins "${WORKSPACE_DIR}" || true
                    sudo chmod -R u+rwX "${WORKSPACE_DIR}" || true

                    echo "🧹 Limpiando el workspace..."
                    rm -rf *
                    '''
                }
            }
        }

        stage('Clonar Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Sergiogz29/recuperacionNext.git'
            }
        }

        stage('Instalar dependencias y Build') {
            steps {
                dir('.') {
                    sh '''
                    echo "📦 Instalando dependencias..."
                    npm install

                    echo "⚙️ Ejecutando build..."
                    npm run build || { echo "❌ Error en build"; exit 1; }

                    echo "📤 Ejecutando export..."
                    npm run export || { echo "❌ Error en export"; exit 1; }

                    echo "✅ Build y export completados"
                    '''
                }
            }
        }

        stage('Desplegar en Nginx') {
            steps {
                script {
                    def buildPath = "${WORKSPACE_DIR}/${BUILD_DIR}"
                    if (fileExists("${buildPath}/index.html")) {
                        sh """
                        echo "🚚 Desplegando '${BUILD_DIR}' a '${DEPLOY_PATH}'..."
                        sudo rm -rf ${DEPLOY_PATH}/*

                        sudo mkdir -p ${DEPLOY_PATH}
                        sudo cp -r ${buildPath}/* ${DEPLOY_PATH}/

                        sudo chown -R www-data:www-data ${DEPLOY_PATH}
                        sudo chmod -R 755 ${DEPLOY_PATH}
                        """
                    } else {
                        error "❌ No se encontró '${BUILD_DIR}/index.html'. El build o export falló."
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
            echo '✅ ¡Despliegue automático en gzsergio.com completado!'
        }
        failure {
            echo '❌ El despliegue falló. Revisa los logs de Jenkins.'
        }
    }
}
