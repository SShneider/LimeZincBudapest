
const contentArea = document.getElementById("main-content-column")
const closeTableArea = document.getElementsByTagName("body")[0]
const colorMap = {251:"Zerg", 222: "Terran", 221: "Protoss", 0: "Protoss", 1: "Terran", 2: "Zerg"}
const terranString = `<a href="/starcraft2/Terran" title="Terran"><img alt="" src="/commons/images/9/9d/Ticon_small.png" width="17" height="15" loading="lazy"></a>`
const zergString = `<a href="/starcraft2/Zerg" title="Zerg"><img alt="" src="/commons/images/c/c9/Zicon_small.png" width="17" height="15" loading="lazy"></a>`
const protossString = `<a href="/starcraft2/Protoss" title="Protoss"><img alt="" src="/commons/images/a/ab/Picon_small.png" width="17" height="15" loading="lazy"></a>`
const raceIconMap = { Zerg: zergString, Terran: terranString, Protoss: protossString}
const countryDict = {"South Korea":"K", "Germany":"D", "Croatia":"H"}
contentArea.addEventListener("dblclick",  ()   =>  findPlayer(event))
closeTableArea.addEventListener("click", removeGeneratedTable)
let apiKey = 'X8HsOXXCVDayh3vRn75E'

async function findPlayer(event){
    let race = "R"
    try{
        if(event.target.nodeName==="TD"){
            const listOfLinks = event.target.getElementsByTagName("a")
            if(listOfLinks && listOfLinks.length === 3 && listOfLinks[1].title in raceIconMap){
                race = listOfLinks[1].title
                }
            else {
                race = colorMap[event.target.cellIndex]
                }
            }    
        else if(event.target.getElementsByTagName("a")){
            race = colorMap[event.target.attributes.style.value.match(/\d{3}/)]
            }
        else {
            return -1   
            }
        }catch{
            return -1
        }

    const playerToFetch = whatIsSelected(event.target.innerText)
    console.log(playerToFetch)
    if(playerToFetch===-1){
        return -1;
    }

    const flag = event.target.getElementsByClassName("flag")[0] 
    let country = ""
    if(flag.getElementsByTagName("a").length) {
        country = flag.getElementsByTagName("a")[0].title
        }
    else if(flag.getElementsByTagName("img").length){
        country = flag.getElementsByTagName("img")[0].title
        } 
    if(country in countryDict){
            country = countryDict[country]
        }else if(country.length){
            country = country[0]
        }

    
   

    const playerTable=createElementFromHTML(event.pageX, event.pageY, flag.innerHTML, raceIconMap[race], playerToFetch)
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
        }
    }
    })
}

function displayPlayerInfo(playerData, i){
    const realName = document.getElementsByClassName("realName")[i]
    const winnings = document.getElementsByClassName("winnings")[i]
    const overall = document.getElementsByClassName("overall")[i]
    const overallElo = document.getElementsByClassName("overallElo")[i]
    const vP = document.getElementsByClassName("vP")[i]
    const vPelo = document.getElementsByClassName("vPelo")[i]
    const vT = document.getElementsByClassName("vT")[i]
    const vTelo= document.getElementsByClassName("vTelo")[i]
    const vZ = document.getElementsByClassName("vZ")[i]
    const vZelo = document.getElementsByClassName("vZelo")[i]
    let winningsData = 0
    let playerName = "Not Available"
    if(playerData[i].winnings) winningsData = playerData[i].winnings
    if(playerData[i].name) playerName = playerData[i].name
    realName.innerText=playerName
    winnings.innerHTML="<b>Total Winnings:</b> "+winningsData
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
                <span class="flag">${flag}</span>
                <span>${race}</span>
                <span>${player}</span>
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

function removeGeneratedTable(){
    const genTable =  document.getElementById("generatedTable")
    if (genTable) genTable.remove()
}
