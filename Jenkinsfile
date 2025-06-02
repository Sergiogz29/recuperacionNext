pipeline {
    agent any

    triggers {
        githubPush()  // Dispara la ejecución al hacer push en GitHub (main)
    }

    environment {
        // Ruta donde Nginx servirá el contenido final:
        DEPLOY_PATH = "/var/www/html/recuperacionNext"
        // Carpeta generada por `next export`
        BUILD_DIR = "out"
        // Variable de workspace de Jenkins; no la usamos dentro del script shell con sudo
        WORKSPACE_DIR = "${env.WORKSPACE}"
    }

    stages {
        stage('Preparar Workspace') {
            steps {
                script {
                    // Por si acaso quedan restos de compilaciones anteriores:
                    sh """
                      echo "🔐 Corrigiendo permisos del workspace..."
                      sudo chown -R jenkins:jenkins "${WORKSPACE_DIR}" || true
                      sudo chmod -R u+rwX "${WORKSPACE_DIR}" || true

                      echo "🧹 Limpiando el workspace..."
                      rm -rf *
                    """
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
                sh """
                  echo "📦 Instalando dependencias..."
                  npm install

                  echo "⚙️ Ejecutando build y export con Next.js..."
                  npm run build    || { echo "❌ Error en npm run build"; exit 1; }
                  npm run export   || { echo "❌ Error en npm run export"; exit 1; }

                  echo "✅ Build + Export completados"
                """
            }
        }

        stage('Desplegar en Nginx') {
            steps {
                script {
                    if (fileExists("${BUILD_DIR}/index.html")) {
                        sh """
                          echo "🚚 Desplegando en ${DEPLOY_PATH}..."
                          # Limpia la carpeta de despliegue
                          sudo rm -rf ${DEPLOY_PATH}/*

                          # Crea la carpeta si no existe
                          sudo mkdir -p ${DEPLOY_PATH}

                          # Copia todos los archivos generados a la carpeta de Nginx
                          sudo cp -r ${BUILD_DIR}/* ${DEPLOY_PATH}/

                          # Ajusta permisos
                          sudo chown -R www-data:www-data ${DEPLOY_PATH}
                          sudo chmod -R 755 ${DEPLOY_PATH}
                        """
                    } else {
                        error "❌ No se encontró ${BUILD_DIR}/index.html. El export probablemente falló."
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
            echo '✅ ¡Despliegue exitoso!'
        }
        failure {
            echo '❌ El despliegue falló. Revisa los logs en Jenkins.'
        }
    }
}
