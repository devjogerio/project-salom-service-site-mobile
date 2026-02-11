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
    fi
    
    # Tenta usar uma versão específica do Node se o NVM estiver disponível
    if command -v nvm &> /dev/null; then
        if [ -f ".nvmrc" ]; then
            nvm use &> /dev/null
            log "INFO" "Usando versão do Node definida no .nvmrc."
        elif nvm use 20 &> /dev/null; then
             log "INFO" "Usando Node v20 via NVM."
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
            log "WARN" "Arquivo .env não encontrado no Frontend. Criando a partir de .env.example..."
            cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env"
            log "SUCCESS" "Arquivo .env do Frontend criado."
        else
            log "ERROR" "Arquivo .env e .env.example não encontrados no Frontend!"
            # exit 1 # Não falhar se não tiver, mas avisar
        fi
    else
        log "INFO" "Arquivo .env do Frontend já existe."
    fi

    # Backend .env
    if [ ! -f "$BACKEND_DIR/.env" ]; then
        if [ -f "$BACKEND_DIR/.env.example" ]; then
            log "WARN" "Arquivo .env não encontrado no Backend. Criando a partir de .env.example..."
            cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
            log "SUCCESS" "Arquivo .env do Backend criado."
        else
             # Backend pode não ter .env obrigatório se usar defaults, mas vamos logar
             log "INFO" "Nenhum .env.example encontrado no Backend ou .env já existe."
        fi
    else
        log "INFO" "Arquivo .env do Backend já existe."
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
    
    log "SUCCESS" "Backend configurado e dependências instaladas."
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
    # Mata processos filhos do script atual
    pkill -P $$ 2>/dev/null
    log "SUCCESS" "Processos encerrados. Tchau!"
}

wait_for_backend() {
    log "INFO" "Aguardando Backend iniciar na porta $BACKEND_PORT..."
    local retries=30
    local wait_time=1
    
    for ((i=1; i<=retries; i++)); do
        if curl -s "http://127.0.0.1:$BACKEND_PORT/health" > /dev/null || curl -s "http://127.0.0.1:$BACKEND_PORT/docs" > /dev/null; then
            log "SUCCESS" "Backend iniciado com sucesso."
            return 0
        fi
        sleep $wait_time
    done
    
    log "ERROR" "Backend falhou ao iniciar dentro do tempo limite ($((retries * wait_time))s)."
    return 1
}

run_dev() {
    log "INFO" "Iniciando modo DESENVOLVIMENTO..."
    
    # Backend em background
    log "INFO" "Iniciando servidor Backend..."
    cd "$BACKEND_DIR" && source venv/bin/activate && uvicorn app.main:app --reload --port $BACKEND_PORT >> "$LOG_FILE" 2>&1 &
    
    cd "$FRONTEND_DIR"

    # Aguardar Backend
    wait_for_backend || exit 1

    # Frontend
    log "INFO" "Iniciando servidor Frontend na porta $FRONTEND_PORT..."
    
    # Abrir navegador
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
    npm run build >> "$LOG_FILE" 2>&1
    check_error "Falha no build do Frontend. Verifique o log."

    # Backend em background
    log "INFO" "Iniciando servidor Backend (Produção)..."
    cd "$BACKEND_DIR" && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port $BACKEND_PORT >> "$LOG_FILE" 2>&1 &
    
    cd "$FRONTEND_DIR"

    # Aguardar Backend
    wait_for_backend || exit 1

    # Frontend Start
    # Verifica se é exportação estática
    if grep -q "output: 'export'" next.config.mjs; then
        log "INFO" "Detectada configuração de exportação estática (output: 'export')."
        log "INFO" "Servindo arquivos estáticos da pasta 'out'..."
        
        if ! command -v npx &> /dev/null; then
            log "ERROR" "npx não encontrado. Não é possível servir os arquivos estáticos."
            exit 1
        fi
        
        # Abrir navegador
        if [[ "$OSTYPE" == "darwin"* ]]; then
            (sleep 2 && open "http://localhost:$FRONTEND_PORT") &
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if command -v xdg-open &> /dev/null; then
                 (sleep 2 && xdg-open "http://localhost:$FRONTEND_PORT") &
            fi
        fi

        npx serve out -p $FRONTEND_PORT
    else
        log "INFO" "Iniciando servidor Frontend (Start padrão)..."
        npm start
    fi
}

run_test() {
    log "INFO" "Iniciando modo TESTE..."
    
    # Backend Tests
    log "INFO" "Executando testes do Backend..."
    cd "$BACKEND_DIR" && source venv/bin/activate
    # Instalar deps de teste se necessário
    pip install pytest httpx >> "$LOG_FILE" 2>&1
    pytest >> "$LOG_FILE" 2>&1
    if [ $? -eq 0 ]; then
        log "SUCCESS" "Testes do Backend passaram."
    else
        log "ERROR" "Testes do Backend falharam. Verifique o log."
        exit 1
    fi
    
    cd "$FRONTEND_DIR"
    
    # Frontend Lint/Tests
    log "INFO" "Executando Lint do Frontend..."
    npm run lint
    check_error "Falha no Lint do Frontend."
    
    log "SUCCESS" "Todos os testes executados com sucesso."
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
