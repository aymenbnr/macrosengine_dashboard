function DashFormatter(str){

    var newstring = "";
    var counter = 0;
  
    for (var i = 0; i < str.length; i++) {
    newstring += str.charAt(i);
    counter += 1;
        if(counter == 4)
        {
            newstring += '-';
            counter = 0;
        }
    }
    //console.log(newstring.substring(0, newstring.length - 2));
    return newstring.substring(0, newstring.length - 2);
}


module.exports = {DashFormatter};