const CITY_NUM = 15;
let COORDS_TABLE = document.getElementById("coords_table");
let MATRIX_TABLE = document.getElementById("matrix_table");
let INPUTS_ELEM_CORDS = [];
let INPUTS_ELEM_DIST = []
let NAMES_POINTER = [[],[]];
for (let i = 0; i < CITY_NUM; i++)
{
    INPUTS_ELEM_CORDS.push([]);
    INPUTS_ELEM_DIST.push([]);
}
 
InitCoordsTable(COORDS_TABLE, CITY_NUM);
InitMatrixTable(MATRIX_TABLE, CITY_NUM);
InitBacklight(MATRIX_TABLE, CITY_NUM);

// ---------- function

function InitCoordsTable(parent, CITY_NUM)
{
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');
    let th = []
    for (let i = 0; i < 3; i++) th.push(document.createElement('th'))
    th[0].innerHTML = "Название";
    th[1].innerHTML = "Широта";
    th[2].innerHTML = "Долгота";
    for(i of th) tr.append(i);
    thead.append(tr);
    parent.append(thead);

    let tbody = document.createElement('tbody');
    for (let i = 0; i < CITY_NUM; i++) 
    {
        let tr = document.createElement('tr');
        for (let j = 0; j < 3; j++) 
        {
            let td = document.createElement('td');
            INPUTS_ELEM_CORDS[i][j] = document.createElement('input');
            if(j == 0)
            {
                INPUTS_ELEM_CORDS[i][j].setAttribute("type", "text");
                
                INPUTS_ELEM_CORDS[i][j].onchange = function()
                {
                    NAMES_POINTER[0][i].innerHTML = this.value;
                    NAMES_POINTER[1][i].innerHTML = this.value;
                }
            }
            else
            {
                INPUTS_ELEM_CORDS[i][j].setAttribute("type", "number");
                INPUTS_ELEM_CORDS[i][j].setAttribute("step", "0.000000001"); 
            }
            INPUTS_ELEM_CORDS[i][j].setAttribute("required", true);
            td.append(INPUTS_ELEM_CORDS[i][j]);
            tr.append(td);
        }
        tbody.append(tr);
    }
    parent.append(tbody);
}

function OnClickComputeButton()
{
    let CITYS_INFO = []
    let DISTANCE_MATRIX = [];
    for (let i = 0; i < CITY_NUM; i++) 
    {
        CITYS_INFO.push
        ({
            lat:    Number(INPUTS_ELEM_CORDS[i][1].value),
            lng:    Number(INPUTS_ELEM_CORDS[i][2].value),
            name:   String(INPUTS_ELEM_CORDS[i][0].value)
        });
        DISTANCE_MATRIX.push([]);
        for (let j = 0; j < CITY_NUM; j++) 
        {
            if(i == j) {DISTANCE_MATRIX[i][j] = 0; continue;}
            DISTANCE_MATRIX[i][j] = Number(INPUTS_ELEM_DIST[i][j].value);
        } 
    }
    let MAIN_DATA = {"CITY_INFO": CITYS_INFO, "DISTANCE_MATRIX": DISTANCE_MATRIX}

    let date = new Date();
    let filename = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}_${date.getHours()}h-${date.getMinutes()}m-${date.getSeconds()}s.json`;
    download(filename, JSON.stringify(MAIN_DATA));
    ShouPopUp(`Для просмотра результата, загрузите файл c именем "${filename}" с вашего компьютера на этой <a href='Show_data.html'>странице</a>.`);
}

function ShouPopUp(msg)
{
    document.body.style.setProperty("overflow-y", "hidden", "important");

    let close_b = document.createElement('div');
    close_b.innerHTML = "&times;";
    close_b.classList.add('pop_up-close');


    let msg_box = document.createElement('div');
    msg_box.classList.add('pop_up-msg');

    msg_box.innerHTML = msg;
    msg_box.append(close_b);

    let = blur_box = document.createElement('div');
    blur_box.classList.add('pop_up-blur');

    blur_box.append(msg_box);

    document.body.append(blur_box);

    close_b.onclick = function()
    {
        document.body.removeChild(blur_box);
        document.body.style.setProperty("overflow-y", "auto");
    }
}

function InitMatrixTable(parent, CITY_NUM)
{
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');

    let th = document.createElement('th');
    tr.append(th);

    for (let i = 0; i < CITY_NUM; i++)
    {
        th = document.createElement('th');
        NAMES_POINTER[0].push(th);
        tr.append(th);
    }
    thead.append(tr);
    parent.append(thead);

    let tbody = document.createElement('tbody');
    for (let i = 0; i < CITY_NUM; i++) 
    {
        let tr = document.createElement('tr');
        for (let j = 0; j < CITY_NUM + 1; j++) 
        {
            if(j == 0)
            {
                let th = document.createElement('th');
                th.style.borderTopLeftRadius = 0;
                NAMES_POINTER[1].push(th);
                tr.append(th);
            }
            else
            {
                let td = document.createElement('td');
                if(j-1 == i)
                {
                    INPUTS_ELEM_DIST[i][j-1] = 0;
                    td.innerHTML = "0";
                }
                else
                {
                    INPUTS_ELEM_DIST[i][j-1] = document.createElement('input');
                    INPUTS_ELEM_DIST[i][j-1].style.width = "90px";
                    INPUTS_ELEM_DIST[i][j-1].setAttribute("type", "number");
                    INPUTS_ELEM_DIST[i][j-1].setAttribute("step", "0.001");
                    INPUTS_ELEM_DIST[i][j-1].setAttribute("required", true); 
                    td.append(INPUTS_ELEM_DIST[i][j-1]);
                }
                tr.append(td);
            }
        }
        tbody.append(tr);
    }
    parent.append(tbody);
    NAMES_POINTER[1][NAMES_POINTER[1].length - 1].style.borderBottomLeftRadius = "5px";

    // synchronization
    for(let i = 0; i < CITY_NUM; ++i)
        for(let j = i + 1; j < CITY_NUM; ++j)
        {
            let elem0 = INPUTS_ELEM_DIST[i][j];
            let elem1 = INPUTS_ELEM_DIST[j][i];
            if(!Number.isInteger(elem0))
            {
                elem0.oninput = function()
                {
                    elem1.value = elem0.value;
                }
            }
            if(!Number.isInteger(elem1))
            {
                elem1.oninput = function()
                {
                    elem0.value = elem1.value;
                }
            }
        }
}

function InitBacklight(parent, CITY_NUM)
{
    let cls = parent.getElementsByTagName("td");
    let th = parent.getElementsByTagName("th");
    let sColor = "#ff7a3b";
    let dColor = "#327ede";
    for (let i = 0; i < cls.length; i++) 
    {
        cls[i].addEventListener("mouseover", function(e)
        {
            let cell = e.target;
            let xGround = th[cell.cellIndex];
            let yGround = th[cell.parentNode.rowIndex + CITY_NUM];
            if(xGround === undefined || yGround === undefined) return;
            xGround.style.background = sColor;
            yGround.style.background = sColor;
        }, false);

        cls[i].addEventListener("mouseout", function(e)
        {
            let cell = e.target;
            let xGround = th[cell.cellIndex];
            let yGround = th[cell.parentNode.rowIndex + CITY_NUM];
            if(xGround === undefined || yGround === undefined) return;
            xGround.style.background = dColor;
            yGround.style.background = dColor;
        }, false);
    }

    for (let i = 0; i < CITY_NUM; i++) 
    {
        for (let j = 0; j < CITY_NUM; j++) 
        {
            let elem = INPUTS_ELEM_DIST[i][j];
            if(!Number.isInteger(elem))
            {
                elem.addEventListener("mouseover", function()
                {
                    let xGround = th[CITY_NUM+i+1];
                    let yGround = th[j+1];
                    if(xGround === undefined || yGround === undefined) return;
                    xGround.style.background = sColor;
                    yGround.style.background = sColor;
                }, false);
                elem.addEventListener("mouseout", function()
                {
                    let xGround = th[CITY_NUM+i+1];
                    let yGround = th[j+1];
                    if(xGround === undefined || yGround === undefined) return;
                    xGround.style.background = dColor;
                    yGround.style.background = dColor;
                }, false);
            }
        }
    }
}

function download(filename, text) 
{
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}