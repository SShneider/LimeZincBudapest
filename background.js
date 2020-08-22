let playerToFetch
chrome.runtime.onMessage.addListener(
     (request, sender, sendResponse) => {
       (async ()=>{
        let data = await fetchData(request)
        console.log(data)
        sendResponse({aliData:data})
       })()
       
       // sendResponse(aligulacData)
       return true;
  });
// chrome.runtime.onConnect.addListener(function(port) {
//     console.assert(port.name == "knockknock");
//     port.onMessage.addListener(function(msg) {
//         fetch(`http://aligulac.com/search/json/?q=${msg.player}`,
//         {
//             'method':'GET',
//             'headers':{
//                 "Access-Control-Allow-Origin":"*",
//                 'Access-Control-Allow-Methods': 'GET, POST',
//                 'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,observe',
//                 "Access-Control-Allow-Credentials":"true",


//             }
//         }).then(
//             function(response){
//                 response = response.json()
//                 console.log(response)
//                port.postMessage({player:response})
//             }
//         )

//     });
//     return true;
//   });


async function fetchData(request){
    // function xhrListener () {
    //     console.log(this.responseText);
    //   }
    // const xhr  = new XMLHttpRequest()
    // xhr.addEventListener("load", xhrListener, true);
    // xhr.open("GET", `http://aligulac.com/search/json/?q=${playerIn})
    // xhr.send()

    let data = await fetch(`http://aligulac.com/search/json/?q=${request.player}`,
    {
            'method':'GET',
            'headers':{
                "Access-Control-Allow-Origin":"*",
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'

            }
    })
    return data.json()

}