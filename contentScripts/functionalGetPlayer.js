const contentArea = document.getElementById("main-content-column")
const closeTableArea = document.getElementsByTagName("body")[0]
contentArea.addEventListener("dblclick",  ()   =>  findPlayer(event))
closeTableArea.addEventListener("click", () => removeGeneratedTable(event, "generatedPlayerTable"))

async function findPlayer(event){ 
    if(event.target.innerText.indexOf("Group ")!==-1) return //blocks the function from executing when clicked on group title. 
    const generatedRequest = generatePlayerRequest(event) 
    const {playerToFetch, flagElement, race, country} = generatedRequest
    const playerTable=generatePlayerTable(event.pageX, event.pageY, flagElement, raceIconMap[race], playerToFetch)
    contentArea.append(playerTable)
    await fetchPlayerData(playerToFetch, race[0], country, "getplayer")
}


function errorMessage(notFound=0){
    let errorMsg = 'Error. Try again'
    if(notFound) errorMsg = 'Player Not Found'
    const dummyPlayerData = [{name:  errorMsg, winnings: errorMsg, winrates: [errorMsg, errorMsg, errorMsg, errorMsg], elo: [errorMsg, errorMsg, errorMsg, errorMsg]}]
    displayPlayerInfo(dummyPlayerData, 0)
}

function createPlayerToggleButton(data, i){
    const playerButton = document.createElement("button")
    playerButton.className = "playerButton"
    playerButton.innerText = i+1
    playerButton.addEventListener("click", () => displayPlayerInfo(data, i))
    const playerButtonArea = document.getElementById("playerToggle")
    playerButtonArea.appendChild(playerButton)
}
function displayPlayerInfo(playerData, i){
    //For when there is no race/flag on liquipedia or for expanded group view(no flag)
    const aliRace = document.getElementById("aliRace")
    const aliFlag = document.getElementById("aliFlag")
    if(!aliRace.innerText && playerData[i].race) aliRace.innerHTML = raceIconMap[playerData[i].race]
    if(!aliFlag.getElementsByTagName("a").length && !aliFlag.getElementsByTagName("img").length  && playerData[i].country) aliFlag.innerText = playerData[i].country
    //End
    const realName = document.getElementsByClassName("realName")[0]
    const winnings = document.getElementsByClassName("winnings")[0]
    const overall = document.getElementsByClassName("overall")[0]
    const overallElo = document.getElementsByClassName("overallElo")[0]
    const vP = document.getElementsByClassName("vP")[0]
    const vPelo = document.getElementsByClassName("vPelo")[0]
    const vT = document.getElementsByClassName("vT")[0]
    const vTelo= document.getElementsByClassName("vTelo")[0]
    const vZ = document.getElementsByClassName("vZ")[0]
    const vZelo = document.getElementsByClassName("vZelo")[0]
    realName.innerText=playerData[i].name
    winnings.innerHTML="<b>Total Winnings:</b> "+playerData[i].winnings
    overall.innerText=playerData[i].winrates[0]
    vP.innerText = playerData[i].winrates[1]
    vT.innerText = playerData[i].winrates[2]
    vZ.innerText = playerData[i].winrates[3]
    overallElo.innerText = playerData[i].elo[0]
    vPelo.innerText = playerData[i].elo[1]
    vTelo.innerText = playerData[i].elo[2]
    vZelo.innerText = playerData[i].elo[3]
}




