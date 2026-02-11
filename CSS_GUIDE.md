# Guia de Estilos CSS e Responsividade Avançada

Este documento detalha a estratégia de CSS e responsividade aplicada ao projeto, garantindo uma experiência fluida em dispositivos que variam de pequenos smartphones a grandes monitores de desktop.

## Estratégia Geral

Utilizamos uma abordagem híbrida combinando **Tailwind CSS** para utilitários rápidos e **CSS Nativo (Media Queries e Variáveis)** para regras de layout complexas e tipografia fluida.

### Unidades Relativas e Fluidas

Priorizamos unidades relativas para garantir escalabilidade:
- **`rem`**: Para espaçamentos, tamanhos de fonte base e containers.
- **`vw/vh`**: Para elementos que devem escalar com a viewport (ex: altura do carrossel).
- **`clamp()`**: Para tipografia fluida que se ajusta linearmente entre um tamanho mínimo e máximo, sem a necessidade de breakpoints bruscos.
- **`%`**: Para larguras de grid e containers flexíveis.

---

## Breakpoints Definidos

Estabelecemos 4 breakpoints principais para cobrir o espectro de dispositivos modernos:

| Breakpoint | Faixa de Resolução | Dispositivos Alvo | Estratégia de Ajuste |
| :--- | :--- | :--- | :--- |
| **Mobile XS** | `< 360px` | iPhone SE (1st gen), Galaxy Fold (fechado) | Redução de fonte base (14px), padding mínimo (0.75rem) |
| **Mobile** | `360px - 767px` | Smartphones modernos (iPhone 12+, Pixel, Galaxy S) | Fonte base padrão (16px), layout coluna única |
| **Tablet** | `768px - 1023px` | iPads, Tablets Android, Laptops pequenos | Layout híbrido (2 colunas), aumento de padding vertical |
| **Desktop** | `1024px - 1439px` | Laptops padrão, Desktops compactos | Layout grid completo (3 colunas), container max-width: 960px |
| **Large** | `>= 1440px` | Monitores Widescreen, iMacs | Fonte base aumentada (18px), container max-width: 1280px |

### Exemplo de Código (globals.css)

```css
/* Mobile First (Base) - < 360px */
@media (max-width: 359px) {
  html {
    font-size: 14px; /* Reduz a base da fonte */
  }
}

/* Large Desktop - >= 1440px */
@media (min-width: 1440px) {
  html {
    font-size: 18px; /* Aumenta legibilidade */
  }
}
```

---

## Tipografia Fluida com `clamp()`

Para evitar o efeito "pulo" ao redimensionar a tela, utilizamos a função `clamp(min, val, max)` em títulos e textos de destaque.

### Fórmula
`clamp(TAMANHO_MINIMO, TAMANHO_VARIAVEL (vw), TAMANHO_MAXIMO)`

### Exemplos Aplicados

#### Título do Catálogo
```tsx
<h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
  Nossos Serviços
</h2>
```
- **Mobile**: 1.75rem (~28px)
- **Desktop**: 2.5rem (~40px)
- **Intermediário**: Escala linearmente com 4% da largura da viewport.

#### Título do Carrossel
```tsx
<h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>
  Especialidade em Cabelo
</h3>
```

---

## Grid Responsivo Inteligente

Utilizamos CSS Grid com `minmax()` e `clamp()` para criar layouts que se auto-organizam sem necessidade de definir colunas fixas para cada breakpoint.

### Código
```tsx
<div 
  className="grid gap-6"
  style={{
    gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 100%, 350px), 1fr))',
  }}
>
  {/* Cards */}
</div>
```

**Explicação:**
1. **`auto-fill`**: Preenche a linha com o máximo de colunas possível.
2. **`minmax(...)`**: Define os limites de largura de cada card.
3. **`clamp(280px, 100%, 350px)`**: 
   - O card nunca será menor que 280px.
   - O card nunca será maior que 350px.
   - Se o container for menor que 280px (telas muito pequenas), ele ocupa 100% da largura.

---

## Fallbacks e Compatibilidade

Para garantir suporte a navegadores antigos que não implementam `clamp()` ou variáveis modernas, incluímos regras de fallback.

```css
/* Feature Detection */
@supports not (font-size: clamp(1rem, 2vw, 2rem)) {
  .responsive-text {
    font-size: 1rem; /* Valor seguro fixo */
  }
  
  @media (min-width: 768px) {
    .responsive-text {
      font-size: 1.5rem; /* Ajuste manual por breakpoint */
    }
  }
}
```

---

## Testes Realizados

O layout foi validado nas seguintes condições simuladas:
1. **320px**: Layout fluido, sem scroll horizontal, texto legível.
2. **768px**: Transição para grid de 2 colunas, menus expandidos.
3. **1024px**: Grid de 3 colunas, áreas de respiro adequadas.
4. **1920px**: Conteúdo centralizado, fontes ampliadas para leitura confortável.
