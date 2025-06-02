pipeline {
    agent any

    // 1) Dispara este pipeline automáticamente al hacer push a la rama main
    triggers {
        githubPush()
    }

    environment {
        // Ruta donde Nginx leerá los archivos estáticos
        DEPLOY_PATH = "/var/www/html/recuperacionNext"
        // Carpeta generada por next export
        BUILD_DIR   = "out"
        // Directorio de trabajo de este job en Jenkins
        WORKSPACE_DIR = "/var/lib/jenkins/workspace/${env.JOB_NAME}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Limpia por completo el workspace antes de cada build
                deleteDir()
                // Clona el repositorio en el directorio de trabajo
                git branch: 'main', url: 'https://github.com/Sergiogz29/recuperacionNext.git'
            }
        }

        stage('Install & Build') {
            steps {
                // Entra a la carpeta raíz (ya estamos en WORKSPACE)
                dir("${WORKSPACE_DIR}") {
                    // Ejecuta npm install y npm run build (output: export)
                    sh '''
                      echo "📦 Instalando dependencias..."
                      npm install

                      echo "⚙️ Ejecutando build y export estático..."
                      npm run build
                    '''
                }
            }
        }

        stage('Deploy to Nginx') {
            steps {
                script {
                    // Si la carpeta DEPLOY_PATH existe, la borramos y la volvemos a crear vacía
                    sh """
                      echo "🚚 Desplegando en ${DEPLOY_PATH}..."
                      # Borrar (si existiera) el directorio entero
                      sudo rm -rf ${DEPLOY_PATH}
                      # Crear la carpeta nuevamente vacía
                      sudo mkdir -p ${DEPLOY_PATH}

                      # Copiar todo el contenido de out/ a DEPLOY_PATH
                      sudo cp -r ${BUILD_DIR}/* ${DEPLOY_PATH}/

                      # Ajustar permisos: www-data:www-data (usuario que corre Nginx)
                      sudo chown -R www-data:www-data ${DEPLOY_PATH}
                      sudo chmod -R 755 ${DEPLOY_PATH}
                    """
                }
            }
        }

        stage('Reload Nginx') {
            steps {
                // Recarga la configuración de Nginx para servir los nuevos archivos
                sh 'sudo systemctl reload nginx || sudo service nginx reload'
            }
        }
    }

    post {
        success {
            echo '✅ ¡Despliegue exitoso!'
        }
        failure {
            echo '❌ El despliegue falló. Revisa los logs de Jenkins para más detalles.'
        }
    }
}
