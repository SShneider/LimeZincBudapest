console.log('connected')
const contentArea = document.getElementById("main-content-column")

console.log(contentArea)
let playerToFind;
contentArea.addEventListener("dblclick",  ()   =>  findPlayer(event))


function findPlayer(event){
    const playerToFetch = whatIsSelected(event.target.innerText)
    if(playerToFetch===-1){
        errorMessage();
        return -1;
    }
    //const aligulacStats=fetchData(playerToFetch)
    let data = sendData(playerToFetch)
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
// console.log(sendData('Rogue'))
function sendData(playerIn){
//     var port = chrome.runtime.connect({name: "knockknock"});
// port.postMessage({player:playerIn});
// port.onMessage.addListener(function(msg) {
//  console.log(msg)
// });
chrome.runtime.sendMessage({player: playerIn}, (response)=> {
   console.log(response)
})
    // return new Promise((resolve, reject)=>{
    //     chrome.runtime.sendMessage({player: playerIn}, (response)=> {
    //         if(response.complete) {
    //             resolve()
    //             console.log(123, response)
    //         }
    //         else{
    //             reject('Something Wrong')
    //         }
    //     })
    // })
}