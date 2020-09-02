function fetchPlayerData(playerIn, raceIn, countryIn, sourceIn="getplayer"){
    if(playerStatsDict[playerIn] && sourceIn==="getplayer"){
        processAliDataForPlayerStats(playerStatsDict[playerIn])
    }
    else{
        chrome.runtime.sendMessage({player: playerIn, country: countryIn, race: raceIn, apiKey: apiKey, source:sourceIn}, async (response)=> {
        if(response){
            if(response.action==="getplayer"){
                if(response.errorStatus==="notfound"){
                    errorMessage(1)
                }else if(response.errorStatus){
                    errorMessage()
                }else{
                    processAliDataForPlayerStats(response.aliData, playerIn)
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
                    //console.log(response.table)
                    rrPredictionDict[currentId] = response.aliData.table
                    generateRoundRobinTable(response.aliData.table)
                }
            }
        }else{
            errorMessage()
        }
        })
    }
}

function processAliDataForPlayerStats(data, playerIn){
    displayPlayerInfo(data, 0)
    const isMultipleResults = data.length>1
    for(let i=0; i<data.length; i++){
        if(isMultipleResults){
            createPlayerToggleButton(data, i)
        }
        playerStatsDict[playerIn] = data
    }
    console.log(playerStatsDict)
}