# Calculadora de Ripas/Rodaforros – Liberação · By Arabi

## O que é
Calculadora web de corte de ripas e rodaforros para o setor interno de liberação técnica da By Arabi Planejados.

## O que faz
O sistema recebe uma lista de medidas (comprimento em mm e quantidade de peças) e calcula o número mínimo de barras de 2700 mm necessárias para atender ao pedido. Em vez de calcular cada medida separadamente, ele trata todas as peças como um conjunto e distribui os cortes de forma otimizada, aproveitando as sobras de uma barra para encaixar peças de outras medidas. O resultado mostra o total de barras e o detalhe de quais peças foram alocadas em cada uma, incluindo a sobra restante. Quando a sobra da última barra é muito pequena (menos de 30 mm), o sistema exibe um aviso de reserva.

## Como rodar / acessar
Abra o arquivo [index.html](index.html) diretamente no navegador — não é necessário servidor ou instalação.

Repositório: [https://github.com/Evertonlib/Calculadora-ripas-LIB](https://github.com/Evertonlib/Calculadora-ripas-LIB)

## O que não pode quebrar
O algoritmo de otimização em [script.js](script.js) — é ele quem garante o cálculo correto do número mínimo de barras.
