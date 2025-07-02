// Inicialização da página de orçamento
document.addEventListener("DOMContentLoaded", () => {
  const orcamentoForm = document.getElementById("orcamentoForm")
  if (orcamentoForm) {
    orcamentoForm.addEventListener("submit", enviarOrcamento)
  }

  // Carregar dados salvos do formulário
  carregarDadosFormulario()

  // Salvar dados do formulário automaticamente
  iniciarAutoSave()
})

function enviarOrcamento(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const dados = Object.fromEntries(formData)

  // Validação
  if (!dados.nome || !dados.telefone) {
    window.alert("Por favor, preencha pelo menos o nome e telefone!")
    return
  }

  let mensagem = "📋 *Solicitação de Orçamento - West Máquinas Singer*\n\n"
  mensagem += `👤 *Nome:* ${dados.nome}\n`
  mensagem += `📱 *Telefone:* ${dados.telefone}\n`
  mensagem += `📧 *E-mail:* ${dados.email || "Não informado"}\n`
  mensagem += `🏙️ *Cidade:* ${dados.cidade || "Não informado"}\n\n`

  mensagem += `🔧 *Informações da Máquina:*\n`
  mensagem += `• Tipo: ${dados.tipoMaquina || "Não informado"}\n`
  mensagem += `• Marca/Modelo: ${dados.marca || "Não informado"}\n\n`

  mensagem += `🛠️ *Serviço:* ${dados.tipoServico || "Não informado"}\n`
  mensagem += `📝 *Descrição:* ${dados.descricao || "Não informado"}\n\n`

  mensagem += `⏰ *Agendamento:*\n`
  mensagem += `• Horário preferido: ${dados.horario || "Não informado"}\n`
  mensagem += `• Urgência: ${dados.urgencia || "Normal"}\n`

  const configuracoes = {
    whatsapp: "1234567890",
  }
  const whatsappUrl = `https://wa.me/${configuracoes.whatsapp}?text=${encodeURIComponent(mensagem)}`
  window.open(whatsappUrl, "_blank")

  // Salvar orçamento nas mensagens
  const dataManager = {
    adicionarMensagem: (mensagem) => {
      console.log("Mensagem adicionada:", mensagem)
    },
    getConfiguracoes: () => configuracoes,
  }
  dataManager.adicionarMensagem({
    tipo: "orcamento",
    nome: dados.nome,
    telefone: dados.telefone,
    email: dados.email,
    conteudo: mensagem,
    cidade: dados.cidade,
    tipoMaquina: dados.tipoMaquina,
    tipoServico: dados.tipoServico,
    urgencia: dados.urgencia,
  })

  // Limpar formulário e dados salvos
  e.target.reset()
  localStorage.removeItem("orcamentoFormData")

  window.alert("Orçamento enviado! Entraremos em contato em breve.")
}

function carregarDadosFormulario() {
  const dadosSalvos = localStorage.getItem("orcamentoFormData")
  if (dadosSalvos) {
    try {
      const dados = JSON.parse(dadosSalvos)

      Object.entries(dados).forEach(([campo, valor]) => {
        const elemento = document.getElementById(campo)
        if (elemento && valor) {
          elemento.value = valor
        }
      })

      window.alert("Dados do formulário restaurados!", "info")
    } catch (error) {
      console.log("Erro ao carregar dados do formulário:", error)
    }
  }
}

function iniciarAutoSave() {
  const form = document.getElementById("orcamentoForm")
  if (!form) return

  const campos = form.querySelectorAll("input, select, textarea")

  campos.forEach((campo) => {
    campo.addEventListener("input", debounce(salvarDadosFormulario, 1000))
    campo.addEventListener("change", salvarDadosFormulario)
  })
}

function salvarDadosFormulario() {
  const form = document.getElementById("orcamentoForm")
  if (!form) return

  const formData = new FormData(form)
  const dados = Object.fromEntries(formData)

  // Remover campos vazios
  Object.keys(dados).forEach((key) => {
    if (!dados[key]) delete dados[key]
  })

  localStorage.setItem("orcamentoFormData", JSON.stringify(dados))
}

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
