var place = JSON.parse(localStorage.getItem('locations'));
var busDetails = JSON.parse(localStorage.getItem('busDetails'));

let start= JSON.parse(localStorage.getItem('startEnd'));
Object.keys(start).forEach(element => {
    var option = document.createElement('option');
    option.value = element;
    option.id = element;
    option.setAttribute('onclick','showDest()');
    option.appendChild(document.createTextNode(element));
    document.getElementById("pickup").appendChild(option);
});
function showDest(){
    var element = document.getElementById('drop');
    while (element.hasChildNodes()){
        element.removeChild(element.firstChild);
    }
    start[document.getElementById('pickup').value].forEach(element => {
        var option = document.createElement('option');
        option.value = element;
        option.id = element;
        option.setAttribute('onclick','showDest1()');
        option.appendChild(document.createTextNode(element));
        document.getElementById("drop").appendChild(option);

    });
    var element = document.getElementById('pickup-location');
    while (element.hasChildNodes()){
        element.removeChild(element.firstChild);
    }
    place[document.getElementById('pickup').value].forEach(element =>{
        var option = document.createElement('option');
        option.value=element;
        option.id = element;
        option.appendChild(document.createTextNode(element));
        document.getElementById('pickup-location').appendChild(option);
    });
   
}
function showDest1(){
    var element = document.getElementById('drop-location');
    while (element.hasChildNodes()){
        element.removeChild(element.firstChild);
    }
    place[document.getElementById('drop').value].forEach(element =>{
        var option = document.createElement('option');
        option.value=element;
        option.id = element;
        option.appendChild(document.createTextNode(element));
        document.getElementById('drop-location').appendChild(option);
    });
    var busNumber = busDetails.filter(function(a){
        if(document.getElementById('pickup').value == a[1] && document.getElementById('drop').value == a[2]){
            return a;
        }
    });
    var element = document.getElementById('busNumber');
    while (element.hasChildNodes()){
        element.removeChild(element.firstChild);
    }
    busNumber.forEach(element => {
        var option = document.createElement('option');
        option.value=element[0];
        option.id = element[0];
        option.appendChild(document.createTextNode(element[0]));
        document.getElementById('busNumber').appendChild(option);
        
    });
    busDetails.forEach(element => {
        if (element[0] == document.getElementById('busNumber').value){
            let table = document.createElement('table');
            
           
            for (let i=0; i<=element[3]; i+=10){
                let tr = document.createElement('tr');
                for (let j=1; j<=10; j++){
                    let td = document.createElement('td');
                    td.appendChild(document.createTextNode(i+j));
                    tr.appendChild(td);
                    if (j+i >= element[3]){
                        break;
                    }
                }
                table.appendChild(tr);
                
            }
            document.getElementById('test').appendChild(table);
        } 
        
    });


}

// end.forEach(element => {
//     console.log(element);
//     var option = document.createElement('option');
//     option.value = element;
//     option.id = element;
//     option.appendChild(document.createTextNode(element));
//     document.getElementById("drop").appendChild(option);
// });