console.log('connected')
const contentArea = document.getElementById("main-content-column")

console.log(contentArea)
let playerToFind;
contentArea.addEventListener("dblclick", ()=>findPlayer(event))


function findPlayer(event){
    const playerToFind = selectedTarget(event)
    if(playerToFind===-1){
        errorMessage()
        return -1;
    }
    fetchData(playerToFind)
}
function selectedTarget(eventIn){
    if(eventIn.target.tagName.toLowerCase()==='span') return eventIn.target.innerText
    
    let potential = eventIn.target.getElementsByTagName('span')
        if(potential.length<1 || potential.length>3){
            return -1
        }
    let captureIdx = 1
    if (eventIn.target.tagName.toLowerCase() === "td") captureIdx = 2

    potential = potential[captureIdx].innerText.trim().split()
        if(potential.length!==1){
            return -1;
        } 
    return potential[0]
}


function errorMessage(){
    alert()
}
function fetchData(playerIn){
    console.log(playerIn)
}