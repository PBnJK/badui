/* Plinko
 * Congratulations page script
 */

function main() {
  const statsBounces = document.getElementById("stats-bounces");
  const statsReleases = document.getElementById("stats-releases");
  const statsErases = document.getElementById("stats-erases");
  const statsBombs = document.getElementById("stats-bombs");

  const params = new URLSearchParams(window.location.search);

  const statsBouncesNum = params.get("bounces") ?? "???";
  const statsReleasesNum = params.get("releases") ?? "???";
  const statsErasesNum = params.get("erases") ?? "???";
  const statsBombsNum = params.get("bombs") ?? "???";

  statsBounces.innerText = `Bounces: ${statsBouncesNum}`;
  statsReleases.innerText = `Balls released: ${statsReleasesNum}`;
  statsErases.innerText = `Characters erased: ${statsErasesNum}`;
  statsBombs.innerText = `Bombs hit: ${statsBombsNum}`;
}

main();
