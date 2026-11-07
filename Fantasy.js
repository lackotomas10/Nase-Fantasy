OpenTransfers()

function ExpandStats(){
    const expanded = document.getElementById("StatsExtend").classList.toggle("is-expanded")
    document.getElementById("ExpImg").classList.toggle("is-expanded", expanded)
}

function OpenTransfers(){
    document.getElementById("Transfering").style.display = "none";
    // návrat divu document.getElementById("Transfering").style.display = "flex";
}
