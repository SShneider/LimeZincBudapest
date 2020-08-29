
function createElementFromHTML(X, Y, flag, race, player) {
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
  
    removeGeneratedTable()
    let  tableOut = document.createElement('table');
    tableOut.classList.add("matchlist", "wikitable", "aliTable")
    tableOut.setAttribute('id', 'generatedTable')
    tableOut.innerHTML = htmlString.trim();
    tableOut.style.position = "absolute"
    tableOut.style.zIndex = "999"
    tableOut.style.left = (X-325)+"px"
    tableOut.style.top = (Y-100)+"px"
    return tableOut
}