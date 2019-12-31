
async function getweather(){
    let response = await fetch('http://api.openweathermap.org/data/2.5/forecast?q=coimbatore,in&APPID='+apiKey());
    let a= await response.json();
    return a;
}
// if(!localStorage.getItem('weather')){
    getweather().then(data => getDetails(data));
// }
function startSearch(){
        async function getweather(){
            let city = document.getElementById('search').value;
            let response = await fetch('http://api.openweathermap.org/data/2.5/forecast?q='+city+'&APPID='+apiKey());
            let a= await response.json();
            return a;
    }

getweather().then(data => getDetails(data));
    // getDetails(JSON.parse(localStorage.getItem('weather')));
}
var temperaturec, temperaturef;
function getDetails(data){
    var x = document.getElementsByClassName('city')[0];
    x.removeChild(x.firstChild);
    x.appendChild(document.createTextNode(data.city.name+' '+ data.city.country));
    temperaturec = Math.round(data.list[1].main.temp-273.15);
    temperaturef = Math.round((data.list[1].main.temp - 273.15) * 9/5 + 32);
    var desc = data.list[1].weather[0].description;
    var x = document.getElementsByClassName('degree')[0];
    x.removeChild(x.firstChild);
    x.appendChild(document.createTextNode(temperaturec));
    var x = document.getElementsByClassName('dayType')[0];
    x.removeChild(x.firstChild);
    x.appendChild(document.createTextNode(desc));
    var Humidity= Math.round(data.list[1].main.humidity);
    var wind = Math.round(Number(data.list[1].wind.speed *2.237));

    x = document.getElementById('hum-span');
    while(x.hasChildNodes()){
        x.removeChild(x.firstChild);
}
    x.appendChild(document.createTextNode(Humidity));
    x = document.getElementById('win-span');
    while(x.hasChildNodes()){
        x.removeChild(x.firstChild);
}
    x.appendChild(document.createTextNode(wind));

    x= document.getElementById('hum-cir');
    var y = Humidity*2.64;
    x.setAttribute('stroke-dasharray',y+' '+(264-y));
    x= document.getElementById('win-cir');
    var y = wind*5.28;
    x.setAttribute('stroke-dasharray',y+' '+(264-y));

    [8,16,24,32,39].forEach((element,index) => {
        var temperature = Math.round(data.list[element].main.temp-273.15);
        var date = String(new Date(data.list[element].dt_txt)).slice(0,10);
        var desc = data.list[element].weather[0].description;
        var imgTag = document.createElement('img');
        var x = document.getElementsByClassName('day')[index];
        if (desc.toLowerCase().includes('clear')){
            source = 'res/sunny.svg';
            // img.style.filter="";
        }
        else if (desc.toLowerCase().includes('scattered')){
            source = 'res/sun.svg';
        }
        else if (desc.toLowerCase().includes('rain')){
            source = 'res/storm.svg';
        }
        else{
            source = 'res/cloud.svg';

        }
        while(x.hasChildNodes()){
            x.removeChild(x.firstChild)
        }
        var pTag = document.createElement('p');
        pTag.appendChild(document.createTextNode(date));
        imgTag.src=source;
        var h4Tag = document.createElement('h4');
        h4Tag.appendChild(document.createTextNode(temperature));
        var pTag1 = document.createElement('p')
        pTag1.appendChild(document.createTextNode(desc));
        document.getElementsByClassName('day')[index].appendChild(pTag);
        document.getElementsByClassName('day')[index].appendChild(imgTag);
        document.getElementsByClassName('day')[index].appendChild(h4Tag);
        document.getElementsByClassName('day')[index].appendChild(pTag1);
    });

    

}
function showC(){
    var x = document.getElementsByClassName('degree')[0];
    x.removeChild(x.firstChild);
   x.appendChild(document.createTextNode(temperaturec));
   document.getElementsByClassName('cel')[0].className += ' bold';
   document.getElementsByClassName('far')[0].className = 'far';

}
function showF(){
    var x = document.getElementsByClassName('degree')[0];
    x.removeChild(x.firstChild);
   x.appendChild(document.createTextNode(temperaturef));
   document.getElementsByClassName('far')[0].className += ' bold';
   document.getElementsByClassName('cel')[0].className = 'cel';

}

if(!localStorage.getItem('places')){
    var arr = [];
    async function getweather(){
        let response = await fetch('res/city.list.json');
        let a= await response.json();
        return a;
    }
    
    getweather().then(data => action(data));
function action(data){
    data.forEach(element =>{
        if (element.country.toLowerCase()=="in")

        arr.push(element.name+', '+element.country);
        

    })
    localStorage.setItem('places',JSON.stringify(arr));

}
}

    var places = JSON.parse(localStorage.getItem('places'));
places.forEach(element => {
    var li=document.createElement("div");
        li.appendChild(document.createTextNode(element));
        li.setAttribute('onclick','addToSearch(this.value)');
        li.value=element;
        document.getElementsByClassName("search-res")[0].appendChild(li);
});

document.getElementById('search').addEventListener("keyup",search);
function search(){
    document.getElementById("search-res").style.display="block";
    // var e = document.getElementsByClassName('search-res')[0];
    // while(e.hasChildNodes()){
    //     e.removeChild(e.firstChild);
    // }
    // var suggestions = places.filter((data)=>{
    //     return data.toLowerCase().includes(document.getElementById('search').value.toLowerCase());
    // })
    // suggestions.forEach(element => {
    //     var li = document.createElement('div');
    //     li.setAttribute('onclick','addToSearch(this.value)');
    //     li.value=element;
    //     li.appendChild(document.createTextNode(element));
    //     document.getElementsByClassName('search-res')[0].appendChild(li);
    // });
    // e.style.display = 'block'
    var input=document.getElementById("search").value.toLowerCase();
    var res=document.getElementsByClassName("search-res")[0];
    var s=res.getElementsByTagName("div");
    // s.forEach(element => {
    //     var textvalue=element.textContent||element.innerText;
    //     if(textvalue.toLowerCase().indexof(input)>-1){
    //         element.style.display="";
    //     }
    //     else{
    //         element.style.display="none"
    //     }
        
    // });
    
    for(var i=0;i<s.length;i++)
    {
        var a=s[i].textContent || s[i].innerText;
        if(a.toLowerCase().indexOf(input)>-1)
        {
            s[i].style.display="block";
        }
        else{
            s[i].style.display="none";
        }
    }

}
function addToSearch(a){
    document.getElementById('search').value=a;
    document.getElementsByClassName('search-res')[0].style.display='none';
}