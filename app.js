// ==========================================
// NOTIFICAÇÕES (Módulo de Toast Global)
// ==========================================

function dispararToast(mensagem) {
    const toast = document.getElementById('toastAlert');
    const msgCorpo = document.getElementById('toastMessage');
    if (!toast || !msgCorpo) return;
    
    msgCorpo.innerText = mensagem;
    toast.classList.remove('translate-x-[150%]');
    
    setTimeout(() => {
        toast.classList.add('translate-x-[150%]');
    }, 4000);
}

// Limpa os campos de senha antes do reload para salvar apenas o e-mail
function dispararToastSucesso(mensagem) {
    const toast = document.getElementById('toastSuccess');
    const msgCorpo = document.getElementById('toastSuccessMessage');
    if (!toast || !msgCorpo) return;
    
    msgCorpo.innerText = mensagem;
    toast.classList.remove('translate-x-[150%]');
    
    const inputPassword = document.getElementById('password');
    const inputConfirm = document.getElementById('confirmPassword');
    if (inputPassword) inputPassword.value = '';
    if (inputConfirm) inputConfirm.value = '';
    
    setTimeout(() => {
        toast.classList.add('translate-x-[150%]');
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }, 3500);
}

// ==========================================
// AUTENTICAÇÃO (Login / Registro)
// ==========================================

async function signup(email, password) {
    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (!response.ok) {
            let msgErro = "Ocorreu um erro no cadastro.";
            if (data.msg === "User already registered" || data.message?.includes("already registered")) {
                msgErro = "Este e-mail já está credenciado no sistema.";
            } else if (data.msg) {
                msgErro = data.msg;
            }
            throw new Error(msgErro);
        }
        
        dispararToastSucesso('Cadastro realizado com sucesso! Faça o login.');
    } catch (error) {
        dispararToast(error.message);
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error_description || 'Credenciais inválidas ou conta não ativada.');
        
        localStorage.setItem('sb-session', JSON.stringify(data));
        window.location.href = 'dashboard.html';
    } catch (error) {
        dispararToast(error.message);
    }
}

function logout() {
    localStorage.removeItem('sb-session');
    window.location.href = 'index.html';
}

// ==========================================
// OPERAÇÕES DO CRUD (Lógica Central)
// ==========================================

async function initDashboard() {
    await popularMedicosMock(); 
    await carregarProfissionais();
    await carregarConsultas();
    document.getElementById('consultaForm').addEventListener('submit', salvarConsulta);
}

async function popularMedicosMock() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profissionais?select=*`, { headers: getHeaders() });
    const medicos = await res.json();
    if (medicos.length === 0) {
        await fetch(`${SUPABASE_URL}/rest/v1/profissionais`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify([
                { nome: "Dr. Carlos Eduardo", especialidade: "Cardiologia", registro_crm: "CRM/SP 123456" },
                { nome: "Dra. Ana Beatriz", especialidade: "Pediatria", registro_crm: "CRM/SP 654321" }
            ])
        });
    }
}

async function carregarProfissionais() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profissionais?select=*`, { headers: getHeaders() });
    const dados = await res.json();
    const select = document.getElementById('selectProfissional');
    if (select) {
        select.innerHTML = dados.map(p => `<option value="${p.id}">${p.nome} (${p.especialidade})</option>`).join('');
    }
}

async function carregarConsultas() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/consultas?select=*,profissionais(nome)`, { headers: getHeaders() });
    const consultas = await res.json();
    
    if(document.getElementById('kpiTotal')) {
        document.getElementById('kpiTotal').innerText = consultas.length;
        
        const faturamento = consultas.reduce((acc, curr) => acc + parseFloat(curr.preco || 0), 0);
        document.getElementById('kpiReceita').innerText = `R$ ${faturamento.toFixed(2)}`;
        
        const urgencias = consultas.filter(c => c.tipo_consulta === 'Urgência').length;
        document.getElementById('kpiUrgencia').innerText = urgencias;
    }

    const container = document.getElementById('consultasCardsContainer');
    if (!container) return;
    
    if (consultas.length === 0) {
        container.innerHTML = `
            <div class="bg-[#042223] p-8 text-center rounded-2xl border border-teal-900 text-teal-400 text-sm font-medium">
                Nenhum paciente agendado no momento.
            </div>`;
        return;
    }

    container.innerHTML = consultas.map(c => {
        let badgeColor = "bg-teal-950 text-teal-300 border-teal-800";
        if (c.tipo_consulta === 'Urgência') badgeColor = "bg-red-950 text-red-400 border-red-800 font-extrabold animate-pulse";
        if (c.tipo_consulta === 'Retorno') badgeColor = "bg-slate-800 text-slate-300 border-slate-700";

        // CORRIGIDO: Substituída a estrutura da letra inicial pela tag img com avatar genérico
        return `
        <div class="bg-[#042223] p-5 rounded-2xl border border-teal-900 shadow-sm hover:shadow-md hover:border-teal-800 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-start space-x-4">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80" 
                     alt="Avatar do Paciente" 
                     class="w-10 h-10 rounded-xl object-cover border border-teal-800 shadow-inner">
                <div>
                    <h4 class="text-sm font-black text-white tracking-tight">${c.nome_paciente}</h4>
                    <p class="text-xs text-slate-400 mt-0.5 flex items-center">
                        <span class="font-medium text-teal-400 mr-2">Médico:</span> ${c.profissionais ? c.profissionais.nome : 'Não alocado'}
                    </p>
                    <p class="text-[11px] text-slate-500 mt-1 italic">${c.observacoes || 'Sem observações clínicas.'}</p>
                </div>
            </div>
            
            <div class="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-teal-900/60">
                <div class="text-left md:text-right">
                    <span class="px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${badgeColor}">
                        ${c.tipo_consulta}
                    </span>
                    <p class="text-xs font-bold text-slate-300 mt-2">${new Date(c.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                </div>
                
                <div class="text-right">
                    <p class="text-sm font-black text-white">R$ ${parseFloat(c.preco).toFixed(2)}</p>
                    <div class="mt-2 space-x-3">
                        <button onclick="editarConsulta(${JSON.stringify(c).replace(/"/g, '&quot;')})" class="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition">Editar</button>
                        <button onclick="deletarConsulta(${c.id})" class="text-xs font-bold text-red-400 hover:text-red-500 transition">Excluir</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

async function salvarConsulta(e) {
    e.preventDefault();
    const session = JSON.parse(localStorage.getItem('sb-session'));
    
    const inputPaciente = document.getElementById('paciente');
    const inputDataHora = document.getElementById('dataHora');
    const inputPreco = document.getElementById('preco');
    
    const erroPaciente = document.getElementById('erro-paciente');
    const erroDataHora = document.getElementById('erro-dataHora');
    const erroPreco = document.getElementById('erro-preco');
    
    let formularioValido = true;

    if (!inputPaciente.value.trim()) {
        erroPaciente.classList.remove('hidden');
        inputPaciente.classList.add('border-red-500', 'focus:ring-red-500/10', 'focus:border-red-500');
        formularioValido = false;
    } else {
        erroPaciente.classList.add('hidden');
        inputPaciente.classList.remove('border-red-500', 'focus:ring-red-500/10', 'focus:border-red-500');
    }

    if (!inputDataHora.value) {
        erroDataHora.classList.remove('hidden');
        inputDataHora.classList.add('border-red-500', 'focus:ring-red-500/10', 'focus:border-red-500');
        formularioValido = false;
    } else {
        erroDataHora.classList.add('hidden');
        inputDataHora.classList.remove('border-red-500', 'focus:ring-red-500/10', 'focus:border-red-500');
    }

    if (!inputPreco.value || parseFloat(inputPreco.value) < 0) {
        erroPreco.classList.remove('hidden');
        inputPreco.classList.add('border-red-500', 'focus:ring-red-500/10', 'focus:border-red-500');
        formularioValido = false;
    } else {
        erroPreco.classList.add('hidden');
        inputPreco.classList.remove('border-red-500', 'focus:ring-red-500/10', 'focus:border-red-500');
    }

    if (!formularioValido) {
        dispararToast('Preencha os campos obrigatórios sinalizados. ⚠️');
        return;
    }

    const id = document.getElementById('consultaId').value;
    const payload = {
        nome_paciente: inputPaciente.value,
        profissional_id: document.getElementById('selectProfissional').value,
        data_hora: inputDataHora.value,
        tipo_consulta: document.getElementById('tipo').value,
        preco: inputPreco.value,
        observacoes: document.getElementById('observacoes').value,
        user_id: session.user.id
    };

    let url = `${SUPABASE_URL}/rest/v1/consultas`;
    let method = 'POST';

    if (id) {
        url += `?id=eq.${id}`;
        method = 'PATCH';
    }

    const res = await fetch(url, {
        method: method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        resetForm();
        carregarConsultas();
    } else {
        dispararToast('Erro ao salvar dados no Supabase.');
    }
}

function editarConsulta(consulta) {
    document.getElementById('formModalTitle').innerText = "Editar Prontuário";
    document.getElementById('consultaId').value = consulta.id;
    document.getElementById('paciente').value = consulta.nome_paciente;
    document.getElementById('selectProfissional').value = consulta.profissional_id;
    document.getElementById('dataHora').value = consulta.data_hora.substring(0, 16);
    document.getElementById('tipo').value = consulta.tipo_consulta;
    document.getElementById('preco').value = consulta.preco;
    document.getElementById('observacoes').value = consulta.observacoes;
}

// ==========================================
// MÓDULO EXCLUSÃO CUSTOMIZADA
// ==========================================
let idParaExcluir = null;

function deletarConsulta(id) {
    idParaExcluir = id;
    const modal = document.getElementById('deleteModal');
    if(modal) modal.classList.remove('hidden');
    
    document.getElementById('btnConfirmDelete').onclick = async () => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/consultas?id=eq.${idParaExcluir}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        if (res.ok) {
            fecharModalExcluir();
            carregarConsultas();
        } else {
            dispararToast('Erro ao remover consulta.');
        }
    };
}

function fecharModalExcluir() {
    const modal = document.getElementById('deleteModal');
    if(modal) modal.classList.add('hidden');
    idParaExcluir = null;
}

function resetForm() {
    document.getElementById('formModalTitle').innerText = "Agendar Prontuário";
    document.getElementById('consultaForm').reset();
    document.getElementById('consultaId').value = '';
    
    ['paciente', 'dataHora', 'preco'].forEach(id => {
        const input = document.getElementById(id);
        const erro = document.getElementById(`erro-${id}`);
        if(input) input.classList.remove('border-red-500', 'focus:ring-red-500/10', 'focus:border-red-500');
        if(erro) erro.classList.add('hidden');
    });
}