const htmlString = `<tbody>
<tr>
    <th
        colspan="7"
        style="text-align: center;"
    >
        <span class="glag">Player Flag</span>
        <span>Player Name</span>
    </th>
</tr>
<tr>
    <td
        colspan="7"
        style="
            background-color: #f2f2f2;
            font-size: 85%;
            line-height: 90%;
            height: 13px;
            text-align: center;
        "
    >
        <span>Player Winnings.</span>
    </td>
</tr>
<tr class="bg-up">
    <td
        colspan="3"
        style="text-align: left;"
        class="grouptableslot"
    >
        &nbsp;<span style="white-space: pre;">
            All</span
        >
    </td>
</tr>
<tr class="bg-up">
    <td
        colspan="3"
        style="text-align: left;"
        class="grouptableslot"
    >
        &nbsp;<a
            href="/starcraft2/Protoss"
            title="Protoss"
            ><img
                alt=""
                src="/commons/images/a/ab/Picon_small.png"
                width="17"
                height="15"
                loading="lazy" /></a
        >&nbsp;<span
            style="white-space: pre;"
        >
            vP</span
        >
    </td>
</tr>
<tr class="bg-up">
    <td
        colspan="3"
        style="text-align: left;"
        class="grouptableslot"
    >
        &nbsp;<a
            href="/starcraft2/Terran"
            title="Terran"
            ><img
                alt=""
                src="/commons/images/9/9d/Ticon_small.png"
                width="17"
                height="15"
                loading="lazy" /></a
        >&nbsp;<span
            style="white-space: pre;"
        >
            vT</span
        >
    </td>
</tr>
<tr class="bg-up">
    <td
        colspan="3"
        style="text-align: left;"
        class="grouptableslot"
    >
        &nbsp;<a
            href="/starcraft2/Zerg"
            title="Zerg"
            ><img
                alt=""
                src="/commons/images/c/c9/Zicon_small.png"
                width="17"
                height="15"
                loading="lazy" /></a
        >&nbsp;<span
            style="white-space: pre;"
        >
            vZ</span
        >
    </td>
</tr>
</tbody>
`


function createElementFromHTML(htmlString) {
    let  tableOut = document.createElement('table');
    tableOut.classList.add("wikitable","wikitable-bordered","matchlist","wikitable")
    tableOut.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes
    return tableOut
}
const playerTable = createElementFromHTML(htmlString)
const parentArea = document.getElementById("mw-content-text")
console.log(playerTable)
parentArea.appendChild(playerTable)