# Guia de Configuração do GitHub Pages para Project Salom Service

Este guia detalha o processo de configuração, build e deploy da aplicação Next.js no GitHub Pages utilizando GitHub Actions.

## 1. Pré-requisitos e Verificações Iniciais

*   **Conta GitHub**: Acesso administrativo ao repositório.
*   **Visibilidade**: 
    *   **Público**: GitHub Pages é gratuito.
    *   **Privado**: Requer plano GitHub Pro/Team/Enterprise.
*   **Permissões**: É necessário ter permissão de `Admin` ou `Maintainer` para alterar configurações do repositório.

## 2. Preparação do Projeto (Next.js)

Para que o Next.js funcione no GitHub Pages (hospedagem estática), três configurações são cruciais no arquivo `next.config.mjs`:

1.  **Exportação Estática**: `output: 'export'`
2.  **Caminho Base**: `basePath` (pois o site roda em `user.github.io/repo-name`)
3.  **Imagens**: `images.unoptimized: true` (o servidor de otimização de imagens do Next.js não roda no Pages)

### Exemplo de Configuração (`next.config.mjs`)

```javascript
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'project-salom-service-site-mobile'; // Nome exato do seu repositório

const nextConfig = {
  // Gera HTML/CSS/JS estático na pasta 'out'
  output: isProd ? 'export' : undefined,
  
  // Define a subpasta do repositório na URL
  basePath: isProd ? `/${repoName}` : '',
  
  // Corrige links de assets (CSS, JS, Imagens)
  assetPrefix: isProd ? `/${repoName}/` : '',
  
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

## 3. Configuração do Workflow (GitHub Actions)

Em vez de fazer build manual e push para uma branch, usamos **GitHub Actions** para automatizar tudo.

### Arquivo: `.github/workflows/nextjs.yml`

Certifique-se de que este arquivo existe. Ele define os passos:
1.  **Checkout**: Baixa o código.
2.  **Setup Node**: Instala o Node.js.
3.  **Build**: Roda `npm run build` (que gera a pasta `out`).
4.  **Upload Artifact**: Sobe a pasta `out` para o GitHub.
5.  **Deploy**: Publica o artefato no GitHub Pages.

## 4. Habilitar o GitHub Pages no Repositório

1.  Acesse o repositório no GitHub.
2.  Vá em **Settings** (Configurações) > **Pages** (menu lateral esquerdo).
3.  Em **Build and deployment** > **Source**, selecione:
    *   Opção: **GitHub Actions** (Beta)
    *   *Nota: Não selecione "Deploy from a branch" se estiver usando o workflow do passo 3.*
4.  Não é necessário configurar nada em "Branch" ou "Folder" quando se usa Actions, pois o workflow cuida disso.

## 5. Estrutura de Arquivos Esperada

```text
/
├── .github/
│   └── workflows/
│       └── nextjs.yml    # Automação do Deploy
├── public/               # Arquivos estáticos globais
├── package.json          # Scripts e dependências
├── next.config.mjs       # Configuração de exportação e paths
└── ...
```

## 6. Build e Deploy Automático

1.  Faça um **Push** para a branch `main`.
2.  Acesse a aba **Actions** no GitHub.
3.  Você verá um workflow chamado "Deploy Next.js site to Pages" em execução.
    *   🟡 **Amarelo**: Em andamento.
    *   ✅ **Verde**: Sucesso.
    *   ❌ **Vermelho**: Falha (clique para ver os logs).

## 7. Verificação e Testes

Após o sucesso do workflow (ícone verde):

1.  Volte em **Settings** > **Pages**.
2.  No topo da página, você verá: "Your site is live at..."
3.  Clique no link para acessar (Ex: `https://devjogerio.github.io/project-salom-service-site-mobile/`).

### Critérios de Sucesso
*   [x] A Home carrega sem erros 404 no console.
*   [x] Estilos (CSS) e ícones carregam corretamente.
*   [x] Navegação entre páginas funciona.
*   [x] Imagens aparecem (se não aparecerem, verifique o `assetPrefix` ou se estão em `/public`).

## 8. Troubleshooting (Problemas Comuns)

### Erro 404 (Página não encontrada) ao acessar
*   **Causa**: O `basePath` pode estar errado no `next.config.mjs`.
*   **Solução**: Verifique se `repoName` corresponde EXATAMENTE ao nome do repositório na URL.

### CSS ou JS não carrega (Tela branca ou sem estilo)
*   **Causa**: O navegador está tentando buscar `/_next/static/...` na raiz do domínio, em vez de na subpasta do projeto.
*   **Solução**: Certifique-se de que `assetPrefix` está configurado corretamente.

### Erro "Image Optimization Using Next.js default loader is not compatible with `next export`"
*   **Causa**: Usar o componente `<Image />` sem desativar a otimização.
*   **Solução**: Garanta que `images.unoptimized: true` está no `next.config.mjs`.

### Rotas dinâmicas dão 404 ao recarregar a página (F5)
*   **Causa**: GitHub Pages é um servidor estático e não conhece as rotas do cliente (React).
*   **Solução**: O Next.js 'export' gera arquivos HTML para cada rota estática. Para rotas puramente dinâmicas, pode ser necessário configurar um arquivo `404.html` de fallback ou usar `useHash` (menos comum em Next.js).

## 9. Customização de Domínio (Opcional)

Para usar `www.seusite.com` em vez de `github.io`:

1.  Compre um domínio (GoDaddy, Registro.br, etc.).
2.  No GitHub: **Settings** > **Pages** > **Custom domain**.
3.  Digite seu domínio e salve.
4.  No seu provedor de DNS, crie um registro **CNAME** apontando `www` para `seu-usuario.github.io`.
5.  O GitHub criará automaticamente um arquivo `CNAME` na raiz do seu deploy.

---
*Documentação gerada automaticamente pelo Assistente de Arquitetura.*
