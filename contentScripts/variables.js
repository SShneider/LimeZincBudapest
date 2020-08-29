//START FUNCTIONALGETPLAYERS.JS VARIABLES//
const colorMap = {251:"Zerg", 222: "Terran", 221: "Protoss", 0: "Protoss", 1: "Terran", 2: "Zerg"}
const terranString = `<a href="/starcraft2/Terran" title="Terran"><img alt="" src="/commons/images/9/9d/Ticon_small.png" width="17" height="15" loading="lazy"></a>`
const zergString = `<a href="/starcraft2/Zerg" title="Zerg"><img alt="" src="/commons/images/c/c9/Zicon_small.png" width="17" height="15" loading="lazy"></a>`
const protossString = `<a href="/starcraft2/Protoss" title="Protoss"><img alt="" src="/commons/images/a/ab/Picon_small.png" width="17" height="15" loading="lazy"></a>`
const raceIconMap = { Zerg: zergString, Terran: terranString, Protoss: protossString, Z: zergString, T: terranString, P: protossString}
const countryDict = {"South Korea":"K", "Germany":"D", "Croatia":"H"}
let apiKey = 'X8HsOXXCVDayh3vRn75E'
//END FUNCTIONALGETPLAYERS.JS VARIABLES//

//START GENERATE PREDICTIONS VARIABLES//
//start aligulac strings//
const bestofN = "predictmatch"//exactly 2 players 
const gslFormat = "predictdual"//exactly 4 players
const singleEleim = "predictsebracket"//number of players that is a power of 2
const swiss = "predictrrgroup"
//end aligulac strings//
const singleMatchDict ={format: bestofN, bo: 1} //default dict
let groupArray = [] //returns an array of player ids from aligulac
let playerRequests = [] //array of players listed on liquipedia, processed for backend requests
let playerIdsDict = {} //list of aligulac playerIds already fetched Name:Id
let predictPlayersNames = [] //list of players in current prediction array, independent of whether they're already in dictionary.
//END GENERATE PREDICTIONS VARIABLES//