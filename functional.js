
console.log('connected')
const contentArea = document.getElementById("main-content-column")


console.log(contentArea)
let playerToFind;
contentArea.addEventListener("dblclick",  ()   =>  findPlayer(event))
let apiKey = 'X8HsOXXCVDayh3vRn75E'

async function findPlayer(event){
    const playerToFetch = whatIsSelected(event.target.innerText)
    if(playerToFetch===-1){
        errorMessage();
        return -1;
    }
    console.log(playerToFetch)
    const data = await fetchPlayerData(playerToFetch)
    console.log(data)
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

function fetchPlayerData(playerIn){
    chrome.runtime.sendMessage({player: playerIn, apiKey: apiKey}, (response)=> {
    console.log(response)
    })
}