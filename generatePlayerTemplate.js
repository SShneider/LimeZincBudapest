const htmlString = `<tbody>
<tr>
    <th colspan="7" style="text-align: center;">
        <span class="glag">Player Flag</span>
        <span>Player Name</span>
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
        <span id="testfield">Player Winnings.</span>
    </td>
</tr>
<tr>
    <td colspan="3" style="text-align: left;" class="grouptableslot">
  
    </td>
    <td style="width: 32px; white-space: pre; text-align:center;"><b>00.00%(0000/0000)</b></td>
    <td style="width: 32px; white-space: pre; text-align:center;"><b>3333</b></td>
</tr>
<tr>
    <td colspan="3" style="text-align: left;" class="grouptableslot">
        &nbsp;<a href="/starcraft2/Protoss" title="Protoss"><img alt="" src="/commons/images/a/ab/Picon_small.png"
                width="17" height="15" loading="lazy" /></a>
    </td>
    <td style="width: 32px; white-space: pre; text-align:center;"><b>00.00%(0000/0000)</b></td>
    <td style="width: 32px; white-space: pre; text-align:center;"><b>3333</b></td>
</tr>
<tr>
    <td colspan="3" style="text-align: left;" class="grouptableslot">
        &nbsp;<a href="/starcraft2/Terran" title="Terran"><img alt="" src="/commons/images/9/9d/Ticon_small.png"
                width="17" height="15" loading="lazy" /></a>
    </td>
    <td style="width: 32px; white-space: pre; text-align:center;"><b>00.00%(0000/0000)</b></td>
    <td style="width: 32px; white-space: pre; text-align:center;"><b>3333</b></td>
</tr>
<tr>
    <td colspan="3" style="text-align: left;" class="grouptableslot">
        &nbsp;<a href="/starcraft2/Zerg" title="Zerg"><img alt="" src="/commons/images/c/c9/Zicon_small.png"
                width="17" height="15" loading="lazy" /></a>
    </td>
    <td style="width: 32px; white-space: pre; text-align:center;"><b>00.00%(0000/0000)</b></td>
    <td style="width: 32px; white-space: pre; text-align:center;"><b>3333</b></td>
</tr>
</tbody>
`


function createElementFromHTML(htmlString) {
    let  tableOut = document.createElement('table');
    tableOut.classList.add("matchlist", "wikitable")
    tableOut.setAttribute('id', 'generatedTable')
    tableOut.innerHTML = htmlString.trim();
    tableOut.style.position = "absolute"
    tableOut.style.zIndex = "999"
    tableOut.style.border = "2px solid black"
    // Change this to div.childNodes to support multiple top-level nodes
    return tableOut
}
const playerTable = createElementFromHTML(htmlString)
const parentArea = document.getElementById("mw-content-text")

//console.log(playerTable)
parentArea.appendChild(playerTable)
//parentArea.style.position = "relative"