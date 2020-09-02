
//START FETCH GROUP PREDICTIONS FOR A NEW GROUP//
async function fetchGroupPredictions(requestIn, apiKey, BoX, existingScores =''){
    let fetchedPredictions
    try {
      fetchedPredictions = await fetch(`http://aligulac.com/api/v1/predictrrgroup/${requestIn}/?apikey=${apiKey}&bo=${BoX}${existingScores}`,
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

  function setExistingScores(allMatches, doneMatches){
    //needed output: "matchid_player=X,matchid_player=Y", i.e. 0_1=1,0_2=2. Match Id comes from allMatches, score comes from doneMatches
    //donematches format: "playerName1playerName2" : {playerName1: score, playerName2: score}
    //relevant input: allmatches.identifier = matchid, allmatches.pla||plb.tag = playerName

    let existingScores = ['&']
    let potentialKeyOne = ''
    let potentialKeyTwo = ''
    let plaLower = ''
    let plbLower = ''
    for(let i = 0; i<allMatches.length; i++){
      let actualKey = ''
      plaLower = allMatches[i].pla.tag.toLowerCase()
      plbLower = allMatches[i].plb.tag.toLowerCase()
      potentialKeyOne = plaLower+plbLower
      potentialKeyTwo = plbLower+plaLower
      if(doneMatches[potentialKeyOne]) actualKey = potentialKeyOne
      else if(doneMatches[potentialKeyTwo]){
        actualKey = potentialKeyTwo
      }
      if(actualKey.length){
        existingScores.push(allMatches[i].identifier+'_1='+doneMatches[actualKey][plaLower])
        existingScores.push(allMatches[i].identifier+'_2='+doneMatches[actualKey][plbLower])
      }
    }
    return existingScores.join('&')
  }