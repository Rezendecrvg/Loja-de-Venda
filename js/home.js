// Carrossel
let slideIndex = 0

// Inicialização da página home
document.addEventListener("DOMContentLoaded", () => {
  inicializarCarrossel()
  carregarProdutosDestaque()
  carregarEstatisticasHome()

  // Escutar mudanças nos produtos
  window.addEventListener("dataChanged", (e) => {
    if (e.detail.tipo === "produtos") {
      carregarProdutosDestaque()
    }
    if (e.detail.tipo === "carrinho") {
      atualizarEstatisticasCarrinho()
    }
  })
})

// Carrossel
function inicializarCarrossel() {
  // Auto-play do carrossel
  setInterval(() => {
    slideIndex = (slideIndex + 1) % 3
    mostrarSlide(slideIndex)
  }, 5000)

  // Pausar auto-play quando hover
  const carouselContainer = document.querySelector(".carousel-container")
  if (carouselContainer) {
    let autoPlay = true

    carouselContainer.addEventListener("mouseenter", () => {
      autoPlay = false
    })

    carouselContainer.addEventListener("mouseleave", () => {
      autoPlay = true
    })
  }
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

  if (carousel && dots.length > 0) {
    carousel.style.transform = `translateX(-${index * 100}%)`

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index)
    })
  }
}

// Produtos em destaque
function carregarProdutosDestaque() {
  const grid = document.getElementById("produtosDestaque")
  if (!grid) return

  const produtos = window.dataManager.getProdutos()

  // Filtrar produtos disponíveis e pegar os 4 primeiros
  const produtosDisponiveis = produtos.filter((p) => p.status === "disponivel")
  const produtosDestaque = produtosDisponiveis.slice(0, 4)

  grid.innerHTML = ""

  if (produtosDestaque.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; grid-column: 1/-1; padding: 3rem; color: #718096;">
        <i class="fas fa-star" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
        <h3>Nenhum produto em destaque</h3>
        <p>Os produtos em destaque aparecerão aqui.</p>
        <a href="produtos.html" class="btn-primary" style="margin-top: 1rem;">Ver Todos os Produtos</a>
      </div>
    `
    return
  }

  produtosDestaque.forEach((produto) => {
    const produtoCard = criarProdutoCardDestaque(produto)
    grid.appendChild(produtoCard)
  })
}

function criarProdutoCardDestaque(produto) {
  const card = document.createElement("div")
  card.className = "produto-card destaque"
  card.innerHTML = `
    <div class="produto-badge">⭐ Destaque</div>
    <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
    <div class="produto-info">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <div class="produto-preco">R$ ${produto.preco.toFixed(2).replace(".", ",")}</div>
      <div class="produto-actions">
        <button class="btn-add-carrinho" onclick="adicionarAoCarrinho(${produto.id})">
          <i class="fas fa-cart-plus"></i>
          Adicionar
        </button>
        <a href="produtos.html" class="btn-secondary">Ver Mais</a>
      </div>
    </div>
  `
  return card
}

function carregarEstatisticasHome() {
  const stats = window.dataManager.getEstatisticas()

  // Atualizar números na página inicial se existirem elementos
  const elementos = {
    homeStatProdutos: stats.totalProdutos,
    homeStatCarrinho: stats.itensCarrinho,
    homeStatDisponivel: stats.produtosDisponiveis,
  }

  Object.entries(elementos).forEach(([id, valor]) => {
    const elemento = document.getElementById(id)
    if (elemento) {
      animarNumero(elemento, valor)
    }
  })
}

function atualizarEstatisticasCarrinho() {
  const stats = window.dataManager.getEstatisticas()
  const elemento = document.getElementById("homeStatCarrinho")
  if (elemento) {
    animarNumero(elemento, stats.itensCarrinho)
  }
}

function animarNumero(elemento, valorFinal) {
  const valorAtual = Number.parseInt(elemento.textContent) || 0
  const incremento = Math.ceil((valorFinal - valorAtual) / 10)

  if (valorAtual !== valorFinal) {
    elemento.textContent = Math.min(valorAtual + incremento, valorFinal)
    setTimeout(() => animarNumero(elemento, valorFinal), 50)
  }
}

// Adicionar estilos específicos para a home
const homeStyles = document.createElement("style")
homeStyles.textContent = `
  .produto-card.destaque {
    position: relative;
    border: 2px solid #4299e1;
  }
  
  .produto-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #4299e1;
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    z-index: 1;
  }
  
  .produto-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .produto-actions .btn-add-carrinho {
    flex: 1;
  }
  
  .produto-actions .btn-secondary {
    padding: 10px 15px;
    background: #718096;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
    transition: background 0.3s;
  }
  
  .produto-actions .btn-secondary:hover {
    background: #4a5568;
  }
`
document.head.appendChild(homeStyles)
