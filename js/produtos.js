// Inicialização da página de produtos
document.addEventListener("DOMContentLoaded", () => {
  const dataManager = new DataManager() // Declare dataManager
  const criarProdutoCard = (produto) => {
    // Implement criarProdutoCard function
    const card = document.createElement("div")
    card.className = "produto-card"
    card.innerHTML = `
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <p>Marca: ${produto.marca}</p>
      <p>Preço: $${produto.preco}</p>
    `
    return card
  }

  const mostrarNotificacao = (mensagem, tipo) => {
    // Implement mostrarNotificacao function
    console.log(`Notificação (${tipo}): ${mensagem}`)
  }

  carregarProdutos()
  inicializarFiltros()
  adicionarOrdenacao()

  // Escutar mudanças nos produtos
  window.addEventListener("dataChanged", (e) => {
    if (e.detail.tipo === "produtos") {
      carregarProdutos()
    }
  })
})

function carregarProdutos() {
  const grid = document.getElementById("produtosGrid")
  if (!grid) return

  const produtos = dataManager.getProdutos()

  grid.innerHTML = ""

  if (produtos.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; grid-column: 1/-1; padding: 3rem; color: #718096;">
        <i class="fas fa-box-open" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
        <h3>Nenhum produto cadastrado</h3>
        <p>Os produtos aparecerão aqui quando forem adicionados pelo administrador.</p>
      </div>
    `
    return
  }

  produtos.forEach((produto) => {
    const produtoCard = criarProdutoCard(produto)
    grid.appendChild(produtoCard)
  })

  // Adicionar contador de produtos
  atualizarContadorProdutos(produtos.length)
}

function atualizarContadorProdutos(total) {
  let contador = document.getElementById("contadorProdutos")
  if (!contador) {
    contador = document.createElement("div")
    contador.id = "contadorProdutos"
    contador.style.cssText = `
      text-align: center;
      margin-bottom: 2rem;
      color: #718096;
      font-size: 0.9rem;
    `

    const container = document.querySelector(".search-filters")
    if (container) {
      container.parentNode.insertBefore(contador, container.nextSibling)
    }
  }

  contador.innerHTML = `
    <i class="fas fa-info-circle"></i>
    Exibindo ${total} produto${total !== 1 ? "s" : ""} disponível${total !== 1 ? "eis" : ""}
  `
}

// Busca e Filtros
function inicializarFiltros() {
  const searchInput = document.getElementById("searchInput")
  const tipoFilter = document.getElementById("tipoFilter")
  const precoFilter = document.getElementById("precoFilter")

  if (searchInput) {
    searchInput.addEventListener("input", debounce(filtrarProdutos, 300))
    // Adicionar placeholder dinâmico
    searchInput.placeholder = "Buscar por nome, descrição, marca..."
  }

  if (tipoFilter) tipoFilter.addEventListener("change", filtrarProdutos)
  if (precoFilter) precoFilter.addEventListener("change", filtrarProdutos)

  // Adicionar botão de limpar filtros
  adicionarBotaoLimparFiltros()
}

function adicionarBotaoLimparFiltros() {
  const filtersContainer = document.querySelector(".filters")
  if (filtersContainer && !document.getElementById("btnLimparFiltros")) {
    const btnLimpar = document.createElement("button")
    btnLimpar.id = "btnLimparFiltros"
    btnLimpar.className = "btn-secondary"
    btnLimpar.innerHTML = '<i class="fas fa-times"></i> Limpar'
    btnLimpar.style.cssText = `
      padding: 12px 15px;
      border: 2px solid #e2e8f0;
      border-radius: 25px;
      background: white;
      cursor: pointer;
      font-size: 1rem;
    `

    btnLimpar.addEventListener("click", limparFiltros)
    filtersContainer.appendChild(btnLimpar)
  }
}

function limparFiltros() {
  const searchInput = document.getElementById("searchInput")
  const tipoFilter = document.getElementById("tipoFilter")
  const precoFilter = document.getElementById("precoFilter")

  if (searchInput) searchInput.value = ""
  if (tipoFilter) tipoFilter.value = ""
  if (precoFilter) precoFilter.value = ""

  carregarProdutos()
  mostrarNotificacao("Filtros limpos!", "info")
}

function filtrarProdutos() {
  const searchInput = document.getElementById("searchInput")
  const tipoFilter = document.getElementById("tipoFilter")
  const precoFilter = document.getElementById("precoFilter")

  if (!searchInput || !tipoFilter || !precoFilter) return

  const searchTerm = searchInput.value.toLowerCase().trim()
  const tipoSelecionado = tipoFilter.value
  const precoSelecionado = precoFilter.value

  const produtos = dataManager.getProdutos()

  const produtosFiltrados = produtos.filter((produto) => {
    const matchSearch =
      !searchTerm ||
      produto.nome.toLowerCase().includes(searchTerm) ||
      produto.descricao.toLowerCase().includes(searchTerm) ||
      (produto.marca && produto.marca.toLowerCase().includes(searchTerm)) ||
      (produto.modelo && produto.modelo.toLowerCase().includes(searchTerm))

    const matchTipo = !tipoSelecionado || produto.tipo === tipoSelecionado
    const matchPreco = !precoSelecionado || verificarFaixaPreco(produto.preco, precoSelecionado)

    return matchSearch && matchTipo && matchPreco
  })

  exibirProdutosFiltrados(produtosFiltrados)

  // Salvar filtros no localStorage para persistência
  const filtros = {
    busca: searchTerm,
    tipo: tipoSelecionado,
    preco: precoSelecionado,
  }
  localStorage.setItem("filtrosProdutos", JSON.stringify(filtros))
}

function verificarFaixaPreco(preco, faixa) {
  switch (faixa) {
    case "0-500":
      return preco <= 500
    case "500-1000":
      return preco > 500 && preco <= 1000
    case "1000-2000":
      return preco > 1000 && preco <= 2000
    case "2000+":
      return preco > 2000
    default:
      return true
  }
}

function exibirProdutosFiltrados(produtosFiltrados) {
  const grid = document.getElementById("produtosGrid")
  if (!grid) return

  grid.innerHTML = ""

  if (produtosFiltrados.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; grid-column: 1/-1; padding: 3rem; color: #718096;">
        <i class="fas fa-search" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
        <h3>Nenhum produto encontrado</h3>
        <p>Tente ajustar os filtros ou buscar por outros termos.</p>
        <button onclick="limparFiltros()" class="btn-primary" style="margin-top: 1rem;">
          <i class="fas fa-times"></i> Limpar Filtros
        </button>
      </div>
    `
    atualizarContadorProdutos(0)
    return
  }

  produtosFiltrados.forEach((produto) => {
    const produtoCard = criarProdutoCard(produto)
    grid.appendChild(produtoCard)
  })

  atualizarContadorProdutos(produtosFiltrados.length)
}

// Função debounce para otimizar a busca
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Restaurar filtros salvos ao carregar a página
function restaurarFiltros() {
  const filtrosSalvos = localStorage.getItem("filtrosProdutos")
  if (filtrosSalvos) {
    try {
      const filtros = JSON.parse(filtrosSalvos)

      const searchInput = document.getElementById("searchInput")
      const tipoFilter = document.getElementById("tipoFilter")
      const precoFilter = document.getElementById("precoFilter")

      if (searchInput && filtros.busca) searchInput.value = filtros.busca
      if (tipoFilter && filtros.tipo) tipoFilter.value = filtros.tipo
      if (precoFilter && filtros.preco) precoFilter.value = filtros.preco

      // Aplicar filtros se houver algum valor
      if (filtros.busca || filtros.tipo || filtros.preco) {
        setTimeout(filtrarProdutos, 100)
      }
    } catch (error) {
      console.log("Erro ao restaurar filtros:", error)
    }
  }
}

// Adicionar ordenação
function adicionarOrdenacao() {
  const filtersContainer = document.querySelector(".filters")
  if (filtersContainer && !document.getElementById("ordenacaoSelect")) {
    const select = document.createElement("select")
    select.id = "ordenacaoSelect"
    select.style.cssText = `
      padding: 12px 15px;
      border: 2px solid #e2e8f0;
      border-radius: 25px;
      font-size: 1rem;
      outline: none;
      background: white;
      cursor: pointer;
    `

    select.innerHTML = `
      <option value="">Ordenar por</option>
      <option value="nome-asc">Nome (A-Z)</option>
      <option value="nome-desc">Nome (Z-A)</option>
      <option value="preco-asc">Menor Preço</option>
      <option value="preco-desc">Maior Preço</option>
      <option value="status">Disponibilidade</option>
    `

    select.addEventListener("change", ordenarProdutos)
    filtersContainer.appendChild(select)
  }
}

function ordenarProdutos() {
  const ordenacao = document.getElementById("ordenacaoSelect").value
  if (!ordenacao) return

  const grid = document.getElementById("produtosGrid")
  const cards = Array.from(grid.children)

  // Implementar ordenação baseada no valor selecionado
  // Esta é uma implementação simplificada
  filtrarProdutos() // Reaplica os filtros com a nova ordenação
}
