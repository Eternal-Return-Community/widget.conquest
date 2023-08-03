const container = document.getElementById("container");
const ranked = document.getElementById("ranked");
const nick = document.getElementById("nickname");
const elo = document.getElementById("elo");

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
  const { position, name, mmr } = await response.json();

  if (!name) {
    alert("Possível problemas: \n1. Errou o time; \n2. Jogador não existe; \n3. Jogador não está participando do evento.");
    return window.location.href = "/";
  }

  const elo_ = calcElo(mmr);

  ranked.innerHTML = `Ranked -  ${formatTeamName(team)}`;
  nick.innerHTML = `${name} (#${position})`;
  elo.innerHTML = elo_.formatElo;
  container.style.backgroundImage = `url('../assets/images/${elo_.image}.png')`;
}

function formatTeamName(team) {
  const format = {
    "cadet": "Cadete",
    "veteran": "Veterano"
  }

  return format[team];
}

function calcElo(mmr) {
  let elo = formatElo(mmr);
  let division = 0;
  let rp = 0;

  division = 4 - Math.floor((mmr % 1000) / 250);
  rp = (mmr % 250);

  if (elo === "Mythril" || elo === "Titan" || elo === "Immortal") {
    return `${elo} <br>RP: ${(mmr % 6000)}`;
  }

  return {
    formatElo: `${elo} ${division} - RP: ${rp}`,
    image: elo
  }
}

function formatElo(mmr) {

  let elo = "";

  if (mmr > 0 && mmr < 1000) {
    elo = "Ferro";
  } else if (mmr >= 1000 && mmr < 2000) {
    elo = "Bronze";
  } else if (mmr >= 2000 && mmr < 3000) {
    elo = "Prata";
  } else if (mmr >= 3000 && mmr < 4000) {
    elo = "Ouro";
  } else if (mmr >= 4000 && mmr < 5000) {
    elo = "Platina";
  } else if (mmr >= 5000 && mmr < 6000) {
    elo = "Diamante";
  } else if (mmr >= 6000 && mmr < 7000) {
    elo = "Titan";
  } else if (mmr >= 7000 && mmr < 8000) {
    elo = "Mythril";
  } else if (mmr >= 8000) {
    elo = "Immortal";
  } else {
    elo = "No Elo";
  };

  return elo
}
