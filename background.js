chrome.runtime.onMessage.addListener(
     (request, sender, sendResponse) => {
       (async ()=>{
        let data
        let errorStatus = 0
        try{
          data = await fetchByName(request)
          console.log(111, data)
          data = filterPlayer(data, request)
          console.log(999, data)
          if(data === "fetcherror" || data === "notfound"){
            errorStatus = data
          }else{
            data = await fetchByIds(data, request.player)
            console.log(data)  
          }
        }catch(err){
          console.error(err)         
          errorStatus = "fetcherror"
        }
        console.log(errorStatus)
        sendResponse({aliData:data, action: 'playerDataReturn', errorStatus: errorStatus})
       })()
       return true;
  });

//START FETCH PLAYER SEARCH BY NAME USING ALIGULAC API//
async function fetchByName(request){
    let fetchedByName
    try{
      fetchedByName = await fetch(`http://aligulac.com/search/json/?q=${request.player}`,
        {
                'method':'GET',
                'headers':{
                    "Access-Control-Allow-Origin":"*",
                    'Access-Control-Allow-Methods': 'GET',
                    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'

                }
        })
    }catch(err){
      console.error(err)
      return "fetcherror"
    }
   return fetchedByName.json()
}
//END FETCH PLAYER SEARCH BY NAME USING ALIGULAC API//
//START FILTER ALIGULAC API RESULTS TO MATCH LIQUIPEDIA DATA//
function filterPlayer(fetchedByName, request){
  if(!fetchedByName || !fetchedByName.players) {
    return "fetcherror";
  }else if(!fetchedByName.players.length){
     return "notfound"
  }
  //player name is a strong match, player Race and country could be a mismatch or missing.
  fetchedByName = fetchedByName.players.filter(playerF => playerF.tag.toLowerCase()===request.player.toLowerCase())
  if(!fetchedByName.length) return "notfound"
  let dataCandidate = fetchedByName.filter(playerF=> (playerF.race===request.race || request.race === "R"))
  if(dataCandidate.length) fetchedByName = dataCandidate
  dataCandidate = fetchedByName.filter(playerF=>(playerF.race===request.race || request.race === "R") && (playerF.country===null || playerF.country[0]===request.country))
  if(dataCandidate.length) fetchedByName = dataCandidate
  return fetchedByName
}
//END FILTER ALIGULAC API RESULTS TO MATCH LIQUIPEDIA DATA//
//START ITERATE THROUGH ALIGULAC API RESPONSE IF THERE ARE MULTIPLE PLAYERS//
async function fetchByIds(playersIn, playerName){
  const idsArray = [];
    playersIn.forEach(player=>{
      idsArray.push(player.id)
    })

  const resultsArray = []
  for(let i = 0; i<idsArray.length; i++){
      const fetchedSingle = await fetchById(idsArray[i], playerName)
      resultsArray.push(fetchedSingle)
  }
  return resultsArray
}
//END ITERATE THROUGH ALIGULAC API RESPONSE IF THERE ARE MULTIPLE PLAYERS//
//START FETCH ALIGULAC PAGE DIRECTLY - ALIGULAC API DOES NOT PROVIDE WINRATES AND ELO//
async function fetchById(id, playerName){
  let fetchedById
  let returnValue
  try{
    fetchedById = await fetch(`http://aligulac.com/players/${id}-${playerName}`,
    {
            'method':'GET',
            'headers':{
                "Access-Control-Allow-Origin":"*",
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'

            }
    })
    returnValue = await readThePage(fetchedById)
  }catch(err){
    console.error(err)
    return "fetcherror"
  }
  return returnValue
}
//END FETCH ALIGULAC PAGE DIRECTLY - ALIGULAC API DOES NOT PROVIDE WINRATES AND ELO//
//START PROCESS THE PAGE HTML FOR NAME, WINNINGS, WINRATES AND ELO//
async function readThePage(page){
  const reader = page.body.getReader()
  const readFile = await reader.read()
  const resOut = new TextDecoder("utf-8").decode(readFile.value).substring(10000, 40000) //limits html document to about start(Winrate v All) and end(winnings)
  console.log(resOut)
  const winrates = resOut.match(/\d+\.\d\d%\s\(.+?\)/g) //Format: 9.47% (1820/2620)
  const elo = resOut.match(/\d{3,}(?=\s±)/g) //Format: 319 lookahead: ±
  const winnings = resOut.match(/\$.+(?=<)/) //Format: $849,516 lookahead: html tag "<"
  const idxName = Math.max(resOut.indexOf("Romanized name"), resOut.indexOf("Full name"))// regex couldn't handle newlines. 
  let name = "Not available"
  if(idxName!==-1){
    const nameString = resOut.substring(idxName, idxName+100)
    const startOfName = nameString.indexOf("<td>")+4
    const endOfName = nameString.indexOf("</tr>")-18
    name = nameString.substring(startOfName, endOfName)
  }
  let returnValue = {name: name, winnings: 0}
  console.log(winrates, elo)
  if(winrates && elo){
    returnValue.winrates=winrates.splice(0,4)
    returnValue.elo=elo.splice(0,4)
  }
  if(winnings) returnValue.winnings = winnings[0]
  return returnValue
}
//END PROCESS THE PAGE HTML FOR NAME, WINNINGS, WINRATES AND ELO//
