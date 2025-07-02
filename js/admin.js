// Inicialização da página admin
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", fazerLogin)
  }

  const produtoForm = document.getElementById("produtoForm")
  if (produtoForm) {
    produtoForm.addEventListener("submit", salvarProduto)
  }

  // Verificar se já está logado
  if (localStorage.getItem("adminLogado") === "true") {
    mostrarPainelAdmin()
  }

  // Escutar mudanças nos dados
  window.addEventListener("dataChanged", (e) => {
    if (e.detail.tipo === "produtos" || e.detail.tipo === "mensagens") {
      atualizarEstatisticas()
      if (e.detail.tipo === "produtos") {
        carregarAdminProdutos()
      }
      if (e.detail.tipo === "mensagens") {
        carregarMensagens()
      }
    }
  })
})

function fazerLogin(e) {
  e.preventDefault()

  const senha = document.getElementById("adminPassword").value

  if (senha === "admin123") {
    localStorage.setItem("adminLogado", "true")
    localStorage.setItem("ultimoLogin", new Date().toISOString())
    mostrarPainelAdmin()
    mostrarNotificacao("Login realizado com sucesso!")
  } else {
    mostrarNotificacao("Senha incorreta! Use: admin123", "error")
    // Limpar campo de senha
    document.getElementById("adminPassword").value = ""
    // Adicionar efeito visual de erro
    const passwordField = document.getElementById("adminPassword")
    passwordField.style.borderColor = "#e53e3e"
    setTimeout(() => {
      passwordField.style.borderColor = "#e2e8f0"
    }, 2000)
  }
}

const dataManager = {
  salvarConfiguracao: (key, value) => {
    localStorage.setItem(key, value)
  },
  getProdutos: () => {
    return JSON.parse(localStorage.getItem("produtos") || "[]")
  },
  adicionarProduto: (produto) => {
    const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")
    produto.id = produtos.length + 1
    produtos.push(produto)
    localStorage.setItem("produtos", JSON.stringify(produtos))
  },
  editarProduto: (id, produto) => {
    const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")
    const index = produtos.findIndex((p) => p.id === id)
    if (index !== -1) {
      produtos[index] = produto
      localStorage.setItem("produtos", JSON.stringify(produtos))
    }
  },
  removerProduto: (id) => {
    const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")
    const filteredProdutos = produtos.filter((p) => p.id !== id)
    localStorage.setItem("produtos", JSON.stringify(filteredProdutos))
  },
  getMensagens: () => {
    return JSON.parse(localStorage.getItem("mensagens") || "[]")
  },
  marcarMensagemComoLida: (id) => {
    const mensagens = JSON.parse(localStorage.getItem("mensagens") || "[]")
    const index = mensagens.findIndex((m) => m.id === id)
    if (index !== -1) {
      mensagens[index].lida = true
      localStorage.setItem("mensagens", JSON.stringify(mensagens))
    }
  },
  getPromocoes: () => {
    return JSON.parse(localStorage.getItem("promocoes") || "[]")
  },
  getEstatisticas: () => {
    const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")
    const mensagens = JSON.parse(localStorage.getItem("mensagens") || "[]")
    const promocoes = JSON.parse(localStorage.getItem("promocoes") || "[]")
    const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]")

    return {
      totalProdutos: produtos.length,
      itensCarrinho: carrinho.length,
      totalMensagens: mensagens.length,
      mensagensNaoLidas: mensagens.filter((m) => !m.lida).length,
      produtosDisponiveis: produtos.filter((p) => p.status === "disponível").length,
      produtosEncomenda: produtos.filter((p) => p.status === "encomenda").length,
      valorCarrinho: carrinho.reduce((total, item) => total + item.preco, 0),
      promocoesAtivas: promocoes.length,
    }
  },
  exportarDados: () => {
    return {
      produtos: JSON.parse(localStorage.getItem("produtos") || "[]"),
      mensagens: JSON.parse(localStorage.getItem("mensagens") || "[]"),
      promocoes: JSON.parse(localStorage.getItem("promocoes") || "[]"),
      carrinho: JSON.parse(localStorage.getItem("carrinho") || "[]"),
    }
  },
  importarDados: (dados) => {
    localStorage.setItem("produtos", JSON.stringify(dados.produtos || []))
    localStorage.setItem("mensagens", JSON.stringify(dados.mensagens || []))
    localStorage.setItem("promocoes", JSON.stringify(dados.promocoes || []))
    localStorage.setItem("carrinho", JSON.stringify(dados.carrinho || []))
  },
  limparTodosDados: () => {
    localStorage.removeItem("produtos")
    localStorage.removeItem("mensagens")
    localStorage.removeItem("promocoes")
    localStorage.removeItem("carrinho")
  },
}

function mostrarPainelAdmin() {
  const adminLogin = document.getElementById("adminLogin")
  const adminPanel = document.getElementById("adminPanel")

  if (adminLogin && adminPanel) {
    adminLogin.style.display = "none"
    adminPanel.style.display = "block"
    carregarAdminProdutos()
    carregarMensagens()
    carregarPromocoes()
    atualizarEstatisticas()
  }
}

function logout() {
  localStorage.removeItem("adminLogado")
  dataManager.salvarConfiguracao("ultimoLogout", new Date().toISOString())
  location.reload()
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
  const targetTab = document.getElementById(tabId)
  if (targetTab) {
    targetTab.classList.add("active")
  }

  // Ativar botão clicado
  if (event && event.target) {
    event.target.classList.add("active")
  }

  // Carregar dados específicos da aba
  switch (tabId) {
    case "produtos-tab":
      carregarAdminProdutos()
      break
    case "mensagens-tab":
      carregarMensagens()
      break
    case "promocoes-tab":
      carregarPromocoes()
      break
    case "estatisticas-tab":
      atualizarEstatisticas()
      break
  }
}

function carregarAdminProdutos() {
  const lista = document.getElementById("adminProdutosList")
  if (!lista) return

  const produtos = dataManager.getProdutos()

  lista.innerHTML = ""

  if (produtos.length === 0) {
    lista.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box"></i>
        <p>Nenhum produto cadastrado</p>
        <button onclick="showAddProductForm()" class="btn-primary">Adicionar Primeiro Produto</button>
      </div>
    `
    return
  }

  produtos.forEach((produto) => {
    const item = document.createElement("div")
    item.className = "admin-produto-item"
    item.innerHTML = `
      <div class="produto-info-admin">
        <h4>${produto.nome}</h4>
        <p>
          <strong>Preço:</strong> R$ ${produto.preco.toFixed(2).replace(".", ",")} | 
          <strong>Status:</strong> ${produto.status} | 
          <strong>Tipo:</strong> ${produto.tipo}
        </p>
        <p><strong>Marca:</strong> ${produto.marca || "N/A"} | <strong>Modelo:</strong> ${produto.modelo || "N/A"}</p>
        <small>${produto.descricao}</small>
      </div>
      <div class="produto-actions">
        <button onclick="editarProduto(${produto.id})" class="btn-edit">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button onclick="duplicarProduto(${produto.id})" class="btn-secondary">
          <i class="fas fa-copy"></i> Duplicar
        </button>
        <button onclick="removerProduto(${produto.id})" class="btn-delete">
          <i class="fas fa-trash"></i> Remover
        </button>
      </div>
    `
    lista.appendChild(item)
  })
}

function editarProduto(id) {
  const produtos = dataManager.getProdutos()
  const produto = produtos.find((p) => p.id === id)

  if (produto) {
    document.getElementById("modalTitle").textContent = "Editar Produto"
    document.getElementById("produtoId").value = produto.id
    document.getElementById("produtoNome").value = produto.nome
    document.getElementById("produtoDescricao").value = produto.descricao
    document.getElementById("produtoPreco").value = produto.preco
    document.getElementById("produtoTipo").value = produto.tipo
    document.getElementById("produtoStatus").value = produto.status

    document.getElementById("produtoModal").style.display = "flex"
  }
}

function duplicarProduto(id) {
  const produtos = dataManager.getProdutos()
  const produto = produtos.find((p) => p.id === id)

  if (produto) {
    const produtoDuplicado = {
      ...produto,
      nome: produto.nome + " (Cópia)",
      id: undefined, // Será gerado automaticamente
    }

    dataManager.adicionarProduto(produtoDuplicado)
    mostrarNotificacao("Produto duplicado com sucesso!")
  }
}

function removerProduto(id) {
  if (confirm("Tem certeza que deseja remover este produto?")) {
    dataManager.removerProduto(id)
    mostrarNotificacao("Produto removido com sucesso!")
  }
}

function showAddProductForm() {
  document.getElementById("modalTitle").textContent = "Adicionar Produto"
  document.getElementById("produtoForm").reset()
  document.getElementById("produtoId").value = ""
  document.getElementById("produtoModal").style.display = "flex"
}

function closeModal() {
  document.getElementById("produtoModal").style.display = "none"
}

function salvarProduto(e) {
  e.preventDefault()

  const id = document.getElementById("produtoId").value
  const nome = document.getElementById("produtoNome").value
  const descricao = document.getElementById("produtoDescricao").value
  const preco = Number.parseFloat(document.getElementById("produtoPreco").value)
  const tipo = document.getElementById("produtoTipo").value
  const status = document.getElementById("produtoStatus").value

  // Validação
  if (!nome || !descricao || !preco || !tipo || !status) {
    mostrarNotificacao("Por favor, preencha todos os campos obrigatórios!", "error")
    return
  }

  if (preco <= 0) {
    mostrarNotificacao("O preço deve ser maior que zero!", "error")
    return
  }

  const dadosProduto = {
    nome,
    descricao,
    preco,
    tipo,
    status,
    marca: "Singer", // Valor padrão
    modelo: nome.split(" ").slice(-1)[0], // Último palavra do nome
    categoria: tipo.charAt(0).toUpperCase() + tipo.slice(1),
    garantia: "12 meses",
    peso: "N/A",
  }

  if (id) {
    // Editar produto existente
    dataManager.editarProduto(Number.parseInt(id), dadosProduto)
    mostrarNotificacao("Produto atualizado com sucesso!")
  } else {
    // Adicionar novo produto
    dataManager.adicionarProduto(dadosProduto)
    mostrarNotificacao("Produto adicionado com sucesso!")
  }

  closeModal()
}

function carregarMensagens() {
  const mensagensList = document.getElementById("mensagensList")
  if (!mensagensList) return

  const mensagens = dataManager.getMensagens()

  if (mensagens.length === 0) {
    mensagensList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-envelope-open"></i>
        <p>Nenhuma mensagem recebida</p>
        <small>As mensagens dos formulários aparecerão aqui</small>
      </div>
    `
    return
  }

  mensagensList.innerHTML = ""

  mensagens.forEach((mensagem) => {
    const item = document.createElement("div")
    item.className = `mensagem-item ${mensagem.lida ? "lida" : "nao-lida"}`

    const data = new Date(mensagem.data).toLocaleString("pt-BR")
    const tipoIcon = {
      pedido: "fas fa-shopping-cart",
      orcamento: "fas fa-calculator",
      contato: "fas fa-envelope",
      default: "fas fa-message",
    }

    item.innerHTML = `
      <div class="mensagem-header">
        <div class="mensagem-info">
          <i class="${tipoIcon[mensagem.tipo] || tipoIcon.default}"></i>
          <strong>${mensagem.nome}</strong>
          <span class="mensagem-tipo">${mensagem.tipo}</span>
        </div>
        <div class="mensagem-data">${data}</div>
      </div>
      <div class="mensagem-conteudo">
        <p><strong>Telefone:</strong> ${mensagem.telefone}</p>
        ${mensagem.email ? `<p><strong>Email:</strong> ${mensagem.email}</p>` : ""}
        ${mensagem.valor ? `<p><strong>Valor:</strong> R$ ${mensagem.valor.toFixed(2).replace(".", ",")}</p>` : ""}
        <p><strong>Mensagem:</strong></p>
        <div class="mensagem-texto">${mensagem.conteudo}</div>
      </div>
      <div class="mensagem-actions">
        ${!mensagem.lida ? `<button onclick="marcarComoLida(${mensagem.id})" class="btn-primary">Marcar como Lida</button>` : ""}
        <button onclick="responderMensagem('${mensagem.telefone}')" class="btn-whatsapp">
          <i class="fab fa-whatsapp"></i> Responder
        </button>
      </div>
    `

    mensagensList.appendChild(item)
  })
}

function marcarComoLida(id) {
  dataManager.marcarMensagemComoLida(id)
  mostrarNotificacao("Mensagem marcada como lida!")
}

function responderMensagem(telefone) {
  const whatsappUrl = `https://wa.me/${telefone.replace(/\D/g, "")}`
  window.open(whatsappUrl, "_blank")
}

function carregarPromocoes() {
  const promocoesList = document.getElementById("promocoesList")
  if (!promocoesList) return

  const promocoes = dataManager.getPromocoes()

  if (promocoes.length === 0) {
    promocoesList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-tags"></i>
        <p>Nenhuma promoção ativa</p>
        <button onclick="adicionarPromocao()" class="btn-primary">Criar Promoção</button>
      </div>
    `
    return
  }

  // Implementar lista de promoções
  promocoesList.innerHTML = "<p>Funcionalidade de promoções em desenvolvimento</p>"
}

function atualizarEstatisticas() {
  const stats = dataManager.getEstatisticas()

  // Atualizar elementos das estatísticas
  const elementos = {
    totalProdutos: stats.totalProdutos,
    produtosCarrinho: stats.itensCarrinho,
    totalMensagens: stats.totalMensagens,
    mensagensNaoLidas: stats.mensagensNaoLidas,
  }

  Object.entries(elementos).forEach(([id, valor]) => {
    const elemento = document.getElementById(id)
    if (elemento) {
      elemento.textContent = valor
    }
  })

  // Adicionar estatísticas extras se existir container
  const statsExtras = document.getElementById("statsExtras")
  if (statsExtras) {
    statsExtras.innerHTML = `
      <div class="stat-card">
        <i class="fas fa-check-circle"></i>
        <div class="stat-info">
          <h4>Produtos Disponíveis</h4>
          <span class="stat-number">${stats.produtosDisponiveis}</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-clock"></i>
        <div class="stat-info">
          <h4>Sob Encomenda</h4>
          <span class="stat-number">${stats.produtosEncomenda}</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-dollar-sign"></i>
        <div class="stat-info">
          <h4>Valor em Carrinho</h4>
          <span class="stat-number">R$ ${stats.valorCarrinho.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-tags"></i>
        <div class="stat-info">
          <h4>Promoções Ativas</h4>
          <span class="stat-number">${stats.promocoesAtivas}</span>
        </div>
      </div>
    `
  }
}

// Funções de backup e restore
function exportarDados() {
  const dados = dataManager.exportarDados()
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `backup-west-maquinas-${new Date().toISOString().split("T")[0]}.json`
  a.click()

  URL.revokeObjectURL(url)
  mostrarNotificacao("Backup exportado com sucesso!")
}

function importarDados() {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = ".json"

  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const dados = JSON.parse(e.target.result)
          dataManager.importarDados(dados)
          mostrarNotificacao("Dados importados com sucesso!")
          location.reload()
        } catch (error) {
          mostrarNotificacao("Erro ao importar dados!", "error")
        }
      }
      reader.readAsText(file)
    }
  }

  input.click()
}

function resetarDados() {
  if (confirm("Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita!")) {
    dataManager.limparTodosDados()
    mostrarNotificacao("Dados resetados com sucesso!")
    location.reload()
  }
}

function mostrarNotificacao(mensagem, tipo = "success") {
  // Usar a função do common.js
  if (typeof window.mostrarNotificacao === "function") {
    window.mostrarNotificacao(mensagem, tipo)
  } else {
    alert(mensagem)
  }
}

// Fechar modal ao clicar fora
window.addEventListener("click", (e) => {
  const modal = document.getElementById("produtoModal")
  if (e.target === modal) {
    closeModal()
  }
})

// Fechar modal com ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal()
  }
})
