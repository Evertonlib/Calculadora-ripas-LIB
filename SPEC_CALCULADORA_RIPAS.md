# SPEC — Calculadora de Ripas/Rodaforros · Liberação Técnica

**Projeto:** Calculadora-ripas-LIB  
**Data:** 2026-04-13  
**Status:** Aguardando aprovação  
**Referência:** PRD_CALCULADORA_RIPAS.md

---

## 1. Estrutura de arquivos

```
Calculadora-ripas-LIB/
├── index.html
├── style.css
├── script.js
├── PRD_CALCULADORA_RIPAS.md
└── SPEC_CALCULADORA_RIPAS.md
```

Sem dependências externas. Sem `package.json`, sem `node_modules`, sem bundler. Três arquivos de produto: `index.html`, `style.css`, `script.js`.

---

## 2. index.html

### 2.1 Esqueleto geral

```
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculadora de Ripas/Rodaforros – Liberação · By Arabi</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <header>          <!-- logo + título -->
    <main>
      <section id="parametros">    <!-- informações fixas -->
      <section id="entradas">      <!-- tabela de medidas -->
      <section id="resultado">     <!-- área de saída, hidden por padrão -->
    </main>
    <script src="script.js"></script>
  </body>
</html>
```

### 2.2 Header

- `<div class="marca">` contendo o logotipo CSS: `.marca-arco` (arco dourado decorativo via CSS puro), `.marca-linha1` com a letra "Y" isolada em `<span class="marca-y-letra">` (cor `#F4C542`), `.marca-divisor` (linha gradiente dourada) e `.marca-linha2` ("PLANEJADOS" com espaçamento de letras). Sem arquivo de imagem.
- `<h1>` com texto exato: **"Calculadora de Ripas/Rodaforros – Liberação"**.
- Nenhum link ou navegação.

### 2.3 Seção de parâmetros fixos (`#parametros`)

Dois itens exibidos como texto informativo, não editáveis:

| Label | Valor exibido |
|---|---|
| Comprimento da barra | 2700 mm |
| Perda por corte | 5 mm |

Marcação sugerida: `<dl>` com pares `<dt>` / `<dd>`.  
Nenhum `<input>` nesta seção.

### 2.4 Seção de entradas (`#entradas`)

**Tabela de linhas dinâmicas:**

- Container `<div id="linhas-container">` que acolherá as linhas dinamicamente.
- Cada linha é um `<div class="linha-medida">` contendo:
  - `<input type="number" class="campo-comprimento" placeholder="Comprimento (mm)" min="1" max="2700">`
  - `<input type="number" class="campo-quantidade" placeholder="Qtd" min="1">`
  - `<button class="btn-remover" aria-label="Remover linha">×</button>`
- Ao carregar a página, **uma linha** já existe no DOM (não criada por JavaScript — está no HTML estático), pronta para preenchimento.

**Botão de adição:**

- `<button id="btn-adicionar">+ Adicionar Medida</button>` — posicionado abaixo do container de linhas.

**Botão de cálculo:**

- `<button id="btn-calcular">Calcular</button>` — posicionado abaixo do botão de adição.

### 2.5 Seção de resultado (`#resultado`)

- Oculta por padrão via classe CSS `hidden` (não `display:none` inline no HTML — a classe `hidden` aplica `display: none`).
- Estrutura interna quando exibida:
  - `<p id="total-barras">` — exibe o número total em destaque (ex.: `"3 barras necessárias"`).
  - `<div id="detalhamento">` — contém um `<div class="barra-item">` por barra.
  - Cada `.barra-item` contém:
    - `<p class="barra-descricao">` — ex.: `"Barra 1: 1200 + 900 + 610 | sobra: 590 mm"`
    - `<p class="barra-aviso">` (opcional) — exibe avisos quando aplicável (veja seção 6 de avisos).

---

## 3. style.css

### 3.1 Variáveis CSS (`:root`)

```css
--cor-fundo:        #1A1A1A;
--cor-destaque:     #C9A84C;
--cor-superficie:   #F5EDD6;
--cor-texto:        #FAFAF8;
--cor-erro:         #E05555;   /* vermelho para borda de campo inválido */
--cor-aviso:        #C9A84C;   /* dourado para textos de aviso */
--raio-borda:       6px;
--transicao:        0.25s ease;
```

### 3.2 Reset e base

- `box-sizing: border-box` global.
- `margin: 0; padding: 0` no `*`.
- `background-color: var(--cor-fundo)` e `color: var(--cor-texto)` no `body`.
- Fonte: `font-family: 'Segoe UI', system-ui, sans-serif` — fonte de sistema, sem importação externa.

### 3.3 Header

- Logotipo CSS (`.marca`) centralizado horizontalmente via `text-align: center` no `header`.
- `<h1>` centralizado, cor `var(--cor-destaque)`, tamanho entre `1.4rem` e `1.8rem`.
- Padding vertical confortável (`1.5rem 1rem`).
- Separador inferior sutil (border-bottom `1px solid` com opacidade).

### 3.4 Seção de parâmetros

- Exibida em linha (flexbox) com gap, centralizada.
- `<dt>` em cor `var(--cor-superficie)` (texto secundário), tamanho reduzido.
- `<dd>` em cor `var(--cor-destaque)`, peso bold.

### 3.5 Área de entradas

- `max-width: 680px`, centralizada com `margin: 0 auto`.
- Cada `.linha-medida` em flexbox: `campo-comprimento` ocupa mais espaço (`flex: 2`), `campo-quantidade` menor (`flex: 1`), botão de remoção fixo.
- `<input>`: fundo `#2A2A2A`, borda `1px solid #444`, cor texto `var(--cor-texto)`, border-radius `var(--raio-borda)`, padding `0.5rem 0.75rem`, outline ao foco em `var(--cor-destaque)`.
- Estado de erro: classe `.campo-erro` adiciona `border-color: var(--cor-erro)`.
- `btn-remover`: fundo transparente, cor `#888`, hover `var(--cor-erro)`, sem borda.
- `btn-adicionar`: estilo outline (borda `var(--cor-destaque)`, texto `var(--cor-destaque)`, fundo transparente), hover inverte (fundo `var(--cor-destaque)`, texto escuro).
- `btn-calcular`: botão primário, fundo `var(--cor-destaque)`, texto escuro (`#1A1A1A`), peso bold, largura total (`width: 100%`), padding confortável, hover leve darken com `filter: brightness(0.9)`.

### 3.6 Área de resultado

- Classe `.hidden` aplica `display: none`.
- Quando visível: animação de entrada — `@keyframes fadeSlideIn` com `opacity 0→1` e `translateY(12px→0)`, duração `0.35s`.
- `#total-barras`: texto grande (`1.5rem`), cor `var(--cor-destaque)`, peso bold, margem inferior.
- Cada `.barra-item`: fundo `#242424`, border-left `3px solid var(--cor-destaque)`, padding `0.75rem 1rem`, border-radius `var(--raio-borda)`, margem inferior `0.5rem`.
- `.barra-descricao`: `font-family: 'Courier New', monospace` — melhora leitura de valores numéricos.
- `.barra-aviso`: cor `var(--cor-aviso)`, tamanho `0.85rem`, margem-top `0.25rem`, itálico.

### 3.7 Responsividade

- Breakpoint em `480px`:
  - `.linha-medida` passa para `flex-wrap: wrap`, campos ocupam largura total.
  - Botões em largura total.
- Nenhum scroll horizontal em `360px` de largura.

---

## 4. script.js

### 4.1 Constantes globais

```js
const COMPRIMENTO_BARRA = 2700;
const PERDA_CORTE       = 5;
```

Não há outras "mágicas numéricas" no código — qualquer outra constante derivada é calculada a partir destas duas.

### 4.2 Organização das funções

O arquivo é organizado em três camadas, de baixo para cima:

```
[1] Algoritmo puro (sem DOM)
      calcularFFD(pecas)  → barras[]

[2] Camada de apresentação
      renderizarResultado(barras)
      limparResultado()
      marcarCampoErro(el)
      limparErros()

[3] Camada de eventos / orquestração
      adicionarLinha()
      removerLinha(event)
      calcular()
      init()
```

### 4.3 Estrutura de dados

**Entrada para o algoritmo:**
```js
// Array de números inteiros — cada elemento é o comprimento de uma peça
// Ex.: [1200, 1200, 900, 900, 900, 610, 610]
pecas: number[]
```

**Saída do algoritmo:**
```js
// Array de objetos, um por barra
barras: Array<{
  pecas:       number[],   // comprimentos das peças alocadas, na ordem de alocação
  sobraBruta:  number,     // espaço restante após alocação
  sobraExibida: number     // sobraBruta === 0 ? 0 : sobraBruta - PERDA_CORTE
}>
```

### 4.4 Algoritmo `calcularFFD(pecas)`

Recebe o array de comprimentos já expandidos. Retorna o array de barras.

```
Passos:

1. Criar cópia do array e ordenar em ordem decrescente (sort).

2. Inicializar array vazio `barras`.

3. Para cada `peca` no array ordenado:
   a. Percorrer `barras` existentes em ordem de criação (índice 0, 1, 2…).
   b. Para cada barra, verificar se a peça cabe:
      - Se barra.pecas.length === 0  →  cabe se peca ≤ barra.sobraBruta
        (primeira peça: sem custo de corte)
      - Se barra.pecas.length > 0   →  cabe se (peca + PERDA_CORTE) ≤ barra.sobraBruta
        (demais peças: custo de corte incluso)
   c. Se couber na primeira barra encontrada:
      - Empurrar `peca` em `barra.pecas`
      - Subtrair de `barra.sobraBruta`:
        - Se era a primeira peça: subtract `peca`
        - Se não era: subtract `peca + PERDA_CORTE`
      - Parar de procurar (break).
   d. Se não couber em nenhuma barra existente:
      - Criar nova barra: `{ pecas: [], sobraBruta: COMPRIMENTO_BARRA }`
      - Alocar a peça como primeira peça (subtract apenas `peca`)
      - Empurrar barra no array `barras`.

4. Após alocar todas as peças, calcular `sobraExibida` para cada barra:
   - sobraExibida = sobraBruta === 0 ? 0 : sobraBruta - PERDA_CORTE

5. Retornar `barras`.
```

> **Invariante:** `sobraBruta` nunca fica negativo — as verificações de encaixe garantem isso.

### 4.5 Validação de entradas — `coletarEValidar()`

Função que lê o DOM e retorna `{ valido: boolean, pecas: number[] }`.

**Regras por campo:**

| Campo | Condição de erro |
|---|---|
| `campo-comprimento` | Vazio, não numérico, `≤ 0`, ou `> 2700` |
| `campo-quantidade` | Vazio, não numérico, `< 1`, ou não inteiro |

**Comportamento:**
1. Remove todas as classes `.campo-erro` existentes.
2. Percorre todas as `.linha-medida`.
3. Para cada linha com erro, adiciona `.campo-erro` no(s) campo(s) problemático(s) e marca `valido = false`.
4. Se nenhuma linha existir (todas removidas), exibe mensagem inline `"Informe ao menos uma medida."` na seção `#entradas` e retorna `valido: false`.
5. Se `valido === true`, constrói o array `pecas` expandido: para cada linha, empurra `quantidade` vezes o valor de `comprimento`.
6. Retorna `{ valido, pecas }`.

**Restrições:**
- Nenhum `alert()`.
- Nenhum `confirm()`.
- Feedback visual apenas via classe CSS e/ou mensagem inline.

### 4.6 Renderização — `renderizarResultado(barras)`

1. Chama `limparResultado()` para limpar o DOM da seção anterior (se houver).
2. Define texto de `#total-barras`:
   - 1 barra: `"1 barra necessária"`
   - N barras: `"N barras necessárias"`
3. Para cada barra (index `i`):
   a. Criar `.barra-item`.
   b. Criar `.barra-descricao` com texto no formato:
      `"Barra {i+1}: {pecas.join(' + ')} | sobra: {sobraExibida} mm"`
   c. Verificar avisos (ver seção 4.7) e, se houver, criar `.barra-aviso` com o texto.
   d. Adicionar `.barra-item` ao `#detalhamento`.
4. Remover classe `hidden` de `#resultado`.
5. Rolar suavemente até `#resultado` com `scrollIntoView({ behavior: 'smooth', block: 'start' })`.

### 4.7 Lógica de avisos

Dois avisos possíveis, avaliados na renderização:

**Aviso — Sobra mínima:**
- Condição: aplicado **apenas à última barra** do resultado; `sobraExibida < 30` (incluindo 0 mm).
- Texto: `"Sobra abaixo de 30 mm — considere adicionar uma barra de reserva."`

### 4.8 Gerenciamento de linhas

**`adicionarLinha()`:**
- Cria um novo `<div class="linha-medida">` com os dois inputs e o botão remover.
- Os inputs do template têm os mesmos atributos da linha estática do HTML.
- Append ao `#linhas-container`.
- Foco no campo comprimento da nova linha (`linha.querySelector('.campo-comprimento').focus()`).

**`removerLinha(event)`:**
- Handler delegado no `#linhas-container` (event delegation), listener no `click`.
- Verifica se `event.target` tem classe `btn-remover`.
- Remove o `parentElement` (`.linha-medida`) do DOM.
- Não impede remover a última linha — se todas forem removidas, a validação cuida da mensagem.

### 4.9 Orquestração — `calcular()`

```
1. Chamar coletarEValidar()
2. Se não válido → retornar (feedback já aplicado pela validação)
3. Chamar calcularFFD(pecas)
4. Chamar renderizarResultado(barras)
```

### 4.10 Inicialização — `init()`

Chamada no carregamento do script (ao final do arquivo, sem DOMContentLoaded — o `<script>` está no final do `<body>`):

```js
document.getElementById('btn-adicionar').addEventListener('click', adicionarLinha);
document.getElementById('btn-calcular').addEventListener('click', calcular);
document.getElementById('linhas-container').addEventListener('click', removerLinha);
```

Nenhum outro estado global ou variável compartilhada entre funções — toda leitura de estado vem do DOM no momento do cálculo.

---

## 5. Comportamentos de borda documentados

| Situação | Comportamento |
|---|---|
| Todas as linhas removidas → clicar Calcular | Mensagem inline `"Informe ao menos uma medida."` na seção de entradas; resultado não exibido |
| Uma única peça de 2700 mm | 1 barra, sobraExibida = 0, aviso de sobra mínima exibido |
| Comprimento digitado com vírgula (ex.: `1.200`) | Input type="number" trata automaticamente; número com ponto decimal não inteiro gera campo inválido |
| Quantidade fracionada (ex.: `2.5`) | Campo quantidade inválido (regra: deve ser inteiro ≥ 1) — verificado com `Number.isInteger()` |
| Usuário remove e adiciona linhas múltiplas vezes | Nenhum estado interno acumulado — cada cálculo lê o DOM do zero |
| Cálculo executado mais de uma vez | `limparResultado()` garante que o detalhamento anterior seja substituído, não acumulado |

---

## 6. Critérios de verificação técnica (complementam os critérios do PRD)

Estes critérios verificam a implementação interna, não apenas o resultado numérico:

1. `calcularFFD` é função pura: mesma entrada → mesma saída; sem side effects.
2. Nenhum `alert()`, `confirm()` ou `prompt()` em nenhum ponto do código.
3. A classe `hidden` é a única forma de ocultar/exibir `#resultado` — sem manipulação de `style.display` direta.
4. O evento de remoção de linha usa event delegation (um único listener no container), não um listener por botão.
5. Constantes `COMPRIMENTO_BARRA` e `PERDA_CORTE` usadas em todos os pontos de cálculo — sem valores literais `2700` ou `5` no código além das declarações.
6. O array `pecas` passado para `calcularFFD` não é mutado pela função (trabalha em cópia).

---

## 7. Fora do escopo desta especificação

Alinhado com o PRD — nada dos itens abaixo será implementado:

- Múltiplos comprimentos de barra
- localStorage ou qualquer persistência
- Exportação / impressão
- Histórico de cálculos
- Cálculo de custo
- Backend, API, autenticação

---

*Especificação gerada para aprovação antes do início da implementação.*
