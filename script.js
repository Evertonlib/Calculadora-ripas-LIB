const COMPRIMENTO_BARRA = 2700;
const PERDA_CORTE = 5;

// ── [1] Algoritmo puro (sem DOM) ──────────────────────────────────────────────

function calcularFFD(pecas) {
  const ordenadas = [...pecas].sort((a, b) => b - a);
  const barras = [];

  for (const peca of ordenadas) {
    let alocada = false;

    for (const barra of barras) {
      const primeiraPeca = barra.pecas.length === 0;
      const custo = primeiraPeca ? peca : peca + PERDA_CORTE;

      if (custo <= barra.sobraBruta) {
        barra.pecas.push(peca);
        barra.sobraBruta -= custo;
        alocada = true;
        break;
      }
    }

    if (!alocada) {
      const novaBarra = { pecas: [], sobraBruta: COMPRIMENTO_BARRA };
      novaBarra.pecas.push(peca);
      novaBarra.sobraBruta -= peca;
      barras.push(novaBarra);
    }
  }

  for (const barra of barras) {
    barra.sobraExibida = barra.sobraBruta === 0 ? 0 : barra.sobraBruta - PERDA_CORTE;
  }

  return barras;
}

// ── [2] Camada de apresentação ────────────────────────────────────────────────

function limparResultado() {
  document.getElementById('total-barras').textContent = '';
  document.getElementById('detalhamento').innerHTML = '';
}

function marcarCampoErro(el) {
  el.classList.add('campo-erro');
}

function limparErros() {
  document.querySelectorAll('.campo-erro').forEach(el => el.classList.remove('campo-erro'));
  const msg = document.getElementById('mensagem-sem-medidas');
  if (msg) msg.remove();
}

function renderizarResultado(barras) {
  limparResultado();

  const totalEl = document.getElementById('total-barras');
  totalEl.textContent = barras.length === 1
    ? '1 barra necessária'
    : `${barras.length} barras necessárias`;

  const resumoEl = document.getElementById('resumo-medidas');
  resumoEl.innerHTML = '';

  const grupos = new Map();
  barras.forEach((barra, i) => {
    barra.pecas.forEach(p => {
      if (!grupos.has(p)) {
        grupos.set(p, { quantidade: 0, barrasSet: new Set() });
      }
      const g = grupos.get(p);
      g.quantidade += 1;
      g.barrasSet.add(i);
    });
  });

  const medidasOrdenadas = [...grupos.entries()].sort((a, b) => b[0] - a[0]);

  medidasOrdenadas.forEach(([comprimento, g]) => {
    const linha = document.createElement('p');
    linha.className = 'resumo-medida';
    const numBarras = g.barrasSet.size;
    const barrasLabel = numBarras === 1 ? 'barra' : 'barras';
    linha.textContent =
      `${comprimento} mm · ${g.quantidade} pç → ${numBarras} ${barrasLabel}`;
    resumoEl.appendChild(linha);
  });

  const detalhamento = document.getElementById('detalhamento');
  const ultimaIdx = barras.length - 1;

  barras.forEach((barra, i) => {
    const item = document.createElement('div');
    item.className = 'barra-item';

    const descricao = document.createElement('p');
    descricao.className = 'barra-descricao';
    descricao.textContent =
      `Barra ${i + 1}: ${barra.pecas.join(' + ')} | sobra: ${barra.sobraExibida} mm`;
    item.appendChild(descricao);

    if (i === ultimaIdx && barra.sobraExibida < 30) {
      const aviso = document.createElement('p');
      aviso.className = 'barra-aviso';
      aviso.textContent =
        'Sobra abaixo de 30 mm — considere adicionar uma barra de reserva.';
      item.appendChild(aviso);
    }

    detalhamento.appendChild(item);
  });

  detalhamento.classList.add('hidden');
  const btnToggle = document.getElementById('btn-toggle-detalhamento');
  btnToggle.textContent = 'Ver detalhamento completo';
  btnToggle.onclick = () => {
    const ocultoAgora = detalhamento.classList.toggle('hidden');
    btnToggle.textContent = ocultoAgora
      ? 'Ver detalhamento completo'
      : 'Ocultar detalhamento';
  };

  const resultado = document.getElementById('resultado');
  resultado.classList.remove('hidden');
  resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── [3] Camada de eventos / orquestração ─────────────────────────────────────

function coletarEValidar() {
  limparErros();

  const linhas = document.querySelectorAll('.linha-medida');

  if (linhas.length === 0) {
    const entradas = document.getElementById('entradas');
    const msg = document.createElement('p');
    msg.id = 'mensagem-sem-medidas';
    msg.textContent = 'Informe ao menos uma medida.';
    entradas.appendChild(msg);
    return { valido: false, pecas: [] };
  }

  let valido = true;
  const pecas = [];

  linhas.forEach(linha => {
    const campoComp = linha.querySelector('.campo-comprimento');
    const campoQtd = linha.querySelector('.campo-quantidade');

    const compVal = campoComp.value.trim();
    const qtdVal = campoQtd.value.trim();

    const comp = Number(compVal);
    const qtd = Number(qtdVal);

    const erroComp =
      compVal === '' || isNaN(comp) || comp <= 0 || comp > COMPRIMENTO_BARRA;
    const erroQtd =
      qtdVal === '' || isNaN(qtd) || qtd < 1 || !Number.isInteger(qtd);

    if (erroComp) marcarCampoErro(campoComp);
    if (erroQtd) marcarCampoErro(campoQtd);

    if (erroComp || erroQtd) {
      valido = false;
    } else {
      for (let i = 0; i < qtd; i++) {
        pecas.push(comp);
      }
    }
  });

  return { valido, pecas };
}

function adicionarLinha() {
  const container = document.getElementById('linhas-container');
  const linha = document.createElement('div');
  linha.className = 'linha-medida';
  linha.innerHTML = `
    <input type="number" class="campo-comprimento" placeholder="Comprimento (mm)" min="1" max="2700">
    <input type="number" class="campo-quantidade" placeholder="Qtd" min="1">
    <button class="btn-remover" aria-label="Remover linha">×</button>
  `;
  container.appendChild(linha);
  linha.querySelector('.campo-comprimento').focus();
}

function removerLinha(event) {
  if (event.target.classList.contains('btn-remover')) {
    event.target.parentElement.remove();
  }
}

function calcular() {
  const { valido, pecas } = coletarEValidar();
  if (!valido) return;
  const barras = calcularFFD(pecas);
  renderizarResultado(barras);
}

function init() {
  document.getElementById('btn-adicionar').addEventListener('click', adicionarLinha);
  document.getElementById('btn-calcular').addEventListener('click', calcular);
  document.getElementById('linhas-container').addEventListener('click', removerLinha);
}

init();
