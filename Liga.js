const savedTeamName = localStorage.getItem("fantasyTeamName")
const teamRows = [...document.querySelectorAll("#LeagueTable tbody tr")]

if(savedTeamName){
    document.querySelector(".TeamNameCell").textContent = savedTeamName
}

document.getElementById("TeamCount").textContent =
    teamRows.filter(function(row){ return !row.hidden }).length

const topScoringTeam = teamRows
    .filter(function(row){ return !row.hidden })
    .sort(function(first, second){
        return Number(second.cells[2].textContent) - Number(first.cells[2].textContent)
    })[0]

if(topScoringTeam){
    document.getElementById("TopScoringTeam").textContent =
        topScoringTeam.cells[1].textContent + " (" + topScoringTeam.cells[2].textContent + " b)"
}
