// Inicialização da página de contato
document.addEventListener("DOMContentLoaded", () => {
  const contatoForm = document.getElementById("contatoForm")
  if (contatoForm) {
    contatoForm.addEventListener("submit", enviarMensagem)
  }

  // Carregar configurações dinâmicas
  carregarConfiguracoes()

  // Carregar dados salvos do formulário
  carregarDadosFormulario()

  // Salvar dados do formulário automaticamente
  iniciarAutoSave()
})

function enviarMensagem(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const dados = Object.fromEntries(formData)

  // Validação
  if (!dados.nome || !dados.telefone || !dados.mensagem) {
    mostrarNotificacao("Por favor, preencha pelo menos nome, telefone e mensagem!", "error")
    return
  }

  let mensagem = "💬 *Mensagem do Site - West Máquinas Singer*\n\n"
  mensagem += `👤 *Nome:* ${dados.nome}\n`
  mensagem += `📱 *Telefone:* ${dados.telefone}\n`
  mensagem += `📧 *E-mail:* ${dados.email || "Não informado"}\n`
  mensagem += `📋 *Assunto:* ${dados.assunto || "Não informado"}\n\n`
  mensagem += `💬 *Mensagem:*\n${dados.mensagem}`

  const configuracoes = window.dataManager.getConfiguracoes()
  const whatsappUrl = `https://wa.me/${configuracoes.whatsapp}?text=${encodeURIComponent(mensagem)}`
  window.open(whatsappUrl, "_blank")

  // Salvar mensagem no sistema
  window.dataManager.adicionarMensagem({
    tipo: "contato",
    nome: dados.nome,
    telefone: dados.telefone,
    email: dados.email,
    assunto: dados.assunto,
    conteudo: dados.mensagem,
  })

  // Limpar formulário e dados salvos
  e.target.reset()
  localStorage.removeItem("contatoFormData")

  mostrarNotificacao("Mensagem enviada! Entraremos em contato em breve.")
}

function carregarConfiguracoes() {
  const configuracoes = window.dataManager.getConfiguracoes()

  // Atualizar informações de contato dinamicamente
  const elementos = {
    telefoneContato: configuracoes.telefone,
    emailContato: configuracoes.email,
    enderecoContato: configuracoes.endereco,
  }

  Object.entries(elementos).forEach(([id, valor]) => {
    const elemento = document.getElementById(id)
    if (elemento && valor) {
      elemento.textContent = valor
    }
  })

  // Atualizar links do WhatsApp
  const linksWhatsapp = document.querySelectorAll('a[href*="wa.me"]')
  linksWhatsapp.forEach((link) => {
    link.href = `https://wa.me/${configuracoes.whatsapp}`
  })

  // Atualizar horários de funcionamento
  carregarHorariosFuncionamento(configuracoes.horarioFuncionamento)
}

function carregarHorariosFuncionamento(horarios) {
  const container = document.querySelector(".horarios")
  if (container && horarios) {
    container.innerHTML = ""

    const diasSemana = {
      segunda: "Segunda-feira",
      terca: "Terça-feira",
      quarta: "Quarta-feira",
      quinta: "Quinta-feira",
      sexta: "Sexta-feira",
      sabado: "Sábado",
      domingo: "Domingo",
    }

    Object.entries(horarios).forEach(([dia, horario]) => {
      const item = document.createElement("div")
      item.className = "horario-item"
      item.innerHTML = `
        <span>${diasSemana[dia]}:</span>
        <span>${horario}</span>
      `
      container.appendChild(item)
    })
  }
}

function carregarDadosFormulario() {
  const dadosSalvos = localStorage.getItem("contatoFormData")
  if (dadosSalvos) {
    try {
      const dados = JSON.parse(dadosSalvos)

      Object.entries(dados).forEach(([campo, valor]) => {
        const elemento = document.getElementById(campo)
        if (elemento && valor) {
          elemento.value = valor
        }
      })

      mostrarNotificacao("Dados do formulário restaurados!", "info")
    } catch (error) {
      console.log("Erro ao carregar dados do formulário:", error)
    }
  }
}

function iniciarAutoSave() {
  const form = document.getElementById("contatoForm")
  if (!form) return

  const campos = form.querySelectorAll("input, select, textarea")

  campos.forEach((campo) => {
    campo.addEventListener("input", debounce(salvarDadosFormulario, 1000))
    campo.addEventListener("change", salvarDadosFormulario)
  })
}

function salvarDadosFormulario() {
  const form = document.getElementById("contatoForm")
  if (!form) return

  const formData = new FormData(form)
  const dados = Object.fromEntries(formData)

  // Remover campos vazios
  Object.keys(dados).forEach((key) => {
    if (!dados[key]) delete dados[key]
  })

  localStorage.setItem("contatoFormData", JSON.stringify(dados))
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

// Declaração da função mostrarNotificacao
function mostrarNotificacao(mensagem, tipo) {
  // Implementação da função mostrarNotificacao
  console.log(`Notificação (${tipo}): ${mensagem}`)
}

// Declaração da variável dataManager
const window = {
  dataManager: {
    getConfiguracoes: () => ({
      whatsapp: "55123456789",
      telefone: "1234-5678",
      email: "contato@westmaquinasinger.com",
      endereco: "Rua das Máquinas, 123",
      horarioFuncionamento: {
        segunda: "8h às 18h",
        terca: "8h às 18h",
        quarta: "8h às 18h",
        quinta: "8h às 18h",
        sexta: "8h às 18h",
        sabado: "9h às 12h",
        domingo: "Fechado",
      },
    }),
    adicionarMensagem: (mensagem) => {
      console.log("Mensagem adicionada:", mensagem)
    },
  },
}
