# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [v1.2.0-responsivo] - 2026-02-11

### Adicionado
- **Responsividade Fluida**: Implementação de unidades relativas `clamp()`, `vw`, `vh` e `rem` em componentes chave.
- **CSS Guide**: Documentação técnica (`CSS_GUIDE.md`) detalhando a estratégia de estilos e breakpoints.
- **Media Queries Globais**: Regras específicas em `globals.css` para dispositivos < 360px (Mobile XS) e > 1440px (Large Desktop).
- **Grid Inteligente**: O catálogo de serviços agora utiliza um grid auto-ajustável que dispensa media queries rígidas para número de colunas.

### Alterado
- **ServiceCatalog.tsx**: 
  - Títulos e subtítulos agora escalam linearmente com a largura da viewport.
  - Botões de filtro com padding e tamanho de fonte dinâmicos.
  - Layout de grid refatorado para `repeat(auto-fill, minmax(...))`.
- **CategoryCarousel.tsx**:
  - Altura do carrossel ajustada para `clamp(250px, 40vw, 500px)`.
  - Textos sobrepostos (título, categoria, descrição) com tipografia fluida.
  - Otimização do hook de rotação automática para evitar renders desnecessários.
- **globals.css**:
  - Inclusão de `font-size` base variável no elemento `html` para escalar medidas `rem`.
  - Adição de fallbacks via `@supports` para navegadores antigos.

### Removido
- **ActionButtons**: Componente e referências removidos permanentemente para limpeza de interface.
- **HighlightSection**: Componente de destaque antigo removido em favor do novo carrossel integrado.
