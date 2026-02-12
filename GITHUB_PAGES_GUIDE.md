# Guia de Implantação no GitHub Pages

Este guia detalha o processo de configuração, desenvolvimento e implantação do projeto **Salom Service Site Mobile** no GitHub Pages utilizando Next.js e GitHub Actions.

## 📋 Pré-requisitos

- **Node.js**: Versão 20 ou superior.
- **Git**: Instalado e configurado.
- **Conta no GitHub**: Com permissão de escrita no repositório.

## 🚀 Configuração Inicial

1.  **Clone o Repositório**:
    ```bash
    git clone https://github.com/devjogerio/project-salom-service-site-mobile.git
    cd project-salom-service-site-mobile
    ```

2.  **Instale as Dependências**:
    ```bash
    npm ci
    # Ou se preferir: npm install
    ```
    > **Nota**: `npm ci` é recomendado para ambientes de CI/CD pois usa o `package-lock.json` estrito.

## 💻 Desenvolvimento Local

Para rodar o projeto localmente e visualizar as alterações em tempo real:

```bash
npm run dev
```
O servidor iniciará em `http://localhost:3000`.

### Testando a Build de Produção Localmente

Para simular o ambiente de produção (estático):

```bash
npm run build
npx serve@latest out
```

## ⚙️ Configurações do GitHub Pages

O projeto está configurado para deploy automático via **GitHub Actions**.

### 1. Arquivo `next.config.mjs`
As seguintes configurações são cruciais para o funcionamento no GitHub Pages:

- **`output: 'export'`**: Gera arquivos estáticos HTML/CSS/JS na pasta `out`.
- **`basePath`**: Define o subcaminho do repositório (ex: `/project-salom-service-site-mobile`). Isso garante que os links e assets carreguem corretamente.
- **`images: { unoptimized: true }`**: O componente `next/image` padrão requer um servidor, o que não existe no GitHub Pages. Esta opção desativa a otimização automática para permitir o uso de imagens estáticas.

### 2. Workflow do GitHub Actions (`.github/workflows/nextjs.yml`)
O arquivo de workflow automatiza o processo:
1.  Instala dependências (`npm ci`).
2.  Realiza o build do Next.js (`npm run build`).
3.  Cria o arquivo `.nojekyll` na pasta de saída (impede que o GitHub ignore arquivos que começam com `_` como `_next`).
4.  Faz o upload do artefato e deploy.

## 🛠️ Passo a Passo para Deploy

1.  **Commit e Push**:
    Qualquer push na branch `main` (ou `master`) acionará o workflow automaticamente.
    ```bash
    git add .
    git commit -m "feat: novas atualizações"
    git push origin main
    ```

2.  **Verificar a Action**:
    - Vá até a aba **Actions** no repositório do GitHub.
    - Clique no workflow em execução.
    - Aguarde a conclusão das etapas "Build" e "Deploy".

3.  **Acessar o Site**:
    - Após o sucesso, o site estará disponível em:
      `https://devjogerio.github.io/project-salom-service-site-mobile/`

## ⚠️ Solução de Problemas Comuns

### Erro 404 em Assets (CSS/JS não carrega)
- **Causa**: O `basePath` no `next.config.mjs` pode estar incorreto.
- **Solução**: Verifique se a constante `repoName` corresponde exatamente ao nome do seu repositório no GitHub.

### Imagens Quebradas
- **Causa**: Caminhos de imagem não utilizam o `basePath` ou a otimização de imagem está ativa.
- **Solução**: Certifique-se de que `images.unoptimized = true` está configurado e, se usar tags `<img>` normais, prefixe o caminho com o `basePath`. O componente `<Image />` do Next.js geralmente lida com isso automaticamente se configurado corretamente.

### Erro "Jekyll is not supported"
- **Causa**: O GitHub Pages tenta processar o site como Jekyll e ignora pastas `_next`.
- **Solução**: Garanta que o passo de criação do arquivo `.nojekyll` exista no workflow ou crie-o manualmente na pasta `public`.

## 📦 Estrutura de Pastas Relevante

```
/
├── .github/workflows/nextjs.yml  # Configuração do Pipeline de Deploy
├── app/                          # Código fonte da aplicação (Next.js App Router)
├── public/                       # Arquivos estáticos públicos
├── next.config.mjs               # Configurações de build e exportação
├── package.json                  # Scripts e dependências
└── GITHUB_PAGES_GUIDE.md         # Este arquivo
```
