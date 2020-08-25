//console.log('connected')
const contentArea = document.getElementById("main-content-column")
const colorMap = {251:"Zerg", 222: "Terran", 221: "Protoss", 0: "Protoss", 1: "Terran", 2: "Zerg"}
const terranString = `<a href="/starcraft2/Terran" title="Terran"><img alt="" src="/commons/images/9/9d/Ticon_small.png" width="17" height="15" loading="lazy"></a>`
const zergString = `<a href="/starcraft2/Zerg" title="Zerg"><img alt="" src="/commons/images/c/c9/Zicon_small.png" width="17" height="15" loading="lazy"></a>`
const protossString = `<a href="/starcraft2/Protoss" title="Protoss"><img alt="" src="/commons/images/a/ab/Picon_small.png" width="17" height="15" loading="lazy"></a>`
const raceIconMap = { Zerg: zergString, Terran: terranString, Protoss: protossString}

//console.log(contentArea)
contentArea.addEventListener("dblclick",  ()   =>  findPlayer(event))
let apiKey = 'X8HsOXXCVDayh3vRn75E'

async function findPlayer(event){
    console.log(event)
    //console.log(event.target.attributes.style.value)
    const playerToFetch = whatIsSelected(event.target.innerText)
    if(playerToFetch===-1){
        errorMessage();
        return -1;
    }
    //console.log(playerToFetch)
    const flag = event.target.getElementsByClassName("flag")[0] 
    let country = flag.getElementsByTagName("a")[0].title
    if(country==="South Korea") country = "K"
    let race
    //if(event.target.className.indexOf("grouptableslot")!==-1)
    if(event.target.nodeName==="TD"){
        const listOfLinks = event.target.getElementsByTagName("a")

        if(listOfLinks && listOfLinks.length === 3 && listOfLinks[1].title in raceIconMap) race = listOfLinks[1].title
        else race = colorMap[event.target.cellIndex]
    } 
    else if(event.target.getElementsByTagName("a")) race = colorMap[event.target.attributes.style.value.substring(16,19)]
    else return -1
    //console.log(event.target.attributes.style.value.substring(16,20))
     //= event.target.getElementsByTagName("a")[1].innerHTML
    const playerTable=createElementFromHTML(event.pageX, event.pageY, flag.innerHTML, raceIconMap[race], playerToFetch)
    contentArea.append(playerTable)
    await fetchPlayerData(playerToFetch, race[0], country[0])
    //console.log('Data: ', data)
}

function whatIsSelected(contentString){
   // let contentString = target.innerText
    
    // const flag = target.getElementsByClassName("flag")[0]
    // const race = taget
  
    
    if(!contentString.length) return -1;
    contentString = contentString.trim().split(/\s+/)
    if(!contentString.length>2) return -1;
    return contentString[0].trim()
}

function errorMessage(){
    alert()
}

function fetchPlayerData(playerIn, raceIn, countryIn){
    chrome.runtime.sendMessage({player: playerIn, country: countryIn, race: raceIn, apiKey: apiKey}, (response)=> {
    console.log(response)
    if(response && response.action==="playerDataReturn"){
        displayPlayerInfo(response.aliData, 0)
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
  
    const genTable =  document.getElementById("generatedTable")
    if (genTable) genTable.remove()
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
