let playerToFetch
chrome.runtime.onMessage.addListener(
     (request, sender, sendResponse) => {
       (async ()=>{
        let data = await fetchByName(request)

        // data = await fetchByIds(data, request.apiKey)
        console.log(123, data)
        data = await fetchByIds(data, request.player)
       console.log('finalData', data)
       
        sendResponse({aliData:data, action: 'playerDataReturn'})
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
async function fetchById(id, playerName){
  const fetchedById = await fetch(`http://aligulac.com/players/${id}-${playerName}`,
  {
          'method':'GET',
          'headers':{
              "Access-Control-Allow-Origin":"*",
              'Access-Control-Allow-Methods': 'GET',
              'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'

          }
  })
  const returnValue = await readThePage(fetchedById)
  console.log(returnValue)
  return returnValue
}
async function readThePage(page){
  const reader = page.body.getReader()
  const readFile = await reader.read()
  const resOut = new TextDecoder("utf-8").decode(readFile.value).substring(10000, 40000)
  //console.log(resOut.length)114151
  const winrates = resOut.match(/\d\d.\d\d%\s\(.+?\)/g)
  const elo = resOut.match(/\d{3,}(?=\s±)/g)
  const winnings = resOut.match(/\$.+(?=<)/)
  const idxName = Math.max(resOut.indexOf("Romanized name"), resOut.indexOf("Full name"))
  let name=""
  if(idxName!==-1){
    const nameString = resOut.substring(idxName, idxName+100)
    //console.log(nameString)
    const startOfName = nameString.indexOf("<td>")+4
    const endOfName = nameString.indexOf("</tr>")-18
    name = nameString.substring(startOfName, endOfName)
  }
  //console.log(name)
  let returnValue = {name:name}
  if(winrates && elo){
    returnValue.winrates=winrates.splice(0,4)
    returnValue.elo=elo.splice(0,4)
  }
  if(winnings) returnValue.winnings = winnings[0]
  return returnValue
}
async function fetchByIds(aliObject, playerName, ){
  const idsArray = [];
    aliObject.players.forEach(player=>{
      idsArray.push(player.id)
    })
   const resultsArray = []
   for(let i = 0; i<idsArray.length; i++){
      const fetchedSingle = await fetchById(idsArray[i], playerName)
      console.log(fetchedSingle)
      resultsArray.push(fetchedSingle)
  }
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