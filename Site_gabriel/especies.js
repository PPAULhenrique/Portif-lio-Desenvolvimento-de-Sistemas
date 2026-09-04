// especies.js
// Lista unica das especies do catalogo. Usada por catalogo.js (foto + audio +
// nome cientifico) e por perfil.js (selecao de aves favoritas), para nao
// cadastrar os mesmos passaros duas vezes em arquivos diferentes.
//
// SOBRE A FONTE DO AUDIO (importante):
// A ideia original era buscar o audio ao vivo direto na API do Xeno-canto
// (https://xeno-canto.org/api/2/recordings). Isso parou de funcionar: o
// dominio xeno-canto.org passou a bloquear qualquer pedido automatizado -
// inclusive chamadas feitas por fetch() do navegador - com uma protecao
// anti-robo chamada Anubis/BotStopper. Toda tentativa de acessar o endpoint
// da API (nao so a pagina de documentacao) retorna uma pagina HTML de
// "Access Denied" no lugar do JSON esperado. Por isso os audios abaixo usam
// os arquivos MP3 que ja existiam no projeto, e os nomes cientificos foram
// conferidos manualmente (alguns estavam incorretos/fictícios no catalogo
// antigo). A funcao que buscava no Xeno-canto continua em catalogo.js,
// comentada, para o caso de isso ser resolvido no futuro (ex.: usando uma
// chave da API v3, se ela nao estiver atras do mesmo bloqueio).

// Controla quantas especies o catalogo carrega de uma vez. Aumente este
// numero conforme mais especies forem adicionadas na lista abaixo.
const QUANTIDADE_ESPECIES = 20;

const ESPECIES_CATALOGO = [
    {
        id: "tucano-toco",
        nomeCientifico: "Ramphastos toco",
        audioUrl: "Audio de passaros/Canto_Tucano_Toco.mp3",
        fotoLocal: "foto de passaros/tucano_toco.jpg",
    },
    {
        id: "bem-te-vi",
        nomeCientifico: "Pitangus sulphuratus",
        audioUrl: "Audio de passaros/Canto_BemTevi.mp3",
        fotoLocal: "foto de passaros/Bem_Te_Vi.jpg",
    },
    {
        id: "calopsita",
        nomeCientifico: "Nymphicus hollandicus",
        audioUrl: "Audio de passaros/Calopsitas Cantando.mp3",
        fotoLocal: "foto de passaros/prikito.jpg",
    },
    {
        id: "cacatua",
        nomeCientifico: "Cacatua galerita",
        audioUrl: "Audio de passaros/Canto_Cacatua.mp3",
        fotoLocal: "foto de passaros/cacatua.jpg",
    },
    {
        id: "papagaio",
        nomeCientifico: "Amazona aestiva",
        audioUrl: "Audio de passaros/Canto_Papagaio.mp3",
        fotoLocal: "foto de passaros/bicos-de-passaros.jpg",
    },
    {
        id: "maritaca",
        nomeCientifico: "Pionus maximiliani",
        audioUrl: "Audio de passaros/Canto_Maritaca.mp3",
        fotoLocal: "foto de passaros/maritaca.jpg",
    },
];
