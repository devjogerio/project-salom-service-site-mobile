#!/bin/bash

# ==============================================================================
# Script de Automação de Execução - Salão de Beleza (Project Salom)
# ==============================================================================
# Este script automatiza o processo de setup, build e execução da aplicação.
# Suporta modos de desenvolvimento e produção.
#
# Uso: ./start_project.sh [dev|prod|test]
# Padrão: dev
# ==============================================================================

# --- Configurações ---
LOG_FILE="project_startup.log"
BACKEND_DIR="$(pwd)/backend"
FRONTEND_DIR="$(pwd)"
BACKEND_PORT=8000
FRONTEND_PORT=3000

# Cores para saída no terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Limpar log anterior
echo "=== Início da Execução: $(date) ===" > "$LOG_FILE"

# --- Funções Auxiliares ---

log() {
    local type="$1"
    local message="$2"
    local color="$NC"
    
    case "$type" in
        "INFO") color="$BLUE" ;;
        "SUCCESS") color="$GREEN" ;;
        "WARN") color="$YELLOW" ;;
        "ERROR") color="$RED" ;;
    esac

    echo -e "${color}[${type}]${NC} ${message}"
    echo "[${type}] $(date '+%H:%M:%S') - ${message}" >> "$LOG_FILE"
}

check_error() {
    if [ $? -ne 0 ]; then
        log "ERROR" "$1"
        exit 1
    fi
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        log "ERROR" "Comando '$1' não encontrado. Por favor, instale-o para continuar."
        return 1
    fi
    return 0
}

# --- Limpeza de Portas ---
kill_ports() {
    log "INFO" "Verificando portas ocupadas..."
    local ports=($BACKEND_PORT $FRONTEND_PORT)
    for port in "${ports[@]}"; do
        pid=$(lsof -ti:$port)
        if [ -n "$pid" ]; then
            log "WARN" "Porta $port está em uso pelo PID $pid. Matando processo..."
            kill -9 $pid 2>/dev/null || true
        fi
    done
}

# --- Carregamento de Ambiente (NVM) ---
load_nvm() {
    log "INFO" "Tentando carregar NVM..."
    export NVM_DIR="$HOME/.nvm"
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        . "$NVM_DIR/nvm.sh"
        log "SUCCESS" "NVM carregado."
    elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
        . "/usr/local/opt/nvm/nvm.sh"
        log "SUCCESS" "NVM carregado (Homebrew)."
    else
        log "WARN" "NVM não encontrado nos caminhos padrão. Assumindo Node.js no PATH."
        return
    fi
    
    # Tenta usar uma versão específica do Node
    if command -v nvm &> /dev/null; then
        if nvm use 20.20.0 &> /dev/null; then
             log "INFO" "Usando Node v20.20.0 via NVM."
        elif nvm use default &> /dev/null; then
             log "INFO" "Usando Node default via NVM."
        elif nvm use node &> /dev/null; then
             log "INFO" "Usando Node latest via NVM."
        else
             log "WARN" "Não foi possível selecionar uma versão do Node via NVM. Verifique se há alguma instalada."
        fi
    fi
}

# --- Verificações de Dependências ---
check_dependencies() {
    log "INFO" "Verificando dependências do sistema..."

    # Python
    check_command "python3" || exit 1
    log "INFO" "Python encontrado: $(python3 --version)"

    # Node.js
    load_nvm
    check_command "node" || exit 1
    check_command "npm" || exit 1
    log "INFO" "Node.js encontrado: $(node --version)"
    log "INFO" "NPM encontrado: $(npm --version)"
}

# --- Configuração de Variáveis de Ambiente ---
setup_env() {
    log "INFO" "Configurando variáveis de ambiente..."

    # Frontend .env
    if [ ! -f "$FRONTEND_DIR/.env" ]; then
        if [ -f "$FRONTEND_DIR/.env.example" ]; then
            log "WARN" "Arquivo .env não encontrado. Criando a partir de .env.example..."
            cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env"
            log "SUCCESS" "Arquivo .env criado. Verifique as configurações se necessário."
        else
            log "ERROR" "Arquivo .env e .env.example não encontrados no Frontend!"
            exit 1
        fi
    else
        log "INFO" "Arquivo .env do Frontend já existe."
    fi
}

# --- Setup do Backend ---
setup_backend() {
    log "INFO" "Configurando Backend (Python/FastAPI)..."
    cd "$BACKEND_DIR" || exit 1

    # Virtualenv
    if [ ! -d "venv" ]; then
        log "INFO" "Criando ambiente virtual (venv)..."
        python3 -m venv venv
        check_error "Falha ao criar venv."
    fi

    # Ativar venv e instalar deps
    source venv/bin/activate
    log "INFO" "Instalando dependências do Backend..."
    pip install -r requirements.txt >> "$LOG_FILE" 2>&1
    check_error "Falha ao instalar dependências do Backend."
    
    # Setup inicial do banco de dados (se necessário)
    # O código atual já popula no startup via lifespan, então apenas logamos.
    log "SUCCESS" "Backend configurado."
    cd "$FRONTEND_DIR" || exit 1
}

# --- Setup do Frontend ---
setup_frontend() {
    log "INFO" "Configurando Frontend (Next.js)..."
    
    if [ ! -d "node_modules" ]; then
        log "INFO" "Instalando dependências do Frontend (pode demorar)..."
        npm install >> "$LOG_FILE" 2>&1
        check_error "Falha ao instalar dependências do Frontend."
    else
        log "INFO" "Dependências do Frontend parecem estar instaladas."
    fi
    log "SUCCESS" "Frontend configurado."
}

# --- Funções de Execução ---

cleanup() {
    log "WARN" "Encerrando processos..."
    kill $(jobs -p) 2>/dev/null
    log "SUCCESS" "Processos encerrados. Tchau!"
}

run_dev() {
    log "INFO" "Iniciando modo DESENVOLVIMENTO..."
    
    # Backend em background
    log "INFO" "Iniciando servidor Backend na porta $BACKEND_PORT..."
    cd "$BACKEND_DIR" && source venv/bin/activate && uvicorn app.main:app --reload --port $BACKEND_PORT >> "$LOG_FILE" 2>&1 &
    BACKEND_PID=$!
    cd "$FRONTEND_DIR"

    # Aguardar Backend subir (health check)
    log "INFO" "Aguardando Backend iniciar (pode levar alguns segundos)..."
    for i in {1..30}; do
        if curl -s "http://127.0.0.1:$BACKEND_PORT/health" > /dev/null; then
            log "SUCCESS" "Backend iniciado com sucesso."
            break
        fi
        if [ $i -eq 30 ]; then
            log "ERROR" "Backend falhou ao iniciar dentro do tempo limite. Verifique o log."
            kill $BACKEND_PID 2>/dev/null
            exit 1
        fi
        sleep 1
    done

    # Frontend
    log "INFO" "Iniciando servidor Frontend na porta $FRONTEND_PORT..."
    
    # Abrir navegador automaticamente
    if [[ "$OSTYPE" == "darwin"* ]]; then
        (sleep 5 && open "http://localhost:$FRONTEND_PORT") &
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v xdg-open &> /dev/null; then
             (sleep 5 && xdg-open "http://localhost:$FRONTEND_PORT") &
        fi
    fi

    npm run dev:next
}

run_prod() {
    log "INFO" "Iniciando modo PRODUÇÃO..."

    # Build Frontend
    log "INFO" "Compilando Frontend (Build)..."
    npm run build
    check_error "Falha no build do Frontend."

    # Backend em background
    log "INFO" "Iniciando servidor Backend (Produção)..."
    cd "$BACKEND_DIR" && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port $BACKEND_PORT >> "$LOG_FILE" 2>&1 &
    BACKEND_PID=$!
    cd "$FRONTEND_DIR"

    # Aguardar Backend subir (health check)
    log "INFO" "Aguardando Backend iniciar (pode levar alguns segundos)..."
    for i in {1..30}; do
        if curl -s "http://127.0.0.1:$BACKEND_PORT/health" > /dev/null; then
            log "SUCCESS" "Backend iniciado com sucesso."
            break
        fi
        if [ $i -eq 30 ]; then
            log "ERROR" "Backend falhou ao iniciar dentro do tempo limite. Verifique o log."
            kill $BACKEND_PID 2>/dev/null
            exit 1
        fi
        sleep 1
    done

    # Frontend Start
    log "INFO" "Iniciando servidor Frontend (Start)..."
    npm start
}

run_test() {
    log "INFO" "Iniciando modo TESTE..."
    log "WARN" "Scripts de teste ainda não definidos. Apenas verificando lint."
    npm run lint
}

# --- Fluxo Principal ---

# Trap para matar processos filhos ao sair
trap cleanup EXIT INT TERM

# Argumentos
MODE=${1:-dev}

kill_ports
check_dependencies
setup_env
setup_backend
setup_frontend

case "$MODE" in
    "dev")
        run_dev
        ;;
    "prod")
        run_prod
        ;;
    "test")
        run_test
        ;;
    *)
        log "ERROR" "Modo inválido: $MODE. Use 'dev', 'prod' ou 'test'."
        exit 1
        ;;
esac
