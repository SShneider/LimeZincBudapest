const contentArea = document.getElementById("main-content-column")
const closeTableArea = document.getElementsByTagName("body")[0]
const colorMap = {251:"Zerg", 222: "Terran", 221: "Protoss", 0: "Protoss", 1: "Terran", 2: "Zerg"}
const terranString = `<a href="/starcraft2/Terran" title="Terran"><img alt="" src="/commons/images/9/9d/Ticon_small.png" width="17" height="15" loading="lazy"></a>`
const zergString = `<a href="/starcraft2/Zerg" title="Zerg"><img alt="" src="/commons/images/c/c9/Zicon_small.png" width="17" height="15" loading="lazy"></a>`
const protossString = `<a href="/starcraft2/Protoss" title="Protoss"><img alt="" src="/commons/images/a/ab/Picon_small.png" width="17" height="15" loading="lazy"></a>`
const raceIconMap = { Zerg: zergString, Terran: terranString, Protoss: protossString, Z: zergString, T: terranString, P: protossString}
const countryDict = {"South Korea":"K", "Germany":"D", "Croatia":"H"}
contentArea.addEventListener("dblclick",  ()   =>  findPlayer(event))
closeTableArea.addEventListener("click", () => removeGeneratedTable(event))
let apiKey = 'X8HsOXXCVDayh3vRn75E'

async function findPlayer(event){
    console.log(event.target)
    let race
    try{
        if(event.target.nodeName==="TD"){
            const listOfLinks = event.target.getElementsByTagName("a")
            console.log(listOfLinks)
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

    const playerTable=createElementFromHTML(event.pageX, event.pageY, flagElement, raceIconMap[race], playerToFetch)
    contentArea.append(playerTable)
    await fetchPlayerData(playerToFetch, race[0], country)

}

function whatIsSelected(contentString){
    if(!contentString.length) return -1;
    contentString = contentString.trim().split(/\s+/)
    if(!contentString.length>2) return -1;
    return contentString[0].trim()
}

function errorMessage(notFound=0){
    let errorMsg = 'Error. Try again'
    if(notFound) errorMsg = 'Player Not Found'
    const dummyPlayerData = [{name:  errorMsg, winnings: errorMsg, winrates: [errorMsg, errorMsg, errorMsg, errorMsg], elo: [errorMsg, errorMsg, errorMsg, errorMsg]}]
    displayPlayerInfo(dummyPlayerData, 0)
}

function fetchPlayerData(playerIn, raceIn, countryIn){
    chrome.runtime.sendMessage({player: playerIn, country: countryIn, race: raceIn, apiKey: apiKey}, (response)=> {
    if(response && response.action==="playerDataReturn"){
        console.log(response)
        if(response.errorStatus==="notfound"){
            errorMessage(1)
        }else if(response.errorStatus){
            errorMessage()
        }else{
            displayPlayerInfo(response.aliData, 0)
            if(response.aliData.length>1){
                for(let i=0; i<response.aliData.length; i++){
                    createPlayerToggleButton(response.aliData, i)
                }
            }
        }
    }else{
        errorMessage()
    }
    })
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
    if(!aliFlag.getElementsByTagName("a").length && playerData[i].country) aliFlag.innerText = playerData[i].country
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




function createElementFromHTML(X, Y, flag, race, player) {
    let htmlString = 
    `<tbody>
        <tr>
            <th colspan="7" style="text-align: center;">
                <span class="flag" id="aliFlag">${flag}</span>
                <span id="aliRace">${race}</span>
                <span>${player}</span>
                <span id="playerToggle"></span>
            </th>
        </tr>
        <tr>
            <td colspan="7" style="
                    background-color: #f2f2f2;
                    font-size: 85%;
                    line-height: 90%;
                    height: 13px;
                    text-align: center;
                ">
                <span class="realName"><div class="loader"></span>
            </td>
        </tr>
        <tr>
        <td colspan="7" style="
                background-color: #f2f2f2;
                font-size: 85%;
                line-height: 90%;
                height: 13px;
                text-align: center;
            ">
            <span class="winnings"><div class="loader"></span>
        </td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: left;" class="grouptableslot">
            &nbsp;<b>vS</b>
            </td>
            <td style="width: 32px; white-space: pre; text-align:center;" class = "overall gen"><b><div class="loader"></b></td>
            <td style="width: 32px; white-space: pre; text-align:center;" class = "overallElo gen"><b><div class="loader"></b></td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: left;" class="grouptableslot">
                &nbsp;<a href="/starcraft2/Protoss" title="Protoss"><img alt="" src="/commons/images/a/ab/Picon_small.png"
                        width="17" height="15" loading="lazy" /></a>
            </td>
            <td style="width: 32px; white-space: pre; text-align:center;" class ="vP gen"><b><div class="loader"></b></td>
            <td style="width: 32px; white-space: pre; text-align:center;" class = "vPelo gen"><b><div class="loader"></b></td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: left;" class="grouptableslot">
                &nbsp;<a href="/starcraft2/Terran" title="Terran"><img alt="" src="/commons/images/9/9d/Ticon_small.png"
                        width="17" height="15" loading="lazy" /></a>
            </td>
            <td style="width: 32px; white-space: pre; text-align:center;" class="vT gen"><b><div class="loader"></b></td>
            <td style="width: 32px; white-space: pre; text-align:center;" class="vTelo gen"><b><div class="loader"></b></td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: left;" class="grouptableslot">
                &nbsp;<a href="/starcraft2/Zerg" title="Zerg"><img alt="" src="/commons/images/c/c9/Zicon_small.png"
                        width="17" height="15" loading="lazy" /></a>
            </td>
            <td style="width: 32px; white-space: pre; text-align:center;" class = "vZ gen"><b><div class="loader"></b></td>
            <td style="width: 32px; white-space: pre; text-align:center;" class="vZelo  gen"><b><div class="loader"></b></td>
        </tr>
        </tbody>
        `
  
    removeGeneratedTable()
    let  tableOut = document.createElement('table');
    tableOut.classList.add("matchlist", "wikitable", "aliTable")
    tableOut.setAttribute('id', 'generatedTable')
    tableOut.innerHTML = htmlString.trim();
    tableOut.style.position = "absolute"
    tableOut.style.zIndex = "999"
    tableOut.style.left = (X-325)+"px"
    tableOut.style.top = (Y-100)+"px"
    return tableOut
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
