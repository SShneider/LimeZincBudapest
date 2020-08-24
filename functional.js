
console.log('connected')
const contentArea = document.getElementById("main-content-column")


console.log(contentArea)
let playerToFind;
contentArea.addEventListener("dblclick",  ()   =>  findPlayer(event))
let apiKey = 'X8HsOXXCVDayh3vRn75E'

async function findPlayer(event){
    console.log(event)
    const playerToFetch = whatIsSelected(event.target.innerText)
    if(playerToFetch===-1){
        errorMessage();
        return -1;
    }
    //console.log(playerToFetch)
    await fetchPlayerData(playerToFetch, event.pageX, event.pageY)
    //console.log('Data: ', data)
}

function whatIsSelected(contentString){
    if(!contentString.length) return -1;
    contentString = contentString.trim().split(/\s+/)
    if(!contentString.length>2) return -1;
    return contentString[0].trim()
}

function errorMessage(){
    alert()
}

function fetchPlayerData(playerIn, X, Y){
    chrome.runtime.sendMessage({player: playerIn, apiKey: apiKey}, (response)=> {
    console.log(response)
    if(response && response.action==="playerDataReturn"){
        displayPlayerInfo(response.aliData, X, Y)
    }
    })
}

function displayPlayerInfo(playerData, X, Y){
    //console.log()
    console.log(X, Y)
    let testfield = document.getElementById("testfield")
    testfield.innerText=playerData[0].winrates[0]
    const table = document.getElementById("generatedTable")
    table.style.left = (X-325)+"px"
    table.style.top = (Y-100)+"px"
}