let MAIN_MAP = L.map('main_map_box').setView([53.902334, 27.5618791], 7);
let DATA_FILE = document.getElementById("input__file");
let RESULT_BOX = document.getElementById("result_box");
let MAIN_DATA;
const CITY_NUM = 15;
let isLoadData = false;
document.getElementsByClassName("leaflet-top leaflet-right")[0].remove();

//----------- map_init
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
{
    attribution: '',
    maxZoom: 18,
    id: 'sobeit229/ckx5aufsz4y8z14nqgzd5cuu9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic29iZWl0MjI5IiwiYSI6ImNrdHJtcXUyazBxZTQybnFvbnhsbnRmOHoifQ.YRFzLbE9QdGrCXjMe511Dw'
}).addTo(MAIN_MAP);

//pk.eyJ1Ijoic29iZWl0MjI5IiwiYSI6ImNrdHJtcXUyazBxZTQybnFvbnhsbnRmOHoifQ.YRFzLbE9QdGrCXjMe511Dw
//mapbox://styles/sobeit229/ckx59gv2a6mmr14pcr7ok1jq8
//id: 'sobeit229/cktrpkh7h4ecw18nwvojkmd3u',
//mapbox://styles/sobeit229/ckx5aufsz4y8z14nqgzd5cuu9

// ---------- events
DATA_FILE.onchange = function()
{
  let reader = new FileReader();
  reader.readAsText(DATA_FILE.files[0]);
  reader.onload = function() 
  {
    MAIN_DATA = {};
    MAIN_DATA = JSON.parse(reader.result);
    isLoadData = true;
  };
}

result_way = [];
function bCalculate()
{
  if(isLoadData)
  {
    let result_matrix = [];
    for (let i = 0; i <= CITY_NUM-1 ; i++)
      result_matrix[i] = [];

    for (let i = 0; i < CITY_NUM; i++) 
      for (let j = 0; j < CITY_NUM; j++) 
        if(MAIN_DATA.DISTANCE_MATRIX[i][j] < 0) MAIN_DATA.DISTANCE_MATRIX[i][j] = Infinity;

    GetCycle(CITY_NUM, MAIN_DATA.DISTANCE_MATRIX, result_matrix);
    result_way.push(0);
    let n = k-1, i = 0;
    while(n > 0 )
    {
      result_way.push(result_matrix[i][n]);
      i = result_matrix[i][n];
      n = n& ~(1 << (i-1));
    }

    let result_str = "<b>Результат:</b><br>";
    for (let i = 0; i < result_way.length; i++) 
      result_str += ` ${MAIN_DATA.CITY_INFO[result_way[i]].name}[${result_way[i]}]&#8594;`;
    result_str += ` ${MAIN_DATA.CITY_INFO[0].name}[0]`;
    RESULT_BOX.innerHTML = result_str;
  }
}

// ---------- functions
function bBuild()
{
  if(result_way.length != 0)
  {
    let m = result_way;
    draw(0,1);
    function draw(i, k)
    {
      if(k == m.length) k = 0;
      if(i == m.length) return;
      let buff_rout = L.Routing.control(
        {
          waypoints:  
          [
            L.latLng(MAIN_DATA.CITY_INFO[m[i]].lat, MAIN_DATA.CITY_INFO[m[i]].lng),
            L.latLng(MAIN_DATA.CITY_INFO[m[k]].lat, MAIN_DATA.CITY_INFO[m[k]].lng)
          ],
          lineOptions: 
          {
            
            styles: [{color: 'red', opacity: 1, weight: 5}]
          }, fitSelectedRoutes: false
        }).addTo(MAIN_MAP);
      buff_rout.on('routesfound',
      function()
      {
        // alert(`${m[i]}, ${m[k]}`);
        draw(i+1, k+1);
      });
    }
  }
}

// algoritm
function GetCycle(CityNum, DM, result_matrix) 
{
    l = 0;
    k = Math.pow(2, (CityNum - 1));
    let FirsCol =  [];
    for (let i = 0; i <= CityNum ; i++) FirsCol[i] = [];

    //initializing FirsCol[A][v1]
    for (let i = 1; i < CityNum; i++) FirsCol[i][0] = DM[i][0];

    //finding the shortest path excluding v1
    for (let i = 1; i <= CityNum - 2; i++) 
    {
        for (let subset = 1; subset < k; subset++) 
        {
            if (Сardinality(subset) == i) 
            {
                for (let v = 1; v < CityNum; v++) 
                {
                    if (!CheckPos(subset, v-1)) 
                    {
                        FirsCol[v][subset] = Min(v, DM, FirsCol, subset, CityNum);
                        result_matrix[v][subset] = l;
                    }
                }
            }
        }
    }
    Min(0, DM, FirsCol, k-1, CityNum);
    result_matrix[0][k-1] = l;
}

// finding the cardinality of a subset
function Сardinality(i)
{
    let count = 0;
    while (i != 0) 
    {
        i = i & (i - 1);
        count++;
    }
    return count;
}

//checking if Vi for some i belongs to a subset 
function CheckPos(subset, position) 
{
    let num = subset & ~(1 << (position));
    return (num & subset) != subset;
}

// finding the minimum of (DM[v][j]+D[j][subsrt - v] for every j
function Min(v, DM, FirsCol, set, CityNum) 
{
    let m = [];
    let i = [];
    let id = 0;

    for(let j = 0 ; j < CityNum-1 ; j++)
      if(CheckPos(set,j))
      {
          let num = set & ~(1 << (j));
          num = set & num;
          m[id] = DM[v][j+1]+FirsCol[j+1][num];
          i[id]=j+1;
          id++;
      }

    let min = m[0];
    l = i[0];

    for(let j = 1; j < Сardinality(set); j++)
      if(min > m[j])
      {
          min = m[j];
          l = i[j];
      }
                        
    return min;
}