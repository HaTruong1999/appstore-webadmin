def agentLabel	// Dùng để phân chia jenkins node
def version	= ""    // Tách version nếu có trên branch name
if (BRANCH_NAME == "master") {
    agentLabel = "demo"    // tránh việc build nhánh master trên jenkins master
} else {
    try {
            version = TAG_NAME    // Trường hợp build tag
        }
        catch (exc) {
            agentLabel = BRANCH_NAME
        }
}
if ( version != null ) {
    agentLabel = "demo"      // Nếu build tag thì dùng node build release
} else {
    agentLabel = "demo"
}
def namespace_K8S = ""	// Namespace trên K8S
if (BRANCH_NAME == "master") {
    namespace_K8S = "default"
}
if (BRANCH_NAME == "dev") {
    namespace_K8S = "gotalk-dev"
}
if (BRANCH_NAME == "demo") {
    namespace_K8S = "gotalk-demo"
}


pipeline {
    agent { label agentLabel }    // Chia tải dựa trên label(branch name)
    options { disableConcurrentBuilds() }   // Disable multitask build
    environment {
        project = "vnpt-gotalk/admin-site"   //#################### Định nghĩa project name ####################
        nexus_repo_name = "IT.KV2.Raw.STM-Hosted"    // Nexus repository name
        routing = "./"
        //nexus_registry = "crelease.devops.vnptit2.vn:10108"    // Nexus repository Registry
        nexus_registry = "crelease.devops.vnpt.vn:10123"    // Nexus repository Registry
        NEXUS = credentials('NEXUS')
        NEXUSHUB = credentials('NEXUSHUB')
        deployment = "vnpt-gotalk-admin-site"
    }
    stages {
        stage('Prepare') {
            steps {
                echo 'Prepare ... from ' + env.Server_IP + ' - build-numer: ' + env.BUILD_ID
                echo 'Prepare from source: ' + env.WORKSPACE
                echo 'Prepare version: ' + version
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script{
                    echo 'Skip SonarQube Scan'
                }
            }
        }
        stage('Build Docker images') {
            steps {
                script {
                    echo '##### Build docker file for ' + env.BRANCH_NAME + ' branch.'
                    def buildFile = fileExists './build.sh'
                    if ( buildFile ) {
                        sh "/bin/bash ./build.sh ${project} $BRANCH_NAME Dockerfile ${nexus_registry} ${NEXUSHUB_USR} ${NEXUSHUB_PSW} ${version}"
                    } else {
                        echo "Can not found build.sh file"
                    }
                }
            }
        }
       stage('Nexus') {
            steps {
                script {
                    echo 'Upload source code to Sonatype Nexus Repository Manager ' + project
                }
            }
        }
        stage('Re-Deploy') {
			steps {
                script {
                    echo 'Re-Deploy ' + env.BRANCH_NAME + ' branch ...'
                    def buildFile = fileExists './deploy_kube.sh'
                    if ( buildFile ) {
                        sh "/bin/bash ./deploy_kube.sh $BRANCH_NAME ${deployment} ${namespace_K8S}"
                    } else {
                        echo "Can not found ./deploy_kube.sh file"
                    }
                }
            }
        }
        stage('Test') {
            steps {
                echo '##### Skip Testing..'
            }
        }
    }
}
