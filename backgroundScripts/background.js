chrome.runtime.onMessage.addListener(
     (request, sender, sendResponse) => {
       (async ()=>{
        let data
        let errorStatus = 0
        if(request.source==="groupPredict"){
          data = await fetchGroupPredictions(request.player, request.format, request.apiKey, request.BoX)
          let existingScores
          if(Object.keys(request.completedMatches)){
            existingScores = setExistingScores(data.matches, request.completedMatches)
            data = await fetchGroupPredictions(request.player, request.format, request.apiKey, request.BoX, existingScores)
          } 
          console.log(data)
        }else{
          try{
            data = await fetchByName(request)
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