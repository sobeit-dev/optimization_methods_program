const CITY_NUM = 15;
let COORDS_TABLE = document.getElementById("coords_table");
let MATRIX_TABLE = document.getElementById("matrix_table");
let DATA_FILE = document.getElementById("input__file");
let FORM = document.getElementsByClassName("m_form")[0];
let MAIN_DATA;

// ---------- function
FORM.style.display = "none";
function UnInit(element) { element.innerHTML = ""; }

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

        let td = document.createElement('td');
        td.innerHTML = MAIN_DATA.CITY_INFO[i].name;
        tr.append(td);

        td = document.createElement('td');
        td.innerHTML = MAIN_DATA.CITY_INFO[i].lat;
        tr.append(td);

        td = document.createElement('td');
        td.innerHTML = MAIN_DATA.CITY_INFO[i].lng;
        tr.append(td);

        tbody.append(tr);
    }
    parent.append(tbody);
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
        th.innerHTML = MAIN_DATA.CITY_INFO[i].name;
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
                th.innerHTML = MAIN_DATA.CITY_INFO[i].name;
                th.style.borderTopLeftRadius = 0;
                tr.append(th);
            }
            else
            {
                let td = document.createElement('td');
                td.innerHTML = MAIN_DATA.DISTANCE_MATRIX[i][j-1];
                tr.append(td);
            }
        }
        tbody.append(tr);
    }
    parent.append(tbody);
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
}

DATA_FILE.onchange = function()
{
    let reader = new FileReader();
    reader.readAsText(DATA_FILE.files[0]);
    reader.onload = function() 
    {
        UnInit(COORDS_TABLE);
        UnInit(MATRIX_TABLE);
        MAIN_DATA = {};
        MAIN_DATA = JSON.parse(reader.result);
        FORM.style.display = "flex";
        InitCoordsTable(COORDS_TABLE, CITY_NUM);
        InitMatrixTable(MATRIX_TABLE, CITY_NUM);
        InitBacklight(MATRIX_TABLE, CITY_NUM);
    };
}