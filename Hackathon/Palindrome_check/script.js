var checkButton = document.getElementById("button");

function palindrome(str) {
  var regex = /[\W_]/g; 
 
  var myString = str.replace(regex, "").toLowerCase();
  var reverseString = myString.split("").reverse().join("");

return  myString === reverseString;

}

checkButton.addEventListener("click", function(){
  var myInput = document.getElementById("textend").value;
  
  var notification = document.getElementById("notification");
  
  if(palindrome(myInput)){
    notification.innerHTML = "Yes this is a palindrome!";
    notification.className ="alert alert-success";
    notification.style.background= "green";
     }else {
    notification.innerHTML = "No this is not a palindrome!";
    notification.className ="alert alert-danger";
    notification.style.background="red";
     }
});

//palindrome(str);