function generatePlayerRequest(event){
    const playerToFetch = whatIsSelected(event.target.innerText) //splices the name of the player out
    if(playerToFetch===-1){
        return -1;
    }
    if(playerIdsDict[playerToFetch]){//fetches player if player is cached already
        return {playerToFetch, flagElement:playerIdsDict[playerToFetch].flagElement, race: playerIdsDict[playerToFetch].race, country:playerIdsDict[playerToFetch].country}
    }
    let race = "R" //placeholder for race if it is not present on liquipedia
    try{
        if(event.target.nodeName==="TD"){
            const listOfLinks = event.target.getElementsByTagName("a")
            if(listOfLinks) 
                if(listOfLinks.length === 3 && listOfLinks[1].title in raceIconMap){
                    race = listOfLinks[1].title
                }
                else if(listOfLinks[0].title in raceIconMap){
                    race = listOfLinks[0].title // unique case for expanded group stage.
                }
            else {
                race = colorMap[event.target.cellIndex]//participants list doesnt have race explicitly stated. Col 1 = P, 2 = T, 3 = Z
                }
            }    
        else if(event.target.className.includes("bracket-player-top") || event.target.className.includes("bracket-player-bottom")){
            //Brackets are the only event where the element of origin is not a <TD>
            race = colorMap[event.target.attributes.style.value.match(/\d{3}/)]
            //Brackets don't have race icons. Race is captured using distinct bg colors
            }
        else {
            return -1   
            }
        }catch{
            return -1
        }
    if(!race) race = "R"    //placeholder for when the race is not listed
  

    const flag = event.target.getElementsByClassName("flag")[0] 
    let country = ""
    let flagElement = ""
    if(flag){
        flagElement = flag.innerHTML
        if(flag.getElementsByTagName("a").length) {
            country = flag.getElementsByTagName("a")[0].title
            }
        else if(flag.getElementsByTagName("img").length){
            country = flag.getElementsByTagName("img")[0].title
            }
    }
    if(country in countryDict){//some countries on aligulac are abbreviated differently
            country = countryDict[country]
        }else if(country.length){
            country = country[0]
        }
    return {playerToFetch, flagElement, race, country}
}

function whatIsSelected(contentString){
    if(!contentString.length) return -1;
    contentString = contentString.trim().split(/\s+/)
    if(!contentString.length>2) return -1; 
    contentString = contentString[0].trim().split(/▲|▼/)
    if(!contentString.length>2) return -1; 
    return contentString[0].trim()
}