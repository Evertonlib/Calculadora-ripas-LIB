# PRD — Calculadora de Ripas/Rodaforros · Versão Liberação Técnica

**Projeto:** Calculadora-ripas-LIB  
**Data:** 2026-04-13  
**Status:** Aguardando aprovação  

---

## 1. Objetivo

Criar uma calculadora web de corte de ripas/rodaforros voltada exclusivamente para o setor interno de liberação técnica da By Arabi Planejados. A diferença central em relação à versão de vendas (Calculadora-ripas) é o algoritmo de cálculo: em vez de tratar cada medida de forma isolada, esta versão otimiza o aproveitamento das barras tratando todas as peças como um conjunto único — maximizando o rendimento e minimizando o número de barras necessárias.

---

## 2. Contexto — O que existe hoje

O repositório `Calculadora-ripas` (versão de vendas) contém um único arquivo `index.html` com HTML, CSS e JavaScript embutidos. O algoritmo atual calcula cada medida de forma independente: para cada linha da tabela, divide a quantidade de peças daquela medida pelo número de peças que cabem numa barra, arredondando para cima. Esse modelo é simples e correto para vendas, mas desperdiça barras quando existem sobras que poderiam acomodar peças de outras medidas do mesmo pedido.

Este novo projeto (`Calculadora-ripas-LIB`) é um repositório separado, independente, com código próprio e identidade visual própria da marca.

---

## 3. O que será criado

### 3.1 Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Estrutura da página, campos de entrada, área de resultado |
| `style.css` | Toda a estilização, paleta de cores, responsividade |
| `script.js` | Lógica de cálculo, manipulação do DOM, gerenciamento das linhas de entrada |

Nenhum framework externo. Nenhuma biblioteca de terceiros. JavaScript puro, CSS puro, HTML semântico.

### 3.2 Interface

**Cabeçalho:**
- Logotipo da empresa recriado em CSS puro: arco dourado decorativo + texto "BY ARABI" (letra "Y" em `#F4C542`) + linha divisória dourada + "PLANEJADOS" com espaçamento de letras. Sem arquivo de imagem externo.
- Título: "Calculadora de Ripas/Rodaforros – Liberação"

**Parâmetros fixos (exibidos como informação, não editáveis):**
- Comprimento da barra: 2700 mm
- Perda por corte: 5 mm

**Área de entrada:**
- Ao abrir a página, já existe uma linha com dois campos: comprimento (mm) e quantidade
- Botão "+ Adicionar Medida" inclui novas linhas dinamicamente
- Cada linha possui um botão para remoção individual
- Campos numéricos com validação de valores positivos e comprimento máximo de 2700 mm

**Botão de ação:**
- "Calcular" executa o algoritmo de otimização

**Área de resultado (oculta até o cálculo):**
- Número total de barras necessárias em destaque
- Detalhamento barra a barra mostrando quais peças foram alocadas e a sobra restante
  - Exemplo: `Barra 1: 1200 + 610 + 610 | sobra: 275 mm`

### 3.3 Identidade Visual

| Elemento | Valor |
|---|---|
| Fundo geral | `#1A1A1A` (escuro) |
| Cor de destaque | `#C9A84C` (dourado) |
| Cor de texto secundário / superfícies | `#F5EDD6` (bege claro) |
| Texto principal | `#FAFAF8` (branco suave) |
| Estilo geral | Moderno, limpo, profissional — condizente com a marca By Arabi Planejados |

A paleta é completamente diferente da versão de vendas (que usa tons terrosos de madeira). Esta versão usa a identidade oficial da empresa.

---

## 4. Lógica de cálculo — Otimização de Mix (First Fit Decreasing)

Esta é a diferença central do projeto. O algoritmo não trata cada medida de forma isolada.

### Modelo de perda por corte

A barra tem capacidade real de 2700 mm. A primeira peça de cada barra entra sem perda de corte — ela começa na extremidade da barra, sem necessitar de um corte anterior. A partir da segunda peça, cada peça adicional consome (comprimento da peça + 5 mm), pois existe um corte de 5 mm separando ela da peça anterior.

Regra de encaixe:
- **Primeira peça da barra:** cabe se o espaço restante ≥ comprimento da peça. Ao colocar, reduz o espaço em (comprimento da peça).
- **Segunda peça em diante:** cabe se o espaço restante ≥ (comprimento da peça + 5 mm). Ao colocar, reduz o espaço em (comprimento da peça + 5 mm).

### Sobra exibida

A sobra exibida ao usuário é calculada da seguinte forma:

> **sobra exibida = espaço restante bruto − 5 mm**
>
> **Exceção:** se a sobra bruta for zero (barra usada integralmente), exibir **0 mm** sem desconto.

### Passo a passo do algoritmo

1. **Expandir** todas as peças em uma lista única. Três peças de 900 mm e duas de 1200 mm viram a lista: [900, 900, 900, 1200, 1200].

2. **Ordenar** essa lista da maior para a menor (ordem decrescente). A lista do exemplo fica: [1200, 1200, 900, 900, 900].

3. **Alocar barra a barra**, usando o método "First Fit Decreasing":
   - Para cada peça da lista (da maior para a menor), tenta encaixá-la na primeira barra aberta onde ela caiba, aplicando as regras de encaixe acima.
   - Se a peça não couber em nenhuma barra aberta, abre uma nova barra e coloca a peça nela (como primeira peça, sem custo de corte inicial).

4. **Registrar** em cada barra a lista de peças alocadas e o espaço restante final.

5. **Exibir** o total de barras usadas e o detalhamento de cada barra, com a sobra exibida calculada conforme a regra acima.

### Avisos de resultado

- **Sobra mínima:** quando a última barra do resultado tiver sobra exibida menor que 30 mm (incluindo 0 mm), exibir o aviso: *"Sobra abaixo de 30 mm — considere adicionar uma barra de reserva."*

### Exemplo completo

**Entrada:**
- 1200 mm × 2 peças
- 900 mm × 3 peças
- 610 mm × 2 peças

**Lista expandida e ordenada:** [1200, 1200, 900, 900, 900, 610, 610]

**Alocação:**

- Barra 1 (capacidade real 2700 mm):
  - Coloca 1200 (primeira peça, sem perda de corte) → restam 2700 − 1200 = 1500
  - Tenta 1200 (segunda peça, precisa 1200 + 5 = 1205): 1500 ≥ 1205 → cabe. Restam 1500 − 1205 = 295
  - Tenta 900: precisa 905, 295 < 905 → não cabe
  - Tenta 610: precisa 615, 295 < 615 → não cabe
  - Barra 1 fechada. Peças: [1200, 1200]. Sobra bruta: 295. Sobra exibida: 295 − 5 = **290 mm**

- Barra 2 (capacidade real 2700 mm):
  - Coloca 900 (primeira peça, sem perda de corte) → restam 2700 − 900 = 1800
  - Tenta 900 (segunda peça, precisa 900 + 5 = 905): 1800 ≥ 905 → cabe. Restam 1800 − 905 = 895
  - Tenta 900: precisa 905, 895 < 905 → não cabe
  - Tenta 610 (precisa 615): 895 ≥ 615 → cabe. Restam 895 − 615 = 280
  - Tenta 610: precisa 615, 280 < 615 → não cabe
  - Barra 2 fechada. Peças: [900, 900, 610]. Sobra bruta: 280. Sobra exibida: 280 − 5 = **275 mm**

- Barra 3 (capacidade real 2700 mm):
  - Coloca 900 (primeira peça, sem perda de corte) → restam 2700 − 900 = 1800
  - Tenta 610 (segunda peça, precisa 610 + 5 = 615): 1800 ≥ 615 → cabe. Restam 1800 − 615 = 1185
  - Barra 3 fechada. Peças: [900, 610]. Sobra bruta: 1185. Sobra exibida: 1185 − 5 = **1180 mm**

**Resultado: 3 barras**
- Barra 1: 1200 + 1200 | sobra: 290 mm
- Barra 2: 900 + 900 + 610 | sobra: 275 mm
- Barra 3: 900 + 610 | sobra: 1180 mm

---

## 5. O que não será tocado

- O repositório `Calculadora-ripas` (versão de vendas) não será modificado em nenhum aspecto.
- Nenhuma dependência externa será adicionada ao projeto.

---

## 6. O que será removido / o que não existirá neste projeto

- Não haverá algoritmo de cálculo por medida isolada (o modelo da versão de vendas não existirá aqui).
- Não haverá campos para edição dos parâmetros fixos pelo usuário.
- Não haverá persistência de dados (sem localStorage).
- Não haverá funcionalidade de exportação ou impressão (fora do escopo desta versão).
- Não haverá histórico de cálculos anteriores.

---

## 7. Premissas assumidas

1. O logotipo da empresa é recriado integralmente em CSS puro — sem dependência de arquivo de imagem externo.
2. A aplicação será usada em navegadores modernos (Chrome, Edge, Firefox atuais) — sem necessidade de suporte a Internet Explorer ou navegadores legados.
3. O uso será desktop ou laptop — o layout prioriza telas médias/grandes, mas deve ser funcional em mobile.
4. Não há requisito de autenticação ou controle de acesso — a página é aberta diretamente no navegador.
5. O modelo de perda por corte (5 mm por corte) aplica-se apenas aos cortes entre peças. A primeira peça de cada barra não gera perda de corte — ela começa na extremidade da barra.
6. Não existe restrição de quantidade mínima de barras para pedido — o sistema calcula o mínimo matemático.
7. Peças com comprimento exatamente igual a 2700 mm são válidas (uma peça por barra, sem corte, sobra exibida zero).
8. A aplicação será hospedada no GitHub Pages. Por isso, não pode depender de nenhum servidor, backend, linguagem de servidor ou chamada a APIs externas. Todo o processamento ocorre exclusivamente no navegador do usuário.

---

## 8. Riscos identificados

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Entradas muito grandes (ex: 1000 peças) causando lentidão | Baixa | Médio | O algoritmo FFD é O(n²) no pior caso; para quantidades típicas de obra (até ~200 peças totais) é imperceptível |
| Usuário informar comprimento maior que 2700 mm | Alta (erro humano) | Alto (cálculo inválido) | Validação obrigatória no campo: máximo 2700 mm |
| Usuário informar quantidade zero ou negativa | Média | Alto | Validação obrigatória: mínimo 1 |
| Confusão entre esta versão e a versão de vendas | Média | Médio | Título explícito "– Liberação" e identidade visual completamente diferente |
| Sobra exibida de forma inconsistente | Muito baixa | Médio | Regra definida no PRD: sobra exibida = sobra bruta − 5 mm, exceto quando sobra bruta = 0 (exibir 0 mm sem desconto). Implementar conforme especificado. |

---

## 9. Critérios de aceitação

### Cenário 1 — Caso base simples

**Entrada:**
- 900 mm × 3 peças

**Processamento esperado:**
- Lista ordenada: [900, 900, 900]
- Barra 1: coloca 900 (primeira peça, restam 2700 − 900 = 1800); coloca 900 (precisa 905, restam 1800 − 905 = 895); tenta 900 (precisa 905, 895 < 905 → não cabe)
- Barra 1 fechada: [900, 900]. Sobra bruta: 895. Sobra exibida: 895 − 5 = 890 mm
- Barra 2: coloca 900 (primeira peça, restam 1800)
- Barra 2 fechada: [900]. Sobra bruta: 1800. Sobra exibida: 1800 − 5 = 1795 mm

**Saída esperada:**
- Total: 2 barras
- Barra 1: 900 + 900 | sobra: 890 mm
- Barra 2: 900 | sobra: 1795 mm

---

### Cenário 2 — Mix com aproveitamento entre medidas

**Entrada:**
- 1200 mm × 2 peças
- 610 mm × 3 peças

**Processamento esperado:**
- Lista ordenada: [1200, 1200, 610, 610, 610]
- Barra 1: coloca 1200 (primeira peça, restam 1500); coloca 610 (precisa 615, restam 885); coloca 610 (precisa 615, restam 270) — não cabe mais nada
- Barra 1 fechada: [1200, 610, 610]. Sobra bruta: 270. Sobra exibida: 270 − 5 = 265 mm
- Barra 2: coloca 1200 (primeira peça, restam 1500); coloca 610 (precisa 615, restam 885)
- Barra 2 fechada: [1200, 610]. Sobra bruta: 885. Sobra exibida: 885 − 5 = 880 mm

**Saída esperada:**
- Total: 2 barras
- Barra 1: 1200 + 610 + 610 | sobra: 265 mm
- Barra 2: 1200 + 610 | sobra: 880 mm

---

### Cenário 3 — Peça com comprimento máximo (2700 mm)

**Entrada:**
- 2700 mm × 2 peças

**Processamento esperado:**
- Lista ordenada: [2700, 2700]
- Barra 1: coloca 2700 (primeira peça, sem perda de corte, restam 2700 − 2700 = 0)
- Barra 1 fechada: [2700]. Sobra bruta: 0. Sobra exibida: 0 mm (exceção: sobra bruta = 0 → exibir 0 mm sem desconto)
- Barra 2: coloca 2700 (primeira peça, restam 0). Mesma condição.
- Barra 2 fechada: [2700]. Sobra exibida: 0 mm

**Saída esperada:**
- Total: 2 barras
- Barra 1: 2700 | sobra: 0 mm
- Barra 2: 2700 | sobra: 0 mm *(aviso: "Sobra abaixo de 30 mm — considere adicionar uma barra de reserva.")*

---

### Cenário 4 — Otimização demonstrável (diferença vs. versão isolada)

**Entrada:**
- 1350 mm × 2 peças
- 1340 mm × 2 peças

**Com algoritmo isolado (versão vendas):**
- 1350: 1 peça/barra × 2 = 2 barras
- 1340: 1 peça/barra × 2 = 2 barras
- **Total: 4 barras**

**Com algoritmo de mix (esta versão):**
- Lista ordenada: [1350, 1350, 1340, 1340]
- Barra 1: coloca 1350 (primeira peça, restam 2700 − 1350 = 1350)
  - Tenta 1350 (segunda peça, precisa 1355): 1350 < 1355 → não cabe
  - Tenta 1340 (precisa 1345): 1350 ≥ 1345 → cabe. Restam 1350 − 1345 = 5
  - Barra 1 fechada: [1350, 1340]. Sobra bruta: 5. Sobra exibida: 5 − 5 = 0 mm
- Barra 2: mesmo processamento que a Barra 1
  - Barra 2 fechada: [1350, 1340]. Sobra exibida: 0 mm
- **Total: 2 barras**

**Saída esperada:**
- Total: 2 barras
- Barra 1: 1350 + 1340 | sobra: 0 mm
- Barra 2: 1350 + 1340 | sobra: 0 mm *(aviso: "Sobra abaixo de 30 mm — considere adicionar uma barra de reserva.")*

---

### Cenário 5 — Erros de entrada

| Situação | Comportamento esperado |
|---|---|
| Campo comprimento vazio | Campo recebe borda vermelha; cálculo não é executado |
| Campo quantidade vazio | Campo recebe borda vermelha; cálculo não é executado |
| Comprimento = 0 | Campo recebe borda vermelha; cálculo não é executado |
| Comprimento > 2700 mm | Campo recebe borda vermelha; cálculo não é executado |
| Quantidade negativa | Campo recebe borda vermelha; cálculo não é executado |
| Todas as linhas removidas, usuário clica em calcular | Mensagem indicando que não há medidas informadas |

> **Nota de implementação:** nenhum `alert()` do navegador deve ser usado em nenhuma dessas situações. O feedback ao usuário ocorre exclusivamente por meio de destaque visual no campo problemático (borda vermelha) e/ou mensagem inline na interface.

---

### Cenário 6 — Usabilidade

- Ao abrir a página, já existe uma linha de entrada pronta para uso (sem precisar clicar em adicionar)
- O botão "+ Adicionar Medida" funciona ilimitadamente
- Cada linha pode ser removida individualmente
- O resultado aparece suavemente (animação) abaixo do formulário
- A página é utilizável em telas a partir de 360 px de largura

---

### Cenário 7 — Aviso de sobra mínima

**Entrada:**
- 1350 mm × 1 peça
- 1330 mm × 1 peça

**Processamento esperado:**
- Lista ordenada: [1350, 1330]
- Barra 1: coloca 1350 (primeira peça, restam 2700 − 1350 = 1350); coloca 1330 (precisa 1335, restam 1350 − 1335 = 15)
- Barra 1 fechada: [1350, 1330]. Sobra bruta: 15. Sobra exibida: 15 − 5 = 10 mm
- Última barra com sobra exibida = 10 mm (< 30) → exibir aviso de sobra mínima

**Saída esperada:**
- Total: 1 barra
- Barra 1: 1350 + 1330 | sobra: 10 mm *(aviso: "Sobra abaixo de 30 mm — considere adicionar uma barra de reserva.")*

---

## 10. Fora do escopo desta versão

- Múltiplos comprimentos de barra
- Exportação para PDF ou impressão
- Persistência de dados entre sessões
- Histórico de cálculos
- Cálculo de custo financeiro
- Integração com qualquer sistema externo
- Autenticação ou login

---

*Documento gerado para aprovação antes do início da implementação.*
