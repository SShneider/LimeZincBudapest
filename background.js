let playerToFetch
chrome.runtime.onMessage.addListener(
     (request, sender, sendResponse) => {
       (async ()=>{
         console.log(request)
        let data
        let errorStatus = 0
        try{
          data = await fetchByName(request)
          console.log(123, data)
          if(!data.players.length){
            errorStatus = "notfound"
          }else{
            if(data && data.players && data.players.length>1){
              data = data.players.filter(playerF => playerF.tag.toLowerCase()===request.player.toLowerCase())
              if(!data.length) errorStatus = "notfound"
              else{
                let dataCandidate = data.filter(playerF=> (playerF.race===request.race || request.race === "R"))
                if(dataCandidate.length) data = dataCandidate
                dataCandidate = data.filter(playerF=>(playerF.race===request.race || request.race === "R") && (playerF.country===null || playerF.country[0]===request.country))
                if(dataCandidate.length) data = dataCandidate
              }
            }else{
              data = data.players
            }
            data = await fetchByIds(data, request.player)
            console.log(443, data)
            if(!data.length && !errorStatus) errorStatus="fetcherror"
          }
        }catch{         
          errorStatus = "fetcherror"
        }
        
        sendResponse({aliData:data, action: 'playerDataReturn', errorStatus: errorStatus})
       })()
       return true;
  });


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
      return err
    }
   return fetchedByName.json()
}
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
    return err
  }
  return returnValue
}
async function readThePage(page){
  const reader = page.body.getReader()
  const readFile = await reader.read()
  const resOut = new TextDecoder("utf-8").decode(readFile.value).substring(10000, 40000)
  const winrates = resOut.match(/\d\d.\d\d%\s\(.+?\)/g)
  const elo = resOut.match(/\d{3,}(?=\s±)/g)
  const winnings = resOut.match(/\$.+(?=<)/)
  const idxName = Math.max(resOut.indexOf("Romanized name"), resOut.indexOf("Full name"))
  let name
  if(idxName!==-1){
    const nameString = resOut.substring(idxName, idxName+100)
    const startOfName = nameString.indexOf("<td>")+4
    const endOfName = nameString.indexOf("</tr>")-18
    name = nameString.substring(startOfName, endOfName)
  }
  let returnValue = {}
  if(name) returnValue.name = name
  if(winrates && elo){
    returnValue.winrates=winrates.splice(0,4)
    returnValue.elo=elo.splice(0,4)
  }
  if(winnings) returnValue.winnings = winnings[0]
  return returnValue
}

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