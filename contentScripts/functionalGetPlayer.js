const contentArea = document.getElementById("main-content-column")
const closeTableArea = document.getElementsByTagName("body")[0]
contentArea.addEventListener("dblclick",  ()   =>  findPlayer(event))
closeTableArea.addEventListener("click", () => removeGeneratedTable(event))

async function findPlayer(event){
    if(event.target.innerText.indexOf("Group ")!==-1) return //blocks the function from executing when clicked on group title. 
    const generatedRequest = generatePlayerRequest(event)
    const {playerToFetch, flagElement, race, country} = generatedRequest
    const playerTable=createElementFromHTML(event.pageX, event.pageY, flagElement, raceIconMap[race], playerToFetch)
    contentArea.append(playerTable)
    await fetchPlayerData(playerToFetch, race[0], country, "getplayer")
}
function generatePlayerRequest(event){
    let race = "R"
    try{
        if(event.target.nodeName==="TD"){
            const listOfLinks = event.target.getElementsByTagName("a")
            if(listOfLinks) 
                if(listOfLinks.length === 3 && listOfLinks[1].title in raceIconMap){
                    race = listOfLinks[1].title
                }
                else if(listOfLinks[0].title in raceIconMap){
                    race = listOfLinks[0].title // unique case for expanded group stage.
                }
            else {
                race = colorMap[event.target.cellIndex]//participants list doesnt have race explicitly stated. Col 1 = P, 2 = T, 3 = Z
                }
            }    
        else if(event.target.className.includes("bracket-player-top") || event.target.className.includes("bracket-player.bottom")){
            //Brackets are the only event where the element of origin is not a <TD>
            race = colorMap[event.target.attributes.style.value.match(/\d{3}/)]
            //Brackets don't have race icons. Race is captured using distinct bg colors
            }
        else {
            return -1   
            }
        }catch{
            return -1
        }
    if(!race) race = "R"    //placeholder for when the race is not listed
    const playerToFetch = whatIsSelected(event.target.innerText) //splices the name of the player out
    if(playerToFetch===-1){
        return -1;
    }

    const flag = event.target.getElementsByClassName("flag")[0] 
    let country = ""
    let flagElement = ""
    if(flag){
        flagElement = flag.innerHTML
        if(flag.getElementsByTagName("a").length) {
            country = flag.getElementsByTagName("a")[0].title
            }
        else if(flag.getElementsByTagName("img").length){
            country = flag.getElementsByTagName("img")[0].title
            }
    }
    if(country in countryDict){
            country = countryDict[country]
        }else if(country.length){
            country = country[0]
        }
    return {playerToFetch, flagElement, race, country}
}

function whatIsSelected(contentString){
    if(!contentString.length) return -1;
    contentString = contentString.trim().split(/\s+/)
    if(!contentString.length>2) return -1; 
    contentString = contentString[0].trim().split(/▲|▼/)
    if(!contentString.length>2) return -1; 
    return contentString[0].trim()
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



function removeGeneratedTable(event){
    if(event){
        for(let i = 0; i<event.path.length; i++){
            if(event.path[i].id && event.path[i].id ==="generatedTable") return
        }
    }
    //if(event && event.path.indexOf("table#generatedTable.matchlist.wikitable.aliTable")!==-1) return
    const genTable =  document.getElementById("generatedTable")
    if (genTable) genTable.remove()
}
