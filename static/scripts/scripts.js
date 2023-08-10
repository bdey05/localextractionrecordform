var currentTab = 0; 
var extractantCount = 1;
showTab(currentTab); 

function showTab(n) {
    var x = document.getElementsByClassName("page");
    x[n].style.display = "block";
    if (n == 0) {
      document.getElementById("previous").style.display = "none";
    } else {
      document.getElementById("previous").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      document.getElementById("next").innerHTML = "Submit";
      document.getElementById("next").type = "submit";
      document.getElementById("extractionrecord").addEventListener("submit", handleSubmit);
    } else {
      document.getElementById("next").innerHTML = "Next";
      document.getElementById("next").type = "button";
      document.getElementById("extractionrecord").removeEventListener("submit", handleSubmit);
    }
}

function nextPrev(n) {
    
    var x = document.getElementsByClassName("page");
    if (n == 1 && !validateForm()) return false;
    x[currentTab].style.display = "none";
    currentTab = currentTab + n;
    
    if (currentTab >= x.length) {
      //document.getElementById("extractionrecord").submit();
      document.getElementById("previous").style.display = "none";
      document.getElementById("next").style.display = "none";
      return false;
    }
    
    showTab(currentTab);
    
  }


  function validateForm() {
   
    var x, y, i, valid = true;
    x = document.getElementsByClassName("page");
    y = x[currentTab].getElementsByTagName("input");
    
    for (i = 0; i < y.length; i++) {
      if (y[i].value == "") {
        y[i].className += " invalid";
        valid = false;
      }
      else {
        y[i].classList.remove("invalid");
      }
    }
    return valid; 
  }

  function handleSubmit(e)
  {
    e.preventDefault();
    document.getElementById("formoutput").style.display = "block";
    let JSONOutput = {
      'extractants': []
    };
    //Array.from(document.getElementById.getElementsByClassName("inputgroup"));
    //console.log(Array.from(document.getElementById('extractants').getElementsByClassName("inputgroup")))
    Array.from(document.getElementById('extractants').getElementsByClassName("inputgroup")).forEach((e) => {
      //console.log(e.getElementsByClassName("unitdropdown")[0].value);
      let extractant = {
        'identity': e.getElementsByClassName("input1")[0].getElementsByTagName('input')[0].value,
        'quantity': e.getElementsByClassName("input2")[0].getElementsByTagName('input')[0].value,
        'unit': e.getElementsByClassName("unitdropdown")[0].value
      }
      //console.log(extractant);
      JSONOutput.extractants = JSONOutput.extractants.concat(extractant);
    })
    //console.log(JSONOutput);
    document.getElementById("formoutput").innerHTML = JSON.stringify(JSONOutput, null, 7);

    //In order to work on Spin, the localhost 5000 portion of the URL should be replaced with the flask application Ingress URL
    fetch('http://127.0.0.1:5000/insert/', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(JSONOutput)
    })
   .then(response => response.json())
   .then(response => console.log(JSON.stringify(response)))
  }

  function addItem(groupname) {
    let inputgroup = document.getElementById(groupname).getElementsByClassName("inputgroup")[0];
    extractantCount++;
    document.getElementById(groupname).getElementsByClassName("inputgroup")[0].getElementsByTagName('button')[0].classList.remove('disabledbtn');
    //let oldNum = Array.from(document.getElementById(groupname).querySelectorAll(".inputnum")).pop().innerHTML.slice(-1);
    let cln = inputgroup.cloneNode(true);
    //let newNum = Number(oldNum) + 1;
    cln.getElementsByClassName("inputnum")[0].innerHTML = 'Extractant ' + extractantCount;
    cln.getElementsByClassName("input1")[0].getElementsByTagName('input')[0].value = "";
    cln.getElementsByClassName("input2")[0].getElementsByTagName('input')[0].value = "";
    document.getElementById(groupname).getElementsByClassName("items")[0].append(cln);
    

  }

  function removeItem(groupname, event)
  {
    if (extractantCount == 1)
    {
      return;
    }
    event.target.parentNode.parentNode.parentNode.remove()
    //console.log(event.target.parentNode.parentNode.getElementsByClassName('inputnum')[0].innerHTML.slice(-1))
    //document.getElementById(groupname).getElementsByClassName("inputgroup")[0].getElementsByTagName('button')[0].classList.add('disabledbtn');
    console.log(document.getElementById(groupname).querySelectorAll('.inputnum'));
    for (let i = 1; i <= extractantCount - 1; i++)
    {
      //console.log(Array.from(document.getElementById(groupname).querySelectorAll('.inputnum'))[i-1].innerHTML) 
      Array.from(document.getElementById(groupname).querySelectorAll('.inputnum'))[i-1].innerHTML = 'Extractant ' + i;
    }
    extractantCount--;
    if (extractantCount == 1)
    {
      document.getElementById(groupname).getElementsByClassName("inputgroup")[0].getElementsByTagName('button')[0].classList.add('disabledbtn');
    }
  }