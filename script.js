// ========== Variáveis ==========
let transacoes = JSON.parse(localStorage.getItem('transacoes') || '[]');
let categorias = JSON.parse(localStorage.getItem('categorias') || '["Salário","Mercado","Lazer"]');
let metas = JSON.parse(localStorage.getItem('metas') || '{}');
let editId = null;

// ========== Funções utilitárias ==========
function salvarDados() {
  localStorage.setItem('transacoes', JSON.stringify(transacoes));
}
function salvarCategorias() {
  localStorage.setItem('categorias', JSON.stringify(categorias));
}
function salvarMetas() {
  localStorage.setItem('metas', JSON.stringify(metas));
}
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}
function csvEscape(val){
  const s = String(val ?? '');
  if (/["\n,]/.test(s)) return '"' + s.replace(/"/g,'""') + '"';
  return s;
}

// ========== Renderização ==========
function renderCategorias(){
  const select = document.getElementById('categoria');
  select.innerHTML = categorias.map(c=>`<option value="${c}">${c}</option>`).join('');
}
function renderTransacoes(){
  const tbody = document.getElementById('listaTransacoes');
  const mes = document.getElementById('filtroMes').value;
  const filtradas = mes ? transacoes.filter(t=>t.data.startsWith(mes)) : transacoes;
  tbody.innerHTML = filtradas.map(t=>`
    <tr>
      <td>${t.data}</td>
      <td>${t.tipo}</td>
      <td>${t.categoria}</td>
      <td>${t.descricao}</td>
      <td>${formatarMoeda(t.valor)}</td>
      <td>
        <button onclick="editarTransacao('${t.id}')">Editar</button>
        <button onclick="excluirTransacao('${t.id}')">Excluir</button>
      </td>
    </tr>
  `).join('');
  atualizarResumo(filtradas);
}
function atualizarResumo(lista){
  const entradas = lista.filter(t=>t.tipo==='Entrada').reduce((acc,t)=>acc+t.valor,0);
  const saidas = lista.filter(t=>t.tipo==='Saída').reduce((acc,t)=>acc+t.valor,0);
  document.getElementById('totalEntradas').textContent = formatarMoeda(entradas);
  document.getElementById('countEntradas').textContent = `${lista.filter(t=>t.tipo==='Entrada').length} transações`;
  document.getElementById('totalSaidas').textContent = formatarMoeda(saidas);
  document.getElementById('countSaidas').textContent = `${lista.filter(t=>t.tipo==='Saída').length} transações`;
  const saldo = entradas - saidas;
  document.getElementById('saldo').textContent = formatarMoeda(saldo);
  document.getElementById('alertaSaldo').classList.toggle('hidden', saldo>=0);
}

// ========== Ações ==========
document.getElementById('btnAdicionar').onclick = ()=>{
  const data = document.getElementById('data').value;
  const tipo = document.getElementById('tipo').value;
  const categoria = document.getElementById('categoria').value;
  const descricao = document.getElementById('descricao').value;
  const valor = parseFloat(document.getElementById('valor').value);
  if(!data || !valor) return alert('Preencha todos os campos obrigatórios!');
  transacoes.push({id:Date.now().toString(),data,tipo,categoria,descricao,valor});
  salvarDados();
  renderTransacoes();
};

// Excluir
function excluirTransacao(id){
  transacoes = transacoes.filter(t=>t.id!==id);
  salvarDados();
  renderTransacoes();
}

// Editar
function editarTransacao(id){
  const t = transacoes.find(x=>x.id===id);
  document.getElementById('data').value = t.data;
  document.getElementById('tipo').value = t.tipo;
  document.getElementById('categoria').value = t.categoria;
  document.getElementById('descricao').value = t.descricao;
  document.getElementById('valor').value = t.valor;
  editId = id;
}

// Inicialização
renderCategorias();
renderTransacoes();
