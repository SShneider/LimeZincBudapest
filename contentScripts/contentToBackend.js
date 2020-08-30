function fetchPlayerData(playerIn, raceIn, countryIn, sourceIn="getplayer"){
    chrome.runtime.sendMessage({player: playerIn, country: countryIn, race: raceIn, apiKey: apiKey, source:sourceIn}, async (response)=> {
    if(response){
        if(response.action==="getplayer"){
            if(response.errorStatus==="notfound"){
                errorMessage(1)
            }else if(response.errorStatus){
                errorMessage()
            }else{
                displayPlayerInfo(response.aliData, 0)
                if(response.aliData.length>1){
                    for(let i=0; i<response.aliData.length; i++){
                        createPlayerToggleButton(response.aliData, i)
                    }
                }
            }
        }else if(response.action==="predict"){
                if(response.aliData.errorStats==="fetcherror"){
                    await fetchPlayerData(playerIn, raceIn, countryIn, predict)
                }
                else if(response.aliData.errorStats==="notfound"){
                   return "notfound"
                }
                else{
                    groupArray.push(response.aliData[0])
                    if(groupArray.length===playerRequests.length){
                        processGroupResponse()
                    }
                }
        }else if(response.action==="groupPredict"){
            if(response.errorStatus==="notfound"){
                console.error("notfound")
            }else if(response.errorStatus){
                console.error("fetcherror")
            }else{
                generateRoundRobinTable(request.table)
            }
        }
    }else{
        errorMessage()
    }
    })
}