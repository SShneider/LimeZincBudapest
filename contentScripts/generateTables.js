
function generatePlayerTable(X, Y, flag, race, player) {
    let htmlString = 
    `<tbody>
        <tr>
            <th colspan="7" style="text-align: center;">
                <span class="flag" id="aliFlag">${flag}</span>
                <span id="aliRace">${race}</span>
                <span>${player}</span>
                <span id="playerToggle"></span>
            </th>
        </tr>
        <tr>
            <td colspan="7" style="
                    background-color: #f2f2f2;
                    font-size: 85%;
                    line-height: 90%;
                    height: 13px;
                    text-align: center;
                ">
                <span class="realName"><div class="loader"></span>
            </td>
        </tr>
        <tr>
        <td colspan="7" style="
                background-color: #f2f2f2;
                font-size: 85%;
                line-height: 90%;
                height: 13px;
                text-align: center;
            ">
            <span class="winnings"><div class="loader"></span>
        </td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: left;" class="grouptableslot">
            &nbsp;<b>vS</b>
            </td>
            <td style="width: 32px; white-space: pre; text-align:center;" class = "overall gen"><b><div class="loader"></b></td>
            <td style="width: 32px; white-space: pre; text-align:center;" class = "overallElo gen"><b><div class="loader"></b></td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: left;" class="grouptableslot">
                &nbsp;<a href="/starcraft2/Protoss" title="Protoss"><img alt="" src="/commons/images/a/ab/Picon_small.png"
                        width="17" height="15" loading="lazy" /></a>
            </td>
            <td style="width: 32px; white-space: pre; text-align:center;" class ="vP gen"><b><div class="loader"></b></td>
            <td style="width: 32px; white-space: pre; text-align:center;" class = "vPelo gen"><b><div class="loader"></b></td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: left;" class="grouptableslot">
                &nbsp;<a href="/starcraft2/Terran" title="Terran"><img alt="" src="/commons/images/9/9d/Ticon_small.png"
                        width="17" height="15" loading="lazy" /></a>
            </td>
            <td style="width: 32px; white-space: pre; text-align:center;" class="vT gen"><b><div class="loader"></b></td>
            <td style="width: 32px; white-space: pre; text-align:center;" class="vTelo gen"><b><div class="loader"></b></td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: left;" class="grouptableslot">
                &nbsp;<a href="/starcraft2/Zerg" title="Zerg"><img alt="" src="/commons/images/c/c9/Zicon_small.png"
                        width="17" height="15" loading="lazy" /></a>
            </td>
            <td style="width: 32px; white-space: pre; text-align:center;" class = "vZ gen"><b><div class="loader"></b></td>
            <td style="width: 32px; white-space: pre; text-align:center;" class="vZelo  gen"><b><div class="loader"></b></td>
        </tr>
        </tbody>
        `
  
    removeGeneratedTable(0, "generatedPlayerTable")
    return generateTableWrapper(X, Y, htmlString, "generatedPlayerTable")
}
//make table preview show only final Standings TH 
//and Mean Score TH
//and the right side would be a progress bar
//make single player predict cache user 

function generateTableWrapper(X, Y, htmlString, typeOfTable){
    let  tableOut = document.createElement('table');
    if(typeOfTable==="generatedPlayerTable") tableOut.classList.add("matchlist", "wikitable", "aliTable")
    else if(typeOfTable==="rrTable") tableOut.classList.add("wikitable", "wikitable-striped", "wikitable-bordered",  "aliTable")
    tableOut.setAttribute('id', typeOfTable)
    tableOut.innerHTML = htmlString.trim();
    tableOut.style.position = "absolute"
    tableOut.style.zIndex = "999"
    tableOut.style.left = (X-325)+"px"
    tableOut.style.top = (Y-100)+"px"
    return tableOut
}
const rrString1= `<tbody>
<tr><th colspan="6">Final Standings Probability</th></tr>
<tr><th style="min-width:21px"></th>
<th style="min-width:21px"></th>
<th style="min-width:21px"></th>
<th style="min-width:100px">Player</th>`

const rrString2 = `<th style="min-width:21px">` //Header places. 1 per player in group. Closed by Str 3
const rrString3 = `</th>` //Close Th Tag
const rrString4n13= `</tr>` //Close Row Tag
const rrString5 = `<tr><td style="text-align:center">` //Row Num Col. 1 per player in group. Closed by Str 4
const rrString6n10n12 = `</td>`//Close Col Tag
const rrString7 = `<td style="text-align:center"><span class="flag">` //Opens player flag col. Closed by Str 8
const rrString8=`</span></td><td style="text-align:center">` //Closes Flag, Opens Race col. Closed by Str 9
const rrString9 = `</td><td>` //Closes Race. Opens Player Name. Closed by Str 6.
const rrString11 = `<td style="text-align:center">` //Opens Probability Col. N*N matrix. Closed by Str 6. Then Str 4. 
const rrString14 = `</tbody>` //Closes body. Table is created by document. methods.

function generateRoundRobinTable(tableData){
    let tableString = [rrString1] //1 used up
    for(let i = 0; i<tableData.length; i++){
        tableString.push(rrString2) //2 used up
        tableString.push(i+1)
        tableString.push(rrString3) //3 used up
    }
    tableString.push(rrString4n13) // Header Complete
    for(let i = 0; i<tableData.length; i++){
        tableString.push(rrString5) //Player # Open
        tableString.push(i+1)
        tableString.push(rrString6n10n12) //Player # Close
        tableString.push(rrString7)//Flag Open
        tableString.push(playerIdsDict[tableData[i].player.tag].flagElement)
        tableString.push(rrString8) //Flag Closed Race open
        tableString.push(playerIdsDict[tableData[i].player.tag].raceElement)
        tableString.push(rrString9) //Race Closed Player Name Open
        tableString.push(tableData[i].player.tag)
        tableString.push(rrString6n10n12)
        for(let j = 0; j<tableData[i].probs.length; j++){
            tableString.push(rrString11) //Opens probability col
            if(i===j)tableString.push("<b>")
            tableString.push((tableData[i].probs[j]*100).toFixed(2)+'%') 
            if(i===j)tableString.push("</b>")
            tableString.push(rrString6n10n12) //Closes prob col
        }
        tableString.push(rrString4n13)//closes player row
    }    
    tableString.push(rrString14)//closes tbody
    workArea.append(generateTableWrapper(XforPredictionTable, YforPredictionTable, tableString.join(''), "rrTable"))
}

function removeGeneratedTable(event, typeOfTable){
    if(event){
        for(let i = 0; i<event.path.length; i++){
            if(event.path[i].id && event.path[i].id === typeOfTable) return
        }
    }
    const genTable =  document.getElementById(typeOfTable)
    if (genTable) genTable.remove()
}