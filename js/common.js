// Sistema de gerenciamento de dados com localStorage
class DataManager {
  constructor() {
    this.initializeData()
  }

  // Inicializar dados padrão se não existirem
  initializeData() {
    if (!localStorage.getItem("produtos")) {
      this.resetProdutos()
    }
    if (!localStorage.getItem("carrinho")) {
      localStorage.setItem("carrinho", JSON.stringify([]))
    }
    if (!localStorage.getItem("mensagens")) {
      localStorage.setItem("mensagens", JSON.stringify([]))
    }
    if (!localStorage.getItem("promocoes")) {
      localStorage.setItem("promocoes", JSON.stringify([]))
    }
    if (!localStorage.getItem("configuracoes")) {
      this.resetConfiguracoes()
    }
  }

  // Produtos
  getProdutos() {
    return JSON.parse(localStorage.getItem("produtos")) || []
  }

  salvarProdutos(produtos) {
    localStorage.setItem("produtos", JSON.stringify(produtos))
    this.notificarMudanca("produtos")
  }

  adicionarProduto(produto) {
    const produtos = this.getProdutos()
    const novoId = produtos.length > 0 ? Math.max(...produtos.map((p) => p.id)) + 1 : 1
    produto.id = novoId
    produto.imagem = produto.imagem || "/placeholder.svg?height=200&width=280"
    produtos.push(produto)
    this.salvarProdutos(produtos)
    return produto
  }

  editarProduto(id, dadosAtualizados) {
    const produtos = this.getProdutos()
    const index = produtos.findIndex((p) => p.id === id)
    if (index !== -1) {
      produtos[index] = { ...produtos[index], ...dadosAtualizados }
      this.salvarProdutos(produtos)
      return produtos[index]
    }
    return null
  }

  removerProduto(id) {
    const produtos = this.getProdutos()
    const produtosFiltrados = produtos.filter((p) => p.id !== id)
    this.salvarProdutos(produtosFiltrados)
    return produtosFiltrados
  }

  resetProdutos() {
    const produtosPadrao = [
      {
        id: 1,
        nome: "Máquina Singer Doméstica Start 1306",
        descricao: "Máquina de costura doméstica ideal para iniciantes",
        preco: 299.9,
        tipo: "domestica",
        status: "disponivel",
        imagem: "/placeholder.svg?height=200&width=280",
        categoria: "Máquinas Domésticas",
        marca: "Singer",
        modelo: "Start 1306",
        garantia: "12 meses",
        peso: "5.5kg",
      },
      {
        id: 2,
        nome: "Máquina Industrial Reta Singer",
        descricao: "Máquina industrial para costura reta profissional",
        preco: 1899.9,
        tipo: "industrial",
        status: "disponivel",
        imagem: "/placeholder.svg?height=200&width=280",
        categoria: "Máquinas Industriais",
        marca: "Singer",
        modelo: "Industrial Reta",
        garantia: "24 meses",
        peso: "35kg",
      },
      {
        id: 3,
        nome: "Overlock Singer 14SH754",
        descricao: "Máquina overlock 4 fios para acabamentos profissionais",
        preco: 899.9,
        tipo: "overlock",
        status: "encomenda",
        imagem: "/placeholder.svg?height=200&width=280",
        categoria: "Overlocks",
        marca: "Singer",
        modelo: "14SH754",
        garantia: "18 meses",
        peso: "12kg",
      },
      {
        id: 4,
        nome: "Mesa para Máquina Industrial",
        descricao: "Mesa robusta para máquinas industriais",
        preco: 450.0,
        tipo: "acessorios",
        status: "disponivel",
        imagem: "/placeholder.svg?height=200&width=280",
        categoria: "Acessórios",
        marca: "Universal",
        modelo: "Mesa Industrial",
        garantia: "6 meses",
        peso: "25kg",
      },
      {
        id: 5,
        nome: "Motor Direct Drive 550W",
        descricao: "Motor direct drive silencioso e eficiente",
        preco: 320.0,
        tipo: "acessorios",
        status: "disponivel",
        imagem: "/placeholder.svg?height=200&width=280",
        categoria: "Motores",
        marca: "Universal",
        modelo: "Direct Drive 550W",
        garantia: "12 meses",
        peso: "3kg",
      },
      {
        id: 6,
        nome: "Máquina Singer Heavy Duty",
        descricao: "Máquina doméstica para tecidos pesados",
        preco: 799.9,
        tipo: "domestica",
        status: "disponivel",
        imagem: "/placeholder.svg?height=200&width=280",
        categoria: "Máquinas Domésticas",
        marca: "Singer",
        modelo: "Heavy Duty",
        garantia: "12 meses",
        peso: "8kg",
      },
    ]
    localStorage.setItem("produtos", JSON.stringify(produtosPadrao))
  }

  // Carrinho
  getCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho")) || []
  }

  salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho))
    this.notificarMudanca("carrinho")
  }

  adicionarAoCarrinho(produtoId, quantidade = 1) {
    const produtos = this.getProdutos()
    const produto = produtos.find((p) => p.id === produtoId)

    if (!produto) return false

    const carrinho = this.getCarrinho()
    const itemExistente = carrinho.find((item) => item.id === produtoId)

    if (itemExistente) {
      itemExistente.quantidade += quantidade
    } else {
      carrinho.push({
        ...produto,
        quantidade: quantidade,
        dataAdicao: new Date().toISOString(),
      })
    }

    this.salvarCarrinho(carrinho)
    return true
  }

  removerDoCarrinho(produtoId) {
    const carrinho = this.getCarrinho()
    const carrinhoFiltrado = carrinho.filter((item) => item.id !== produtoId)
    this.salvarCarrinho(carrinhoFiltrado)
  }

  atualizarQuantidadeCarrinho(produtoId, quantidade) {
    const carrinho = this.getCarrinho()
    const item = carrinho.find((item) => item.id === produtoId)

    if (item) {
      if (quantidade <= 0) {
        this.removerDoCarrinho(produtoId)
      } else {
        item.quantidade = quantidade
        this.salvarCarrinho(carrinho)
      }
    }
  }

  limparCarrinho() {
    this.salvarCarrinho([])
  }

  // Mensagens
  getMensagens() {
    return JSON.parse(localStorage.getItem("mensagens")) || []
  }

  adicionarMensagem(mensagem) {
    const mensagens = this.getMensagens()
    const novaMensagem = {
      id: Date.now(),
      ...mensagem,
      data: new Date().toISOString(),
      lida: false,
    }
    mensagens.unshift(novaMensagem)
    localStorage.setItem("mensagens", JSON.stringify(mensagens))
    this.notificarMudanca("mensagens")
    return novaMensagem
  }

  marcarMensagemComoLida(id) {
    const mensagens = this.getMensagens()
    const mensagem = mensagens.find((m) => m.id === id)
    if (mensagem) {
      mensagem.lida = true
      localStorage.setItem("mensagens", JSON.stringify(mensagens))
      this.notificarMudanca("mensagens")
    }
  }

  // Promoções
  getPromocoes() {
    return JSON.parse(localStorage.getItem("promocoes")) || []
  }

  adicionarPromocao(promocao) {
    const promocoes = this.getPromocoes()
    const novaPromocao = {
      id: Date.now(),
      ...promocao,
      dataCriacao: new Date().toISOString(),
      ativa: true,
    }
    promocoes.push(novaPromocao)
    localStorage.setItem("promocoes", JSON.stringify(promocoes))
    this.notificarMudanca("promocoes")
    return novaPromocao
  }

  // Configurações
  getConfiguracoes() {
    return JSON.parse(localStorage.getItem("configuracoes")) || {}
  }

  salvarConfiguracao(chave, valor) {
    const configuracoes = this.getConfiguracoes()
    configuracoes[chave] = valor
    localStorage.setItem("configuracoes", JSON.stringify(configuracoes))
    this.notificarMudanca("configuracoes")
  }

  resetConfiguracoes() {
    const configPadrao = {
      nomeEmpresa: "West Máquinas Singer",
      telefone: "(21) 3404-3121",
      whatsapp: "5521972358383",
      email: "contato@westmaquinas.com.br",
      endereco: "Rua Rodolfo de Melo, 379, Campo grande, Rio de Janeiro - RJ",
      horarioFuncionamento: {
        segunda: "8h às 18h",
        terca: "8h às 18h",
        quarta: "8h às 18h",
        quinta: "8h às 18h",
        sexta: "8h às 18h",
        sabado: "8h às 14h",
        domingo: "Fechado",
      },
      redesSociais: {
        instagram: "https://instagram.com/westmaquinasrj",
        facebook: "https://facebook.com/westmaquinasrj",
      },
      tema: "claro",
      notificacoes: true,
    }
    localStorage.setItem("configuracoes", JSON.stringify(configPadrao))
  }

  // Sistema de notificação de mudanças
  notificarMudanca(tipo) {
    window.dispatchEvent(
      new CustomEvent("dataChanged", {
        detail: { tipo, timestamp: Date.now() },
      }),
    )
  }

  // Estatísticas
  getEstatisticas() {
    const produtos = this.getProdutos()
    const carrinho = this.getCarrinho()
    const mensagens = this.getMensagens()
    const promocoes = this.getPromocoes()

    return {
      totalProdutos: produtos.length,
      produtosDisponiveis: produtos.filter((p) => p.status === "disponivel").length,
      produtosEncomenda: produtos.filter((p) => p.status === "encomenda").length,
      itensCarrinho: carrinho.reduce((sum, item) => sum + item.quantidade, 0),
      valorCarrinho: carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0),
      mensagensNaoLidas: mensagens.filter((m) => !m.lida).length,
      totalMensagens: mensagens.length,
      promocoesAtivas: promocoes.filter((p) => p.ativa).length,
      ultimaAtualizacao: new Date().toISOString(),
    }
  }

  // Backup e Restore
  exportarDados() {
    return {
      produtos: this.getProdutos(),
      carrinho: this.getCarrinho(),
      mensagens: this.getMensagens(),
      promocoes: this.getPromocoes(),
      configuracoes: this.getConfiguracoes(),
      dataExportacao: new Date().toISOString(),
    }
  }

  importarDados(dados) {
    if (dados.produtos) localStorage.setItem("produtos", JSON.stringify(dados.produtos))
    if (dados.carrinho) localStorage.setItem("carrinho", JSON.stringify(dados.carrinho))
    if (dados.mensagens) localStorage.setItem("mensagens", JSON.stringify(dados.mensagens))
    if (dados.promocoes) localStorage.setItem("promocoes", JSON.stringify(dados.promocoes))
    if (dados.configuracoes) localStorage.setItem("configuracoes", JSON.stringify(dados.configuracoes))

    this.notificarMudanca("importacao")
  }

  // Limpar todos os dados
  limparTodosDados() {
    localStorage.removeItem("produtos")
    localStorage.removeItem("carrinho")
    localStorage.removeItem("mensagens")
    localStorage.removeItem("promocoes")
    localStorage.removeItem("configuracoes")
    localStorage.removeItem("adminLogado")
    this.initializeData()
    this.notificarMudanca("reset")
  }
}

// Instância global do gerenciador de dados
const dataManager = new DataManager()

// Carrinho de compras (mantido para compatibilidade)
let carrinho = dataManager.getCarrinho()

// Produtos (mantido para compatibilidade)
const produtos = dataManager.getProdutos()

// Funções auxiliares para carregar produtos
function carregarProdutos() {
  // Implementação da função carregarProdutos
}

function carregarProdutosDestaque() {
  // Implementação da função carregarProdutosDestaque
}

// Inicialização comum
document.addEventListener("DOMContentLoaded", () => {
  inicializarEventosComuns()
  atualizarCarrinhoUI()

  // Escutar mudanças nos dados
  window.addEventListener("dataChanged", (e) => {
    if (e.detail.tipo === "carrinho") {
      carrinho = dataManager.getCarrinho()
      atualizarCarrinhoUI()
    }
    if (e.detail.tipo === "produtos") {
      // Recarregar produtos se necessário
      if (typeof window.carregarProdutos === "function") {
        window.carregarProdutos()
      }
      if (typeof window.carregarProdutosDestaque === "function") {
        window.carregarProdutosDestaque()
      }
    }
  })
})

// Eventos comuns a todas as páginas
function inicializarEventosComuns() {
  // Menu mobile
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })

    // Fechar menu ao clicar em um link
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active")
      })
    })
  }

  // Atualizar contador do carrinho periodicamente
  setInterval(() => {
    atualizarCarrinhoUI()
  }, 5000)
}

// Funções do carrinho (atualizadas para usar dataManager)
function adicionarAoCarrinho(produtoId) {
  if (dataManager.adicionarAoCarrinho(produtoId)) {
    mostrarNotificacao("Produto adicionado ao carrinho!")
  } else {
    mostrarNotificacao("Erro ao adicionar produto!", "error")
  }
}

function removerDoCarrinho(produtoId) {
  dataManager.removerDoCarrinho(produtoId)
  mostrarNotificacao("Produto removido do carrinho!")
}

function atualizarQuantidadeCarrinho(produtoId, quantidade) {
  dataManager.atualizarQuantidadeCarrinho(produtoId, quantidade)
}

function atualizarCarrinhoUI() {
  const carrinhoAtual = dataManager.getCarrinho()
  const carrinhoCount = document.getElementById("carrinhoCount")

  if (carrinhoCount) {
    const totalItems = carrinhoAtual.reduce((sum, item) => sum + item.quantidade, 0)
    carrinhoCount.textContent = totalItems

    // Animar contador se houver mudança
    if (carrinhoCount.dataset.lastCount !== totalItems.toString()) {
      carrinhoCount.style.transform = "scale(1.2)"
      setTimeout(() => {
        carrinhoCount.style.transform = "scale(1)"
      }, 200)
      carrinhoCount.dataset.lastCount = totalItems.toString()
    }
  }

  const carrinhoItems = document.getElementById("carrinhoItems")
  const carrinhoTotal = document.getElementById("carrinhoTotal")

  if (carrinhoItems && carrinhoTotal) {
    // Atualizar total
    const total = carrinhoAtual.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
    carrinhoTotal.textContent = total.toFixed(2).replace(".", ",")

    // Atualizar items
    carrinhoItems.innerHTML = ""

    if (carrinhoAtual.length === 0) {
      carrinhoItems.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #718096;">
          <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
          <p>Carrinho vazio</p>
          <small>Adicione produtos para começar</small>
        </div>
      `
      return
    }

    carrinhoAtual.forEach((item) => {
      const itemDiv = document.createElement("div")
      itemDiv.className = "carrinho-item"
      itemDiv.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}">
        <div class="item-info">
          <h4>${item.nome}</h4>
          <div class="item-preco">R$ ${item.preco.toFixed(2).replace(".", ",")} x ${item.quantidade}</div>
          <div class="item-controls">
            <button onclick="atualizarQuantidadeCarrinho(${item.id}, ${item.quantidade - 1})" class="btn-qty">-</button>
            <span>${item.quantidade}</span>
            <button onclick="atualizarQuantidadeCarrinho(${item.id}, ${item.quantidade + 1})" class="btn-qty">+</button>
          </div>
        </div>
        <button onclick="removerDoCarrinho(${item.id})" class="btn-remove">×</button>
      `
      carrinhoItems.appendChild(itemDiv)
    })
  }
}

function toggleCarrinho() {
  const carrinho = document.getElementById("carrinho")
  if (carrinho) {
    carrinho.classList.toggle("open")

    // Atualizar dados quando abrir o carrinho
    if (carrinho.classList.contains("open")) {
      atualizarCarrinhoUI()
    }
  }
}

function finalizarPedido() {
  const carrinhoAtual = dataManager.getCarrinho()

  if (carrinhoAtual.length === 0) {
    mostrarNotificacao("Carrinho vazio!", "warning")
    return
  }

  let mensagem = "🛒 *Pedido West Máquinas Singer*\n\n"
  mensagem += "📦 *Produtos:*\n"

  carrinhoAtual.forEach((item) => {
    const subtotal = item.preco * item.quantidade
    mensagem += `• ${item.nome}\n`
    mensagem += `  Qtd: ${item.quantidade} x R$ ${item.preco.toFixed(2).replace(".", ",")} = R$ ${subtotal.toFixed(2).replace(".", ",")}\n\n`
  })

  const total = carrinhoAtual.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
  mensagem += `💰 *Total: R$ ${total.toFixed(2).replace(".", ",")}*\n\n`
  mensagem += "📞 Aguardo confirmação do pedido!"

  const configuracoes = dataManager.getConfiguracoes()
  const whatsappUrl = `https://wa.me/${configuracoes.whatsapp}?text=${encodeURIComponent(mensagem)}`
  window.open(whatsappUrl, "_blank")

  // Salvar pedido nas mensagens
  dataManager.adicionarMensagem({
    tipo: "pedido",
    nome: "Cliente",
    telefone: "Via WhatsApp",
    conteudo: mensagem,
    valor: total,
    itens: carrinhoAtual.length,
  })
}

// Utilitários
function mostrarNotificacao(mensagem, tipo = "success") {
  // Remover notificações existentes
  const notificacoesExistentes = document.querySelectorAll(".notificacao-custom")
  notificacoesExistentes.forEach((n) => n.remove())

  const notificacao = document.createElement("div")
  notificacao.className = "notificacao-custom"

  const cores = {
    success: "#4299e1",
    error: "#e53e3e",
    warning: "#ed8936",
    info: "#38b2ac",
  }

  const icones = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  }

  notificacao.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${cores[tipo]};
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    z-index: 1002;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideInRight 0.3s ease;
    max-width: 300px;
    font-weight: 500;
  `

  notificacao.innerHTML = `
    <i class="${icones[tipo]}"></i>
    <span>${mensagem}</span>
  `

  document.body.appendChild(notificacao)

  setTimeout(() => {
    notificacao.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => {
      notificacao.remove()
    }, 300)
  }, 3000)
}

// Função para criar card de produto (atualizada)
function criarProdutoCard(produto) {
  const card = document.createElement("div")
  card.className = "produto-card"
  card.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
    <div class="produto-info">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <div class="produto-detalhes">
        <small><strong>Marca:</strong> ${produto.marca || "N/A"}</small>
        <small><strong>Modelo:</strong> ${produto.modelo || "N/A"}</small>
      </div>
      <div class="produto-preco">R$ ${produto.preco.toFixed(2).replace(".", ",")}</div>
      <div class="produto-status ${produto.status === "disponivel" ? "status-disponivel" : "status-encomenda"}">
        ${produto.status === "disponivel" ? "✅ Em Estoque" : "⏳ Sob Encomenda"}
      </div>
      <button class="btn-add-carrinho" onclick="adicionarAoCarrinho(${produto.id})" ${produto.status !== "disponivel" ? "disabled" : ""}>
        <i class="fas fa-cart-plus"></i>
        ${produto.status === "disponivel" ? "Adicionar ao Carrinho" : "Indisponível"}
      </button>
    </div>
  `
  return card
}

// Funções auxiliares para compatibilidade
function getProdutosFromStorage() {
  return dataManager.getProdutos()
}

function salvarProdutos(produtos) {
  dataManager.salvarProdutos(produtos)
}

function salvarCarrinho() {
  // Não necessário mais, o dataManager cuida disso automaticamente
}

// Adicionar estilos CSS para as animações
const style = document.createElement("style")
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .btn-qty {
    background: #4299e1;
    color: white;
    border: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.8rem;
    margin: 0 0.5rem;
  }
  
  .btn-qty:hover {
    background: #3182ce;
  }
  
  .btn-remove {
    background: #e53e3e;
    color: white;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
  }
  
  .btn-remove:hover {
    background: #c53030;
  }
  
  .item-controls {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
  
  .produto-detalhes {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-bottom: 1rem;
    color: #718096;
    font-size: 0.8rem;
  }
  
  .btn-add-carrinho:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
  
  .btn-add-carrinho:disabled:hover {
    background: #cbd5e0;
    transform: none;
  }
`
document.head.appendChild(style)

// Adicionar estilos de animação
const animationStyles = document.createElement("style")
animationStyles.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`
document.head.appendChild(animationStyles)
