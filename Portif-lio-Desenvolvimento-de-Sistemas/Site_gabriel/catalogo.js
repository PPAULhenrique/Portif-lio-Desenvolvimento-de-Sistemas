// catalogo.js
// Requer armazenamento.js e especies.js incluidos ANTES deste arquivo.
//
// Foto: busca ao vivo na API do iNaturalist (https://api.inaturalist.org/v1/taxa)
// a partir do nome cientifico. Se a chamada falhar, usa a foto local de
// "foto de passaros/" como reserva - uma falha pontual de rede nao derruba
// o card inteiro. As fotos ja buscadas ficam guardadas em sessionStorage
// (CHAVE_CACHE_FOTOS) para nao repetir a mesma chamada em toda visita.
// Audio + nome cientifico: vem de especies.js (ver comentario la explicando
// por que nao e mais buscado ao vivo no Xeno-canto).

const CHAVE_CACHE_FOTOS = "aviario_cache_fotos_catalogo";

const listaCatalogo = document.getElementById("listaCatalogo");
const mensagemCatalogo = document.getElementById("mensagemCatalogo");
const usuarioAtual = usuarioLogado();

let audioTocandoAgora = null;
let botaoTocandoAgora = null;

function lerCacheFotos() {
    try {
        return JSON.parse(sessionStorage.getItem(CHAVE_CACHE_FOTOS) || "{}");
    } catch {
        return {};
    }
}

function salvarNoCacheFotos(nomeCientifico, url) {
    try {
        const cache = lerCacheFotos();
        cache[nomeCientifico] = url;
        sessionStorage.setItem(CHAVE_CACHE_FOTOS, JSON.stringify(cache));
    } catch (erro) {
        console.warn("Nao foi possivel salvar cache de fotos.", erro);
    }
}

async function buscarFotoINaturalist(nomeCientifico) {
    const cache = lerCacheFotos();
    if (cache[nomeCientifico]) return cache[nomeCientifico];

    const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(
        nomeCientifico
    )}&rank=species&per_page=1`;

    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error("iNaturalist respondeu com erro");

    const dados = await resposta.json();
    const taxon = dados.results && dados.results[0];
    if (!taxon || !taxon.default_photo) throw new Error("Sem foto disponivel");

    const fotoUrl = taxon.default_photo.medium_url;
    salvarNoCacheFotos(nomeCientifico, fotoUrl);
    return fotoUrl;
}

/*
 * DESATIVADO: busca ao vivo no Xeno-canto (ver explicacao em especies.js).
 * Deixado aqui pronto para o caso de voltar a funcionar no futuro.
 *
 * async function buscarGravacaoXenoCanto(nomeComumEmIngles) {
 *     const consulta = `en:"${nomeComumEmIngles}"`;
 *     const url = `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(consulta)}`;
 *     const resposta = await fetch(url);
 *     if (!resposta.ok) throw new Error(`Xeno-canto respondeu com erro (${resposta.status})`);
 *     const dados = await resposta.json();
 *     if (!dados.recordings || dados.recordings.length === 0) return null;
 *     const gravacao = dados.recordings.find((r) => r.q === "A" || r.q === "B") || dados.recordings[0];
 *     return { nomeCientifico: `${gravacao.gen} ${gravacao.sp}`, audioUrl: gravacao.file };
 * }
 */

function pararAudioAtual() {
    if (audioTocandoAgora) {
        audioTocandoAgora.pause();
        audioTocandoAgora.currentTime = 0;
    }
    if (botaoTocandoAgora) {
        botaoTocandoAgora.textContent = "▶️ Reproduzir";
    }
    audioTocandoAgora = null;
    botaoTocandoAgora = null;
}

function criarCard(especie, fotoUrl) {
    const card = document.createElement("section");
    card.className = "card-catalogo";

    const img = document.createElement("img");
    img.src = fotoUrl;
    img.alt = especie.nomeCientifico;
    img.loading = "lazy";
    card.appendChild(img);

    const nome = document.createElement("h3");
    nome.innerHTML = `<em>${escaparHTML(especie.nomeCientifico)}</em>`;
    card.appendChild(nome);

    const audio = document.createElement("audio");
    audio.src = especie.audioUrl;
    audio.preload = "none";
    card.appendChild(audio);

    const linhaBotoes = document.createElement("div");
    linhaBotoes.className = "linha-botoes-catalogo";

    const botaoAudio = document.createElement("button");
    botaoAudio.type = "button";
    botaoAudio.textContent = "▶️ Reproduzir";

    botaoAudio.addEventListener("click", () => {
        if (audioTocandoAgora && audioTocandoAgora !== audio) {
            pararAudioAtual();
        }

        if (audio.paused) {
            audio.play();
            botaoAudio.textContent = "⏸️ Pausar";
            audioTocandoAgora = audio;
            botaoTocandoAgora = botaoAudio;
        } else {
            audio.pause();
            botaoAudio.textContent = "▶️ Reproduzir";
            audioTocandoAgora = null;
            botaoTocandoAgora = null;
        }
    });

    audio.addEventListener("ended", () => {
        botaoAudio.textContent = "▶️ Reproduzir";
        audioTocandoAgora = null;
        botaoTocandoAgora = null;
    });

    linhaBotoes.appendChild(botaoAudio);

    // Botao de favoritar (Etapa 4): usa o mesmo armazenamento.js/especies.js
    // do perfil, entao favoritar aqui e no perfil e a mesma informacao.
    const botaoFavoritar = document.createElement("button");
    botaoFavoritar.type = "button";
    botaoFavoritar.className = "botao-favoritar";

    function atualizarVisualFavorito() {
        const favoritado = usuarioAtual && estaFavoritado(usuarioAtual.id, especie.id);
        botaoFavoritar.textContent = favoritado ? "★ Favoritado" : "☆ Favoritar";
        botaoFavoritar.classList.toggle("ativo", Boolean(favoritado));
    }

    if (!usuarioAtual) {
        botaoFavoritar.disabled = true;
        botaoFavoritar.title = "Crie um perfil para favoritar";
    }
    atualizarVisualFavorito();

    botaoFavoritar.addEventListener("click", () => {
        if (!usuarioAtual) return;
        alternarFavorito(usuarioAtual.id, especie.id);
        atualizarVisualFavorito();
    });

    linhaBotoes.appendChild(botaoFavoritar);
    card.appendChild(linhaBotoes);

    return card;
}

async function carregarCatalogo() {
    mensagemCatalogo.textContent = "Carregando catalogo...";
    listaCatalogo.innerHTML = "";

    const especies = ESPECIES_CATALOGO.slice(0, QUANTIDADE_ESPECIES);

    // Busca as fotos em paralelo (o iNaturalist nao exige 1 req/seg como o
    // Xeno-canto exigia), mas cada uma trata seu proprio erro isoladamente.
    const resultados = await Promise.all(
        especies.map(async (especie) => {
            try {
                const fotoUrl = await buscarFotoINaturalist(especie.nomeCientifico);
                return { especie, fotoUrl };
            } catch (erro) {
                console.warn(`Sem foto ao vivo para ${especie.nomeCientifico}, usando foto local.`, erro);
                return { especie, fotoUrl: especie.fotoLocal };
            }
        })
    );

    resultados.forEach(({ especie, fotoUrl }) => {
        listaCatalogo.appendChild(criarCard(especie, fotoUrl));
    });

    mensagemCatalogo.textContent = resultados.length
        ? ""
        : "Nao foi possivel carregar nenhuma ave agora. Tente novamente mais tarde.";
}

carregarCatalogo();
