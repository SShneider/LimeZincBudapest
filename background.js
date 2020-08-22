let playerToFetch
chrome.runtime.onMessage.addListener(
     (request, sender, sendResponse) => {
       (async ()=>{
        let data = await fetchByName(request)
        // data = await fetchByIds(data, request.apiKey)
        data = await fetchByIds(data, request.player)
       console.log('finalData', data)
        sendResponse({aliData:data})
       })()
       return true;
  });


async function fetchByName(request){

    const fetchedByName = await fetch(`http://aligulac.com/search/json/?q=${request.player}`,
    {
            'method':'GET',
            'headers':{
                "Access-Control-Allow-Origin":"*",
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'

            }
    })
   return fetchedByName.json()
}
async function fetchByIds(aliObject, playerName){
  const idsArray = [];
    aliObject.players.forEach(player=>{
      idsArray.push(player.id)
    })
    const resultsArray = []
    idsArray.forEach(async (id) =>  {
      const fetchedById = await fetch(`http://aligulac.com/players/${id}-${playerName}`,
  {
          'method':'GET',
          'headers':{
              "Access-Control-Allow-Origin":"*",
              'Access-Control-Allow-Methods': 'GET',
              'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'

          }
  })
  // //fetchedById.body.read().then
  const reader = fetchedById.body.getReader()
  let resOut
  reader.read().then((result)=> {
    resOut = new TextDecoder("utf-8").decode(result.value)
    console.log(resOut)
    resultsArray.push(resOut)
  })
  })
    return resultsArray
}
//FETCH BY IDS BY API. DOESNT RETURN WIN/LOSS
// async function fetchByIds(aliObject, apiKey){
//   //console.log('ali', aliObject)
//   const idsArray = [];
//   aliObject.players.forEach(player=>{
//     idsArray.push(player.id)
//   })
//   const idsToFetch = idsArray.join(';')
//   const fetchedByIds = await fetch(`http://aligulac.com//api/v1/player/set/${idsToFetch}/?apikey=${apiKey}`,
//   {
//           'method':'GET',
//           'headers':{
//               "Access-Control-Allow-Origin":"*",
//               'Access-Control-Allow-Methods': 'GET',
//               'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'

//           }
//   })
//   return fetchedByIds.json();
// }