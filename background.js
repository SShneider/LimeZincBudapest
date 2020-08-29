chrome.runtime.onMessage.addListener(
     (request, sender, sendResponse) => {
       (async ()=>{
        let data
        let errorStatus = 0
        if(request.source==="groupPredict"){
          console.log(request)
          data = await fetchGroupPredictions(request.player, request.apiKey)
          console.log(data)
        }else{
          try{
            data = await fetchByName(request)
            console.log(111, data)
            data = filterPlayer(data, request)
            if(data === "fetcherror" || data === "notfound"){
              errorStatus = data
            }else if(request.source==="getplayer"){
              data = await fetchByIds(data, request.player)
              if(data === "fetcherror" || data === "notfound") errorStatus = data
            }
          }catch(err){
            console.error(err)         
            errorStatus = "fetcherror"
          }
        }
        sendResponse({aliData:data, action: request.source, errorStatus: errorStatus})
      })()
       return true;
  });
//START FETCH GROUP PREDICTIONS FOR A NEW GROUP//
async function fetchGroupPredictions(requestIn, apiKey){
  let fetchedPredictions
  try {
    fetchedPredictions = await fetch(`http://aligulac.com/api/v1/predictrrgroup/${requestIn}/?apikey=${apiKey}&bo=3`,
    {
            'method':'GET',
            'headers':{
                "Access-Control-Allow-Origin":"*",
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'

            }
    })
  } catch (error) {
    console.error(error)
    return "fetcherror"
  }
  return fetchedPredictions.json()
}
//END FETCH GROUP PREDICTIONS FOR A NEW GROUP//
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
      const fetchedSingle = await fetchById(idsArray[i], playerName, playersIn[i])
      if(fetchedSingle==="notfound" || fetchedSingle=="fetcherror") return fetchedSingle
      resultsArray.push(fetchedSingle)
  }
  return resultsArray
}
//END ITERATE THROUGH ALIGULAC API RESPONSE IF THERE ARE MULTIPLE PLAYERS//
//START FETCH ALIGULAC PAGE DIRECTLY - ALIGULAC API DOES NOT PROVIDE WINRATES AND ELO//
async function fetchById(id, playerName, playerIn){
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
  //returning country and race in case they are absent on liquipedia
  if(playerIn.country) returnValue.country = playerIn.country
  if(playerIn.race) returnValue.race = playerIn.race
  return returnValue
}
//END FETCH ALIGULAC PAGE DIRECTLY - ALIGULAC API DOES NOT PROVIDE WINRATES AND ELO//
//START PROCESS THE PAGE HTML FOR NAME, WINNINGS, WINRATES AND ELO//
async function readThePage(page){
  const reader = page.body.getReader()
  const readFile = await reader.read()
  const resOut = new TextDecoder("utf-8").decode(readFile.value).substring(10000, 40000) //limits html document to about start(Winrate v All) and end(winnings)
  if(!resOut.length) return "fetcherror"
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
  let returnValue = {name: name, winnings: 0, winrates: ["0/0","0/0","0/0","0/0"], elo: [0, 0, 0, 0]}
  if(winrates) returnValue.winrates=winrates.splice(0,4)
  if(elo) returnValue.elo=elo.splice(0,4)
  if(winnings) returnValue.winnings = winnings[0]
  return returnValue
}
//END PROCESS THE PAGE HTML FOR NAME, WINNINGS, WINRATES AND ELO//
