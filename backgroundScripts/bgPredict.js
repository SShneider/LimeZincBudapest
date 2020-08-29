
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