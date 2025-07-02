// Dados dos produtos (simulando um banco de dados)
let produtos = [
  {
    id: 1,
    nome: "Máquina Singer Doméstica Start 1306",
    descricao: "Máquina de costura doméstica ideal para iniciantes",
    preco: 299.9,
    tipo: "domestica",
    status: "disponivel",
    imagem: "/placeholder.svg?height=200&width=280",
  },
  {
    id: 2,
    nome: "Máquina Industrial Reta Singer",
    descricao: "Máquina industrial para costura reta profissional",
    preco: 1899.9,
    tipo: "industrial",
    status: "disponivel",
    imagem: "/placeholder.svg?height=200&width=280",
  },
  {
    id: 3,
    nome: "Overlock Singer 14SH754",
    descricao: "Máquina overlock 4 fios para acabamentos profissionais",
    preco: 899.9,
    tipo: "overlock",
    status: "encomenda",
    imagem: "/placeholder.svg?height=200&width=280",
  },
  {
    id: 4,
    nome: "Mesa para Máquina Industrial",
    descricao: "Mesa robusta para máquinas industriais",
    preco: 450.0,
    tipo: "acessorios",
    status: "disponivel",
    imagem: "/placeholder.svg?height=200&width=280",
  },
  {
    id: 5,
    nome: "Motor Direct Drive 550W",
    descricao: "Motor direct drive silencioso e eficiente",
    preco: 320.0,
    tipo: "acessorios",
    status: "disponivel",
    imagem: "/placeholder.svg?height=200&width=280",
  },
  {
    id: 6,
    nome: "Máquina Singer Heavy Duty",
    descricao: "Máquina doméstica para tecidos pesados",
    preco: 799.9,
    tipo: "domestica",
    status: "disponivel",
    imagem: "/placeholder.svg?height=200&width=280",
  },
]

// Carrinho de compras
let carrinho = []
let slideIndex = 0

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos()
  inicializarCarrossel()
  inicializarEventos()
  atualizarCarrinhoUI()
})

// Carrossel
function inicializarCarrossel() {
  setInterval(() => {
    slideIndex = (slideIndex + 1) % 3
    mostrarSlide(slideIndex)
  }, 5000)
}

function changeSlide(direction) {
  slideIndex += direction
  if (slideIndex >= 3) slideIndex = 0
  if (slideIndex < 0) slideIndex = 2
  mostrarSlide(slideIndex)
}

function currentSlide(index) {
  slideIndex = index - 1
  mostrarSlide(slideIndex)
}

function mostrarSlide(index) {
  const carousel = document.querySelector(".carousel")
  const dots = document.querySelectorAll(".dot")

  carousel.style.transform = `translateX(-${index * 100}%)`

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index)
  })
}

// Produtos
function carregarProdutos() {
  const grid = document.getElementById("produtosGrid")
  grid.innerHTML = ""

  produtos.forEach((produto) => {
    const produtoCard = criarProdutoCard(produto)
    grid.appendChild(produtoCard)
  })
}

function criarProdutoCard(produto) {
  const card = document.createElement("div")
  card.className = "produto-card"
  card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="produto-info">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <div class="produto-preco">R$ ${produto.preco.toFixed(2).replace(".", ",")}</div>
            <div class="produto-status ${produto.status === "disponivel" ? "status-disponivel" : "status-encomenda"}">
                ${produto.status === "disponivel" ? "Em Estoque" : "Sob Encomenda"}
            </div>
            <button class="btn-add-carrinho" onclick="adicionarAoCarrinho(${produto.id})">
                Adicionar ao Carrinho
            </button>
        </div>
    `
  return card
}

// Busca e Filtros
function inicializarEventos() {
  const searchInput = document.getElementById("searchInput")
  const tipoFilter = document.getElementById("tipoFilter")
  const precoFilter = document.getElementById("precoFilter")

  searchInput.addEventListener("input", filtrarProdutos)
  tipoFilter.addEventListener("change", filtrarProdutos)
  precoFilter.addEventListener("change", filtrarProdutos)

  // Menu mobile
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active")
  })

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
        navMenu.classList.remove("active")
      }
    })
  })

  // Formulário de orçamento
  const orcamentoForm = document.getElementById("orcamentoForm")
  orcamentoForm.addEventListener("submit", enviarOrcamento)

  // Admin login
  const adminLogin = document.querySelector(".login-form")
  adminLogin.addEventListener("submit", fazerLogin)
}

function filtrarProdutos() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const tipoFilter = document.getElementById("tipoFilter").value
  const precoFilter = document.getElementById("precoFilter").value

  const produtosFiltrados = produtos.filter((produto) => {
    const matchSearch =
      produto.nome.toLowerCase().includes(searchTerm) || produto.descricao.toLowerCase().includes(searchTerm)
    const matchTipo = !tipoFilter || produto.tipo === tipoFilter
    const matchPreco = !precoFilter || verificarFaixaPreco(produto.preco, precoFilter)

    return matchSearch && matchTipo && matchPreco
  })

  exibirProdutosFiltrados(produtosFiltrados)
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
  grid.innerHTML = ""

  if (produtosFiltrados.length === 0) {
    grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Nenhum produto encontrado.</p>'
    return
  }

  produtosFiltrados.forEach((produto) => {
    const produtoCard = criarProdutoCard(produto)
    grid.appendChild(produtoCard)
  })
}

// Carrinho
function adicionarAoCarrinho(produtoId) {
  const produto = produtos.find((p) => p.id === produtoId)
  if (produto) {
    const itemExistente = carrinho.find((item) => item.id === produtoId)

    if (itemExistente) {
      itemExistente.quantidade += 1
    } else {
      carrinho.push({
        ...produto,
        quantidade: 1,
      })
    }

    atualizarCarrinhoUI()
    mostrarNotificacao("Produto adicionado ao carrinho!")
  }
}

function removerDoCarrinho(produtoId) {
  carrinho = carrinho.filter((item) => item.id !== produtoId)
  atualizarCarrinhoUI()
}

function atualizarCarrinhoUI() {
  const carrinhoItems = document.getElementById("carrinhoItems")
  const carrinhoCount = document.getElementById("carrinhoCount")
  const carrinhoTotal = document.getElementById("carrinhoTotal")

  // Atualizar contador
  const totalItems = carrinho.reduce((sum, item) => sum + item.quantidade, 0)
  carrinhoCount.textContent = totalItems

  // Atualizar total
  const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
  carrinhoTotal.textContent = total.toFixed(2).replace(".", ",")

  // Atualizar items
  carrinhoItems.innerHTML = ""

  if (carrinho.length === 0) {
    carrinhoItems.innerHTML = '<p style="text-align: center; padding: 2rem;">Carrinho vazio</p>'
    return
  }

  carrinho.forEach((item) => {
    const itemDiv = document.createElement("div")
    itemDiv.className = "carrinho-item"
    itemDiv.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="item-info">
                <h4>${item.nome}</h4>
                <div class="item-preco">R$ ${item.preco.toFixed(2).replace(".", ",")} x ${item.quantidade}</div>
            </div>
            <button onclick="removerDoCarrinho(${item.id})" style="background: #e53e3e; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">×</button>
        `
    carrinhoItems.appendChild(itemDiv)
  })
}

function toggleCarrinho() {
  const carrinho = document.getElementById("carrinho")
  carrinho.classList.toggle("open")
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio!")
    return
  }

  let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n"

  carrinho.forEach((item) => {
    mensagem += `• ${item.nome} - Qtd: ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")}\n`
  })

  const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
  mensagem += `\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`

  const whatsappUrl = `https://wa.me/5521999999999?text=${encodeURIComponent(mensagem)}`
  window.open(whatsappUrl, "_blank")
}

// Formulários
function enviarOrcamento(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const dados = Object.fromEntries(formData)

  let mensagem = "Solicitação de Orçamento:\n\n"
  mensagem += `Nome: ${dados.nome}\n`
  mensagem += `Telefone: ${dados.telefone}\n`
  mensagem += `E-mail: ${dados.email || "Não informado"}\n`
  mensagem += `Máquina: ${dados.maquina || "Não informado"}\n`
  mensagem += `Descrição: ${dados.descricao || "Não informado"}\n`
  mensagem += `Horário preferido: ${dados.horario || "Não informado"}`

  const whatsappUrl = `https://wa.me/5521999999999?text=${encodeURIComponent(mensagem)}`
  window.open(whatsappUrl, "_blank")

  e.target.reset()
  mostrarNotificacao("Orçamento enviado! Entraremos em contato em breve.")
}

// Admin
function fazerLogin(e) {
  e.preventDefault()

  const senha = document.getElementById("adminPassword").value

  if (senha === "admin123") {
    document.getElementById("adminLogin").style.display = "none"
    document.getElementById("adminPanel").style.display = "block"
    carregarAdminProdutos()
  } else {
    alert("Senha incorreta!")
  }
}

function showTab(tabId) {
  // Esconder todas as abas
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active")
  })

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Mostrar aba selecionada
  document.getElementById(tabId).classList.add("active")
  event.target.classList.add("active")
}

function carregarAdminProdutos() {
  const lista = document.getElementById("adminProdutosList")
  lista.innerHTML = ""

  produtos.forEach((produto) => {
    const item = document.createElement("div")
    item.style.cssText = "border: 1px solid #e2e8f0; padding: 1rem; margin: 1rem 0; border-radius: 8px;"
    item.innerHTML = `
            <h4>${produto.nome}</h4>
            <p>Preço: R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>
            <p>Status: ${produto.status}</p>
            <button onclick="editarProduto(${produto.id})" class="btn-primary" style="margin-right: 1rem;">Editar</button>
            <button onclick="removerProduto(${produto.id})" style="background: #e53e3e; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer;">Remover</button>
        `
    lista.appendChild(item)
  })
}

function editarProduto(id) {
  const produto = produtos.find((p) => p.id === id)
  if (produto) {
    const novoNome = prompt("Nome do produto:", produto.nome)
    const novoPreco = prompt("Preço:", produto.preco)

    if (novoNome && novoPreco) {
      produto.nome = novoNome
      produto.preco = Number.parseFloat(novoPreco)
      carregarProdutos()
      carregarAdminProdutos()
      mostrarNotificacao("Produto atualizado!")
    }
  }
}

function removerProduto(id) {
  if (confirm("Tem certeza que deseja remover este produto?")) {
    produtos = produtos.filter((p) => p.id !== id)
    carregarProdutos()
    carregarAdminProdutos()
    mostrarNotificacao("Produto removido!")
  }
}

function showAddProductForm() {
  const nome = prompt("Nome do produto:")
  const descricao = prompt("Descrição:")
  const preco = prompt("Preço:")
  const tipo = prompt("Tipo (domestica, industrial, overlock, acessorios):")

  if (nome && descricao && preco && tipo) {
    const novoId = Math.max(...produtos.map((p) => p.id)) + 1

    produtos.push({
      id: novoId,
      nome: nome,
      descricao: descricao,
      preco: Number.parseFloat(preco),
      tipo: tipo,
      status: "disponivel",
      imagem: "/placeholder.svg?height=200&width=280",
    })

    carregarProdutos()
    carregarAdminProdutos()
    mostrarNotificacao("Produto adicionado!")
  }
}

// Utilitários
function mostrarNotificacao(mensagem) {
  const notificacao = document.createElement("div")
  notificacao.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4299e1;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1002;
        animation: slideIn 0.3s ease;
    `
  notificacao.textContent = mensagem

  document.body.appendChild(notificacao)

  setTimeout(() => {
    notificacao.remove()
  }, 3000)
}

// Mostrar seção admin quando clicado
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("admin-link")) {
    e.preventDefault()
    document.getElementById("admin").style.display = "block"
    document.getElementById("admin").scrollIntoView({ behavior: "smooth" })
  }
})
