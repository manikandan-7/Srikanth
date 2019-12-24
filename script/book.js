if (!localStorage.getItem('reservedSeats')){
    localStorage.setItem('reservedSeats',JSON.stringify({}));
}
else{
    var reservedSeats = JSON.parse(localStorage.getItem('reservedSeats'));
}
var place = JSON.parse(localStorage.getItem('locations'));
var busDetails = JSON.parse(localStorage.getItem('busDetails'));
var seats = new Array();
var selectedSeats= new Array();

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
    Array.from(new Set(start[document.getElementById('pickup').value])).forEach(element => {
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
        option.setAttribute('onclick','showTable()');
        option.appendChild(document.createTextNode(element[0]));
        document.getElementById('busNumber').appendChild(option);
        
    });
}
function showTable(){
    document.getElementById('table').remove();
    busDetails.forEach(element => {
        if (element[0] == document.getElementById('busNumber').value){
            let table = document.createElement('table');
            table.id = 'table';
            
           seats = [];
           selectedSeats = [];
            for (let i=0; i<=element[3]; i+=10){
                let tr = document.createElement('tr');
                for (let j=1; j<=10; j++){
                    let td = document.createElement('td');
                    if (reservedSeats[document.getElementById('busNumber').value] && reservedSeats[document.getElementById('busNumber').value].includes(String(i+j))){
                        // console.log(i+j, reservedSeats[document.getElementById('busNumber').value]);
                        td.className='table-cell-reserved';
                    }
                    else{
                        td.setAttribute('onclick','swap(this.id)');
                        td.className='table-cell';

                    }
                    td.id=i+j;
                    td.appendChild(document.createTextNode(i+j));
                    tr.appendChild(td);
                    seats.push(i+j);
                    if (j+i >= element[3]){
                        break;
                    }
                }
                table.appendChild(tr);
                
            }
            document.getElementById('test').appendChild(table);
        } 
        
    });

    // console.log(seats);

}

function swap(a){
    if (selectedSeats.includes(a)){
        selectedSeats.splice(selectedSeats.indexOf(a),1);
        document.getElementById(a).setAttribute('class','table-cell');

    }
    else{
        document.getElementById(a).setAttribute('class','table-cell-selected');
        selectedSeats.push(a);
        selectedSeats = Array.from(new Set(selectedSeats));
        // console.log(busNumber.value,selectedSeats);
    }
    
}

function showPreview(){
    while (document.getElementById('preview').hasChildNodes()){
        document.getElementById('preview').removeChild(document.getElementById('preview').firstChild);
    }
    var passengerName = document.getElementById('passenger-name').value;
    var pickup = document.getElementById('pickup').value;
    var pickupLocation = document.getElementById('pickup-location').value;
    var drop = document.getElementById('drop').value;
    var dropLocation = document.getElementById('drop-location').value;
    var busNumber = document.getElementById('busNumber').value;
    var output = document.createElement('div');
    var br = document.createElement('br');
    output.appendChild(document.createTextNode(passengerName));
    output.appendChild(br);
    output.appendChild(document.createTextNode(pickup));
    output.appendChild(br);
    output.appendChild(document.createTextNode(pickupLocation));
    output.appendChild(document.createTextNode(drop));
    output.appendChild(br);
    output.appendChild(document.createTextNode(dropLocation));
    output.appendChild(document.createTextNode(busNumber));
    output.appendChild(document.createTextNode(selectedSeats.length ))
    document.getElementById('preview').appendChild(output);

    var confirmButton = document.createElement('button');
    confirmButton.setAttribute('onclick','confirmBook()');
    confirmButton.appendChild(document.createTextNode('Confirm'));
    document.getElementById('preview').appendChild(confirmButton);
    


}
function confirmBook(){
    var reservedSeats = JSON.parse(localStorage.getItem('reservedSeats'));
    selectedSeats = selectedSeats.concat(reservedSeats[document.getElementById('busNumber').value]);
    reservedSeats[document.getElementById('busNumber').value] = selectedSeats;
    localStorage.setItem('reservedSeats',JSON.stringify(reservedSeats));
    alert('Booking Confirmed');
}

// end.forEach(element => {
//     console.log(element);
//     var option = document.createElement('option');
//     option.value = element;
//     option.id = element;
//     option.appendChild(document.createTextNode(element));
//     document.getElementById("drop").appendChild(option);
// });