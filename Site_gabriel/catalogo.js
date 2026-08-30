// catalogo.js
// Catalogo real de passaros - sem dados ficticios.
//
// APIs usadas:
// - Xeno-canto v2 (https://xeno-canto.org/explore/api): fornece o audio real
//   da ave e o nome cientifico (campos "gen" + "sp"). Nao exige chave.
//   Limite de uso: ~1 requisicao por segundo.
// - iNaturalist v1 (https://api.inaturalist.org/v1/taxa): fornece a foto da
//   especie a partir do nome cientifico (campo "default_photo.medium_url").
//   Nao exige chave. O Xeno-canto NAO fornece fotos (so audio e sonograma),
//   por isso essa segunda API e necessaria.

const ESPECIES_DO_CATALOGO = [
    "Toco Toucan",
    "Cockatiel",
    "Sulphur-crested Cockatoo",
    "Great Kiskadee",
    "Turquoise-fronted Amazon",
    "White-eyed Parakeet",
];

const listaCatalogo = document.getElementById("listaCatalogo");
const mensagemCatalogo = document.getElementById("mensagemCatalogo");

let audioTocandoAgora = null;
let botaoTocandoAgora = null;

function aguardar(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// mesma logica de escapar texto usada em armazenamento.js, duplicada aqui
// para o catalogo.js nao depender de nenhum outro arquivo.
function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

async function buscarGravacaoXenoCanto(nomeComumEmIngles) {
    const consulta = `en:"${nomeComumEmIngles}"`;
    const url = `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(consulta)}`;

    const resposta = await fetch(url);
    if (!resposta.ok) {
        throw new Error(`Xeno-canto respondeu com erro (${resposta.status})`);
    }

    const dados = await resposta.json();
    if (!dados.recordings || dados.recordings.length === 0) {
        return null;
    }

    // Prioriza gravacoes de melhor qualidade (A ou B); senao, usa a primeira.
    const gravacao =
        dados.recordings.find((r) => r.q === "A" || r.q === "B") || dados.recordings[0];

    return {
        nomeCientifico: `${gravacao.gen} ${gravacao.sp}`,
        audioUrl: gravacao.file,
    };
}

async function buscarFotoINaturalist(nomeCientifico) {
    const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(
        nomeCientifico
    )}&rank=species&per_page=1`;

    const resposta = await fetch(url);
    if (!resposta.ok) return null;

    const dados = await resposta.json();
    const taxon = dados.results && dados.results[0];
    return taxon && taxon.default_photo ? taxon.default_photo.medium_url : null;
}

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

function criarCard({ nomeCientifico, audioUrl, fotoUrl }) {
    const card = document.createElement("section");
    card.className = "card-catalogo";

    if (fotoUrl) {
        const img = document.createElement("img");
        img.src = fotoUrl;
        img.alt = nomeCientifico;
        card.appendChild(img);
    } else {
        const semFoto = document.createElement("div");
        semFoto.className = "sem-foto";
        semFoto.textContent = "Foto nao disponivel";
        card.appendChild(semFoto);
    }

    const audio = document.createElement("audio");
    audio.src = audioUrl;
    audio.preload = "none";

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "▶️ Reproduzir";

    botao.addEventListener("click", () => {
        // Garante que apenas 1 audio toque por vez em todo o catalogo.
        if (audioTocandoAgora && audioTocandoAgora !== audio) {
            pararAudioAtual();
        }

        if (audio.paused) {
            audio.play();
            botao.textContent = "⏸️ Pausar";
            audioTocandoAgora = audio;
            botaoTocandoAgora = botao;
        } else {
            audio.pause();
            botao.textContent = "▶️ Reproduzir";
            audioTocandoAgora = null;
            botaoTocandoAgora = null;
        }
    });

    audio.addEventListener("ended", () => {
        botao.textContent = "▶️ Reproduzir";
        audioTocandoAgora = null;
        botaoTocandoAgora = null;
    });

    const nome = document.createElement("h3");
    nome.innerHTML = `<em>${escaparHTML(nomeCientifico)}</em>`;

    card.appendChild(nome);
    card.appendChild(audio);
    card.appendChild(botao);

    return card;
}

async function carregarCatalogo() {
    mensagemCatalogo.textContent = "Carregando catalogo...";
    listaCatalogo.innerHTML = "";

    let algumaAveCarregada = false;

    for (const nomeComum of ESPECIES_DO_CATALOGO) {
        try {
            const gravacao = await buscarGravacaoXenoCanto(nomeComum);

            if (gravacao) {
                const fotoUrl = await buscarFotoINaturalist(gravacao.nomeCientifico);
                listaCatalogo.appendChild(criarCard({ ...gravacao, fotoUrl }));
                algumaAveCarregada = true;
            }
        } catch (erro) {
            console.error(`Nao foi possivel carregar "${nomeComum}":`, erro);
        }

        // Respeita o limite de aproximadamente 1 requisicao por segundo do Xeno-canto.
        await aguardar(1100);
    }

    mensagemCatalogo.textContent = algumaAveCarregada
        ? ""
        : "Nao foi possivel carregar nenhuma ave agora. Tente novamente mais tarde.";
}

carregarCatalogo();
