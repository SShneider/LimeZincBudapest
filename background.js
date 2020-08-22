let playerToFetch
chrome.runtime.onMessage.addListener(
     (request, sender, sendResponse) => {
       (async ()=>{
        let data = await fetchByName(request)
        data = await fetchByIds(data, request.apiKey)
       // console.log('finalData', data)
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

async function fetchByIds(aliObject, apiKey){
  //console.log('ali', aliObject)
  const idsArray = [];
  aliObject.players.forEach(player=>{
    idsArray.push(player.id)
  })
  const idsToFetch = idsArray.join(';')
  const fetchedByIds = await fetch(`http://aligulac.com//api/v1/player/set/${idsToFetch}/?apikey=${apiKey}`,
  {
          'method':'GET',
          'headers':{
              "Access-Control-Allow-Origin":"*",
              'Access-Control-Allow-Methods': 'GET',
              'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'

          }
  })
  return fetchedByIds.json();
}