let selectedPlayer = null
let selectedSlot = null
let draggedPlayer = null
let wasDragged = false

const bench = document.getElementById("BenchChairs")
const field = document.getElementById("Field")
const transferBox = document.getElementById("Transfering")
const shopRow = document.getElementById("ShopPlayer")
const playerTemplate = document.querySelector("#Field .Player").cloneNode(true)

function ExpandStats(){
    const expanded = document.getElementById("StatsExtend").classList.toggle("is-expanded")
    document.getElementById("ExpImg").classList.toggle("is-expanded", expanded)
}

function OpenTransfers(player, slot){
    if(selectedPlayer){
        selectedPlayer.classList.remove("is-for-sale")
    }

    if(selectedSlot){
        selectedSlot.classList.remove("is-selected")
    }

    selectedPlayer = player || null
    selectedSlot = slot || null

    const sellingCells = document.querySelectorAll("#SellingPlayer td")
    if(selectedPlayer){
        selectedPlayer.classList.add("is-for-sale")
        sellingCells[0].textContent = selectedPlayer.querySelector(".PName").textContent
        sellingCells[1].textContent = selectedPlayer.dataset.position || "—"
        sellingCells[2].textContent = selectedPlayer.querySelector(".PPoints").textContent
        sellingCells[3].textContent = selectedPlayer.dataset.goals || "—"
        sellingCells[4].textContent = selectedPlayer.dataset.assists || "—"
    }
    else{
        sellingCells.forEach(function(cell){ cell.textContent = "—" })
    }

    if(selectedSlot){
        selectedSlot.classList.add("is-selected")
    }

    document.getElementById("TransferMessage").textContent = selectedSlot
        ? "Vyber hráče z obchodu, kterého chceš přidat do týmu."
        : "Porovnej hráče a vyber výměnu."
    transferBox.style.display = "flex"
}

function setSlotEvents(slot){
    slot.addEventListener("click", function(){
        if(!wasDragged){
            OpenTransfers(null, slot)
        }
    })
    slot.addEventListener("dragover", function(event){
        event.preventDefault()
        slot.classList.add("is-drop-target")
    })
    slot.addEventListener("dragleave", function(){
        slot.classList.remove("is-drop-target")
    })
    slot.addEventListener("drop", function(event){
        event.preventDefault()
        slot.classList.remove("is-drop-target")
        movePlayer(draggedPlayer, slot)
    })
}

function updateBenchSlots(){
    const players = bench.querySelectorAll(".Player").length
    let slots = [...bench.querySelectorAll(".BenchSlot")]

    while(players + slots.length < 5){
        const slot = document.createElement("div")
        slot.className = "BenchSlot"
        slot.setAttribute("aria-label", "Prázdné místo na lavičce")
        bench.appendChild(slot)
        slots.push(slot)
        setSlotEvents(slot)
    }

    slots.forEach(function(slot, index){
        slot.hidden = index >= 5 - players
    })
}

function updateFieldSlots(){
    field.querySelectorAll(".FieldPart").forEach(function(part){
        const players = part.querySelectorAll(".Player").length
        let slots = [...part.querySelectorAll(".FieldSlot")]

        if(players === 0 && slots.length === 0){
            const slot = document.createElement("div")
            slot.className = "FieldSlot"
            slot.setAttribute("aria-label", "Prázdné místo pro hráče")
            part.appendChild(slot)
            setSlotEvents(slot)
        }
        else if(players > 0){
            slots.forEach(function(slot){ slot.remove() })
        }
    })
}

function movePlayer(player, target){
    if(!player || !target || player === target || player.contains(target)){
        return
    }

    if(target.classList.contains("FieldSlot")){
        const fieldPlayers = field.querySelectorAll(".FieldPart .Player").length
        if(player.closest("#Bench") && fieldPlayers >= 5){
            document.getElementById("TransferMessage").textContent =
                "Na hřišti už je všech pět hráčů."
            return
        }
        target.replaceWith(player)
    }
    else if(target.classList.contains("Player")){
        const marker = document.createElement("span")
        player.parentElement.insertBefore(marker, player)
        target.parentElement.insertBefore(player, target)
        marker.parentElement.insertBefore(target, marker)
        marker.remove()
    }
    else if(target.classList.contains("BenchSlot")){
        target.replaceWith(player)
    }
    else if(target.id === "Field" || target.classList.contains("FieldPart")){
        if(!player.closest("#Bench")){
            return
        }

        const fieldPlayers = field.querySelectorAll(".FieldPart .Player").length
        if(fieldPlayers >= 5){
            document.getElementById("TransferMessage").textContent =
                "Na hřišti už je všech pět hráčů. Přetáhni hráče přímo na jiného."
            return
        }

        const part = target.classList.contains("FieldPart")
            ? target
            : field.querySelector(".FieldPart")
        part.appendChild(player)
    }

    localStorage.removeItem("fantasyTeamEmpty")
    updateFieldSlots()
    updateBenchSlots()
}

function addPlayerEvents(player){
    player.draggable = true
    player.addEventListener("click", function(){
        if(wasDragged){
            wasDragged = false
            return
        }
        OpenTransfers(player, null)
    })
    player.addEventListener("dragstart", function(event){
        draggedPlayer = player
        wasDragged = true
        player.classList.add("is-dragging")
        event.dataTransfer.setData("text/plain", "player")
        event.dataTransfer.effectAllowed = "move"
    })
    player.addEventListener("dragend", function(){
        player.classList.remove("is-dragging")
        draggedPlayer = null
        window.setTimeout(function(){ wasDragged = false }, 0)
    })
    player.addEventListener("dragover", function(event){
        event.preventDefault()
        player.classList.add("is-drop-target")
    })
    player.addEventListener("dragleave", function(){
        player.classList.remove("is-drop-target")
    })
    player.addEventListener("drop", function(event){
        event.preventDefault()
        player.classList.remove("is-drop-target")
        movePlayer(draggedPlayer, player)
    })
}

function emptyTeam(){
    field.querySelectorAll(".FieldPart").forEach(function(part){
        part.replaceChildren()
        const slot = document.createElement("div")
        slot.className = "FieldSlot"
        slot.setAttribute("aria-label", "Prázdné místo pro hráče")
        part.appendChild(slot)
        setSlotEvents(slot)
    })

    bench.replaceChildren()
    for(let i = 0; i < 5; i++){
        const slot = document.createElement("div")
        slot.className = "BenchSlot"
        slot.setAttribute("aria-label", "Prázdné místo na lavičce")
        bench.appendChild(slot)
        setSlotEvents(slot)
    }
}

document.querySelectorAll("#Field .Player, #Bench .Player").forEach(addPlayerEvents)
document.querySelectorAll(".BenchSlot").forEach(setSlotEvents)

field.addEventListener("dragover", function(event){
    if(event.target === field || event.target.classList.contains("FieldPart")){
        event.preventDefault()
    }
})

field.addEventListener("drop", function(event){
    if(event.target === field || event.target.classList.contains("FieldPart")){
        event.preventDefault()
        movePlayer(draggedPlayer, event.target)
    }
})

document.getElementById("BuyPlayer").addEventListener("click", function(){
    if(!selectedPlayer && !selectedSlot){
        document.getElementById("TransferMessage").textContent =
            "Nejdřív vyber hráče nebo prázdné místo v týmu."
        return
    }

    const shopCells = shopRow.querySelectorAll("td")
    const newPlayerName = shopCells[0].textContent
    const newPlayerPosition = shopCells[1].textContent
    const newPlayerPoints = shopCells[2].textContent
    const newPlayerGoals = shopCells[3].textContent
    const newPlayerAssists = shopCells[4].textContent
    const newPlayerImage = shopRow.dataset.image

    if(selectedSlot){
        const player = playerTemplate.cloneNode(true)
        player.querySelector(".PName").textContent = newPlayerName
        player.querySelector(".PPoints").textContent = newPlayerPoints + " b"
        player.querySelector(".PImg").setAttribute("src", newPlayerImage)
        player.dataset.position = newPlayerPosition
        player.dataset.goals = newPlayerGoals
        player.dataset.assists = newPlayerAssists
        addPlayerEvents(player)
        selectedSlot.replaceWith(player)
        shopRow.remove()
        localStorage.removeItem("fantasyTeamEmpty")
    }
    else{
        const oldName = selectedPlayer.querySelector(".PName").textContent
        const oldPoints = selectedPlayer.querySelector(".PPoints").textContent.replace(" b", "")
        const oldImage = selectedPlayer.querySelector(".PImg").getAttribute("src")

        selectedPlayer.querySelector(".PName").textContent = newPlayerName
        selectedPlayer.querySelector(".PPoints").textContent = newPlayerPoints + " b"
        selectedPlayer.querySelector(".PImg").setAttribute("src", newPlayerImage)
        shopCells[0].textContent = oldName
        shopCells[1].textContent = selectedPlayer.dataset.position || "—"
        shopCells[2].textContent = oldPoints
        shopCells[3].textContent = selectedPlayer.dataset.goals || "—"
        shopCells[4].textContent = selectedPlayer.dataset.assists || "—"
        shopRow.dataset.image = oldImage
        selectedPlayer.dataset.position = newPlayerPosition
        selectedPlayer.dataset.goals = newPlayerGoals
        selectedPlayer.dataset.assists = newPlayerAssists
        selectedPlayer.classList.remove("is-for-sale")
    }

    if(selectedSlot){
        selectedSlot.classList.remove("is-selected")
    }
    selectedPlayer = null
    selectedSlot = null
    transferBox.style.display = "none"
    updateFieldSlots()
    updateBenchSlots()
})

document.getElementById("CloseTransfer").addEventListener("click", function(){
    if(selectedPlayer){
        selectedPlayer.classList.remove("is-for-sale")
    }
    if(selectedSlot){
        selectedSlot.classList.remove("is-selected")
    }
    selectedPlayer = null
    selectedSlot = null
    transferBox.style.display = "none"
})

if(localStorage.getItem("fantasyTeamEmpty") === "true"){
    emptyTeam()
}

updateFieldSlots()
updateBenchSlots()
