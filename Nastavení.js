const teamNameInput = document.getElementById("TeamName")
const savedTeamName = localStorage.getItem("fantasyTeamName")

if(savedTeamName){
    teamNameInput.value = savedTeamName
}

document.getElementById("SettingsForm").addEventListener("submit", function(event){
    event.preventDefault()
    const name = teamNameInput.value.trim()

    if(!name){
        document.getElementById("SaveMessage").textContent = "Název týmu nemůže být prázdný."
        return
    }

    localStorage.setItem("fantasyTeamName", name)
    teamNameInput.value = name
    document.getElementById("SaveMessage").textContent = "Název týmu byl uložen."
})

document.getElementById("EmptyTeam").addEventListener("click", function(){
    if(window.confirm("Opravdu chceš vyprázdnit svůj tým?")){
        localStorage.setItem("fantasyTeamEmpty", "true")
        window.location.href = "Fantasy.html"
    }
})

document.getElementById("DeleteTeam").addEventListener("click", function(){
    document.getElementById("ActionMessage").textContent = "Mazání týmu zatím není dostupné."
})

document.getElementById("ChangePassword").addEventListener("click", function(){
    document.getElementById("ActionMessage").textContent = "Změna hesla zatím není dostupná."
})
