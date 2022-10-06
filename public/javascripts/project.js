$(document).ready(()=>{
    //fill states..--
    $.getJSON('http://localhost:3000/statecity/fetchallstates',(data)=>{
     // alert(data)
    //alert(JSON.stringify(data))
    if(data.status)
    {
        data.result.map((item)=>{
            $('#state').append($('<option>').text(item.statename).val(item.stateid))
        })
        $('#state').formSelect();
    }
    else
    {
        alert("server Error..")
    }
})

//fill cities aaccording to states--
$('#state').change(()=>{
   
    $.getJSON('http://localhost:3000/statecity/fetchallcities',{stateid:$('#state').val()},(data)=>{
        // alert(data)
       //alert(JSON.stringify(data))
       if(data.status)
       {
        $('#city').empty()//for clear city

        $('#city').append($('<option>').text("Choose your city"))
        
           data.result.map((item)=>{
               $('#city').append($('<option>').text(item.cityname).val(item.cityid))
           })
           $('#city').formSelect();
       }
       else
       {
           alert("server Error..")
       }
   })


})


})

