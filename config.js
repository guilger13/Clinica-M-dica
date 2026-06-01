// Configurações do Supabase - INSIRA SUAS CHAVES AQUI
const SUPABASE_URL = "https://jycsrcohrivewgeiebne.supabase.co";
const SUPABASE_KEY = "sb_publishable_eKcmI3VPPSwT65zOTeFVww_pf9Dn2yd";

// Cabeçalhos padrão para as requisições REST API
function getHeaders() {
    const session = JSON.parse(localStorage.getItem('sb-session'));
    return {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": session ? `Bearer ${session.access_token}` : `Bearer ${SUPABASE_KEY}`
    };
}

// Verificar se o usuário está logado nas páginas protegidas
function checkAuth() {
    const session = localStorage.getItem('sb-session');
    if (!session && window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
    }
}