// --- CONFIGURAÇÃO DO SUPABASE ---
const SUPABASE_URL = 'https://hzgqlkbljyojpkjethol.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6Z3Fsa2JsanlvanBramV0aG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5ODY4MzcsImV4cCI6MjEwODU2MjgzN30.6bYpzS8TvqNC3wc2gYQt3Jp0ZKGBHCY8FhYaaLCirdY';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- LÓGICA DO INDEX.HTML (Formulário) ---
const formAgendamento = document.getElementById('formAgendamento');
if (formAgendamento) {
    formAgendamento.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const servico = document.getElementById('servico').value;
        const data_hora = document.getElementById('data_hora').value;
        const mensagemDiv = document.getElementById('mensagem');

        const { data, error } = await _supabase
            .from('agendamentos')
            .insert([{ nome, whatsapp, servico, data_hora, status: 'pendente' }]);

        mensagemDiv.classList.remove('hidden');
        if (error) {
            mensagemDiv.textContent = 'Erro ao agendar. Tente novamente.';
            mensagemDiv.className = 'mt-4 text-center text-sm font-medium text-red-600';
            console.error;
        } else {
        mensagemDiv.classList.remove('hidden');
        if (error) {
            mensagemDiv.textContent = 'Erro ao agendar. Tente novamente.';
            mensagemDiv.className = 'mt-4 text-center text-sm font-medium text-red-600';
            console.error(error);
        } else {
            mensagemDiv.textContent = 'Agendamento realizado com sucesso! ✨';
            mensagemDiv.className = 'mt-4 text-center text-sm font-medium text-green-600';
            formAgendamento.reset();

            // --- AQUI ENTRA O CÓDIGO DO WHATSAPP ---
            const seuNumeroWhatsApp = "5527999998888"; // Coloque o seu número real com DDD
            
            const mensagem = `Olá! Quero confirmar meu agendamento:\n\n` +
                             `👤 *Nome:* ${nome}\n` +
                             `💅 *Serviço:* ${servico}\n` +
                             `📅 *Data/Hora:* ${data_hora}`;
            
            const urlWhatsApp = `https://api.whatsapp.com/send?phone=${seuNumeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
            window.open(urlWhatsApp, '_blank');
            // ----------------------------------------
        }
    });
}

// --- LÓGICA DO ADMIN.HTML (Tabela) ---
const tabelaAgendamentos = document.getElementById('tabelaAgendamentos');
async function carregarAgendamentos() {
    if (!tabelaAgendamentos) return;

    const { data, error } = await _supabase
        .from('agendamentos')
        .select('*')
        .order('data_hora', { ascending: true });

    if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return;
    }

    tabelaAgendamentos.innerHTML = '';
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="p-4 font-medium">${item.nome}</td>
            <td class="p-4">${item.whatsapp}</td>
            <td class="p-4">${item.servico}</td>
            <td class="p-4">${new Date(item.data_hora).toLocaleString('pt-BR')}</td>
            <td class="p-4">
                <button onclick="deletarAgendamento('${item.id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Excluir</button>
            </td>
        `;
        tabelaAgendamentos.appendChild(tr);
    });
}

async function deletarAgendamento(id) {
    const { error } = await _supabase.from('agendamentos').delete().eq('id', id);
    if (!error) {
        carregarAgendamentos();
    }
}

if (tabelaAgendamentos) {
    carregarAgendamentos();
}