const container = document.getElementById("container");
const rankedInfo = document.getElementById("ranked");
const nick = document.getElementById("nickname");
const eloInfo = document.getElementById("elo");

async function params() {
  const url = new URL(window.location.href);

  const team = url.searchParams.get("team").toLocaleLowerCase();
  if (team !== "cadet" && team !== "veteran") {
    alert("No ER Conquest só existem 2 times: CADET ou VETERAN. Qualquer outro nome retornará esse erro.");
    return window.location.href = "/";
  }

  const nickname = url.searchParams.get("nickname");
  if (!nickname) return alert('Adicione um nickname válido.');

  await showPlayerInfo(team, nickname);
  setInterval(async () => {
    await showPlayerInfo(team, nickname);
  }, 3 * 10000)

}

async function showPlayerInfo(team, nickname) {
  const response = await fetch(`https://widget-r1x9.onrender.com/?team=${team}&nickname=${nickname}`);
  const { position, name, ranked } = await response.json();
  const { elo, format_elo } = ranked;

  if (!name) {
    alert("Possível problemas: \n1. Errou o time; \n2. Jogador não existe; \n3. Jogador não está participando do evento.");
    return window.location.href = "/";
  }

  rankedInfo.innerHTML = `Ranked - ${formatTeamName(team)}`;
  nick.innerHTML = `${name} (#${position})`;
  eloInfo.innerHTML = format_elo;
  container.style.backgroundImage = `url('./assets/images/${elo.toLocaleLowerCase()}.png')`;
}

function formatTeamName(team) {
  const format = {
    "cadet": "Cadete",
    "veteran": "Veterano"
  }

  return format[team];
}