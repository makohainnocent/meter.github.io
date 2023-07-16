/*var apiUrl="http://localhost/meter/Api/"
var appUrl="http://localhost/meter/App/"*/

var apiUrl="http://meter.ueuo.com/meter/Api/"
var appUrl="http://meter.ueuo.com/meter/App/"


//register bin owners
function  RegisterMeter(){
  loading('saving...')
  const obj=MobileUI.objectByForm('MeterForm')
  console.log(obj)
  MobileUI.ajax.get(apiUrl+"RegisterMeter.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Success")!=-1){
        alert("your meter was registerd successfully")
      }else{
        alert(res.text)
      }
    }
  });
}




//Login
function  Login(){
  
  loading('processing...')
  const obj=MobileUI.objectByForm('LoginForm')
  console.log(obj)

  if(obj.meter_no=="admin"){
    //openPage('System',{'meter_no':obj.meter_no},LoadSystem)
    return
  }

  MobileUI.ajax.get(apiUrl+"Login.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{
        openPage('MeterOwner',{'meter_no':obj.meter_no},LoadMeterOwner)
      }
    }
  });
}





//initialise system page
function LoadSystem(params){
  GetAllBins()
  GetAllDrivers()
  GetALLTasks()
  var obj={"UserName":params.UserName}
  loading("wait..")
  MobileUI.ajax.get(apiUrl+"GetSystem.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{
        console.log(res.text)
        var res=JSON.parse(res.text)
        res=res[0]
        console.log(res)
        $('#username').text(res.UserName);
        $('#phone').text(res.Phone);
        $('#amount').text(Number(res.Amount));
        localStorage.setItem("UserName",res.UserName)
        localStorage.setItem("Phone",res.Phone)
        localStorage.setItem("Amount",Number(res.Amount))
        //ShowAllBinsInSystem(res.text)
      }
    }
  });
}


//initialise meterOwner page
function LoadMeterOwner(params){
  var obj={"meter_no":params.meter_no}
  loading("wait..")
  MobileUI.ajax.get(apiUrl+"GetMeter.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{
        console.log(res.text)
        var res=JSON.parse(res.text)
        res=res[0]
        console.log(res)
        $('#meter_number').text(res.meter_no);
        $('#meter_owner').text(res.meter_owner);
        $('#meter_reading').text(Number(res.meter_reading));
        $('#amount_of_money_paid').text(Number(res.amount_of_money_paid));
        $('#amount_of_water_used').text(Number(res.amount_of_water_used));
        localStorage.setItem("meter_no",res.meter_no)
        //ShowAllBinsInSystem(res.text)
      }
    }
  });
}



//get all bins data
function GetAllMyBins(params){
  loading('processing...')
  const obj={"UserName":params.UserName}
  MobileUI.ajax.get(apiUrl+"GetMyBins.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{
        ShowAllBinsInSystem(res.text)
      }
    }
  });
}


//get all tasks data
function GetAllMyTasks(params){
  loading('processing...')
  const obj={"UserName":params.UserName}
  MobileUI.ajax.get(apiUrl+"GetMyTasks.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{
        ShowAllTasksInSystem(res.text)
      }
    }
  });
}

//get all drivers data
function GetAllDrivers(){
  loading('processing...')
  
  MobileUI.ajax.get(apiUrl+"GetDrivers.php")
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{

        // Update an item in localStorage
        localStorage.setItem('Drivers',JSON.stringify(res.text));

        ShowAllDriversInSystem(res.text)
      }
    }
  });
}

//get all Tasks data
function GetALLTasks(){
  loading('processing...')
  
  MobileUI.ajax.get(apiUrl+"GetTasks.php")
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{
        console.log(res.text)
        ShowAllTasksInSystem(res.text)
      }
    }
  });
}


function ShowAllBinsInSystem(data){
  var parentElement=document.getElementById("BinsArea")
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
  var data=JSON.parse(data)
  console.log(data)
  data.forEach(item => {
    template=document.getElementById("BinsTemplate").innerHTML
    template=template.replace("#name",item.UserName)
    template=template.replace("#phone",item.Phone)
    template=template.replace("#address",item.Address)
    var parcent=Math.ceil(((Number(item.currentFill))/(Number(item.maxFill)))*100)+"%"
    template=template.replace("#parcent",parcent)
    if(Number(item.Paid)>1){
      template=template.replace("#paid",'<i class="icon ion-card"></i>')
    }else{
      template=template.replace("#paid",'')
    }
    template=template.replace("#menu","Bin"+item.BinId)
    template=template.replace("#menu","Bin"+item.BinId)
    template=template.replaceAll("#bin",(JSON.stringify(item)).replaceAll('"',"'"))
    $("#BinsArea").append(template)
  });
 
  
}



function ShowAllDriversInSystem(data){
  var parentElement=document.getElementById("DriversArea")
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
  var data=JSON.parse(data)
  console.log(data)
  data.forEach(item => {
    template=document.getElementById("DriversTemplate").innerHTML
    template=template.replace("#name",item.UserName)
    template=template.replace("#phone",item.Phone)
    template=template.replace("#id",item.DriverId)
    template=template.replaceAll("#driver",(JSON.stringify(item)).replaceAll('"',"'"))
    $("#DriversArea").append(template)
  });
}

function ShowAllTasksInSystem(data){
  var parentElement=document.getElementById("TasksArea")
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
  var data=JSON.parse(data)
  console.log(data)
  data.forEach(item => {
    template=document.getElementById("TasksTemplate").innerHTML
    template=template.replace("#name",item.DriverUserName)
    template=template.replace("#name",item.OwnerUserName)
    template=template.replace("#description",item.Description)
    template=template.replace("#phone",item.OwnerPhone)
    template=template.replaceAll("#task",(JSON.stringify(item)).replaceAll('"',"'"))
    $("#TasksArea").append(template)
  });
}


function deleteBin(params){
  console.log(params)
  console.log(params.Address)
  alert({
    title:'Delete Bin',
    message:'Are you sure !',
    buttons:[
      {
        label: 'OK',
        onclick: function(){
          yesDeleteBin(params.BinId)
          closeAlert();
        }
      },
      {
        label:'Cancel',
        onclick: function(){
          closeAlert();
        }
      }
    ]
  });
}


function deleteDriver(params){
  console.log(params)
  alert({
    title:'Delete Driver',
    message:'Are you sure !',
    buttons:[
      {
        label: 'OK',
        onclick: function(){
          yesDeleteDriver(params.DriverId)
          closeAlert();
        }
      },
      {
        label:'Cancel',
        onclick: function(){
          closeAlert();
        }
      }
    ]
  });
}

function deleteTask(params){
  console.log(params)
  alert({
    title:'Delete Task',
    message:'Are you sure !',
    buttons:[
      {
        label: 'OK',
        onclick: function(){
          yesDeleteTask(params.TaskId)
          closeAlert();
        }
      },
      {
        label:'Cancel',
        onclick: function(){
          closeAlert();
        }
      }
    ]
  });
}

function doneTask(params){
  console.log(params)
  alert({
    title:'Task completed',
    message:'Are you sure !',
    buttons:[
      {
        label: 'OK',
        onclick: function(){
          yesDoneTask(params.TaskId)
          closeAlert();
        }
      },
      {
        label:'Cancel',
        onclick: function(){
          closeAlert();
        }
      }
    ]
  });
}

function yesDeleteBin(BinId){
  loading('processing...')
  
  const obj={"BinId":BinId}
  console.log(obj)
  MobileUI.ajax.get(apiUrl+"DeleteBin.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{
        alert(res.text)
      }
    }
  });

  GetAllBins()
}




function yesDeleteDriver(DriverId){
  loading('processing...')
  
  const obj={"DriverId":DriverId}
  console.log(obj)
  MobileUI.ajax.get(apiUrl+"DeleteDriver.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{
        alert(res.text)
      }
    }
  });

  GetAllDrivers()
}

function yesDeleteTask(TaskId){
  loading('processing...')
  
  const obj={"TaskId":TaskId}
  console.log(obj)
  MobileUI.ajax.get(apiUrl+"DeleteTask.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{
        alert(res.text)
      }
    }
  });

  GetALLTasks()
}

function yesDoneTask(TaskId){
  loading('processing...')
  
  const obj={"TaskId":TaskId}
  console.log(obj)
  MobileUI.ajax.get(apiUrl+"DeleteTask.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{
        alert(res.text)
      }
    }
  });
}




function yesEmptyBin(params){
  openPage("RegisterTask",params,LoadTaskForm)
}


function LoadTaskForm(params){
  console.log(params)
  $('#BinId').val(params.BinId)
  GetAllDrivers()
  setTimeout(function(){
    console.log(localStorage.getItem('Drivers'))
    drivers=eval(JSON.parse(localStorage.getItem('Drivers')))
    console.log(drivers)
    // Get the <select> element
    const driverSelect = document.getElementById('driverSelect');

    // Populate the <select> options
    drivers.forEach(driver => {
        const option = document.createElement('option');
        option.value = driver.DriverId;
        option.text = driver.UserName;
        driverSelect.appendChild(option);
    });
  },7000)

  

}

function emptyBin(params){
  if (Number(params.Paid)<1){
    alert({
      title:'This bin is Unpaid',
      message:'Are you sure to continue!',
      buttons:[
        {
          label: 'OK',
          onclick: function(){
            closeAlert();
            yesEmptyBin(params)
          }
        },
        {
          label:'Cancel',
          onclick: function(){
            closeAlert();
          }
        }
      ]
    });
  }else{
    yesEmptyBin(params)
  }
}

function loadCashout(){
  var balance=localStorage.getItem("Amount")
  console.log(balance)
  $("#Balance").val(balance)
}

function loadDeposit(){
  var meter_no=localStorage.getItem("meter_no")
  console.log(meter_no)
  $("#meter_no").val(meter_no)
}

function Withdraw(){
  var Balance=Number(localStorage.getItem("Amount"))
  var UserName=localStorage.getItem("UserName")
  var Amount=Number($("#Amount").val())
  var Phone=$("#Phone").val()

  if(Balance<Amount){
    alert("your balance is low")
    return
  }

  if(Amount<500){
    alert("transactions should be above 500")
    return
  }

  loading('processing...')
  
  const obj={"Amount":Amount,"Phone":Phone}
  console.log(obj)
  MobileUI.ajax.get(apiUrl+"Cashout.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Success")!=-1){
        subAmount({"UserName":UserName,"Amount":Amount})
        
      }else{
        
        alert(res.text)
        

      }
    }
  });

}


function Deposit(){
  var amount_of_money_paid=Number($("#amount_of_money_paid2").val())
  var meter_no=Number($("#meter_no2").val())
  var phone=$("#phone").val()
  
  if(amount_of_money_paid<500){
    alert("transactions should be above 500")
    return
  }

  loading('processing...')
  
  const obj={"amount_of_money_paid":amount_of_money_paid,"phone":phone}
  console.log(obj)
  MobileUI.ajax.get(apiUrl+"Deposit.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Success")!=-1){
        addAmount({"meter_no":meter_no,"amount_of_money_paid":amount_of_money_paid})
        
      }else{
        
        alert(res.text)
        

      }
    }
  });

}




function subAmount(params){
  loading('processing...')
  const obj={"Amount":params.Amount,"UserName":params.UserName}
  console.log(obj)
  MobileUI.ajax.get(apiUrl+"SubAmountSystem.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{
        alert(res.text)
      }
    }
  });
}


function addAmount(params){
  loading('processing...')
  const obj={"amount_of_money_paid":params.amount_of_money_paid,"meter_no":params.meter_no}
  console.log(obj)
  MobileUI.ajax.get(apiUrl+"AddAmountMeter.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Error")!=-1){
        alert(res.text)
      }else{
        alert(res.text)
      }
    }
  });
}


function RegisterBin(){
  alert({
    title:'Important!',
    message:`make sure your near the bin,
     and that location is enabled on your device
    `,
    buttons:[
      {
        label: 'Continue',
        onclick: function(){
          RegisterBinYes()
          closeAlert();
        }
      },
      {
        label:'Cancel',
        onclick: function(){
          closeAlert();
        }
      }
    ]
  });
}


function RegisterBinYes(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
  
        var locationString = latitude + ',' + longitude;
        console.log('Location: ' + locationString);
        localStorage.setItem("Location",locationString)
        openPage("RegisterBin",{},loadRegisterBin)
      },
      function(error) {
        console.error('Error getting location:', error);
      }
    );
  } else {
    console.error('Geolocation is not supported by this device.');
  }
  
}


function loadRegisterBin(){
  var Location=localStorage.getItem("Location")
  $("#Location").val(Location)
}

function RegisterBinFinish(){
  var Location=localStorage.getItem("Location")
  var BinOwnerId=localStorage.getItem("BinOwnerId")
  var maxFill=$("#maxFill").val()
  const obj={"Location":Location,"maxFill":maxFill,"BinOwnerId":BinOwnerId}
  console.log(obj)
  loading('saving...')
  MobileUI.ajax.get(apiUrl+"RegisterBin.php")
  .query(obj)
  .end((err, res) => {
    closeLoading()
    if (err) {
      console.error(err);
      alert("an error occurred! please try again later")
    } else {
      console.log(res.text);
      if(res.text.indexOf("Success")!=-1){
        alert("Bin was registered successfully!")
      }else{
        alert(res.text)
      }
    }
  });
}


function directionTask(params){
  openPage("direction",params,loadDirection)
}


function loadDirection(params){
  getCurrentLocation(initMap);
  localStorage.setItem("binLocation",params.BinLocation)
}



function initMap(driverLocation) {
  var A=(localStorage.getItem("binLocation"))
  var binLocation=A
  var B=(driverLocation)

  var C=A.split(",")
  binlat=parseFloat(C[0])
  binlong=parseFloat(C[1])

  var D=B.split(",")
  driverlat=parseFloat(D[0])
  driverlong=parseFloat(D[1])


  console.log(binLocation)
  console.log(driverLocation)
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  //var driverLocation = new google.maps.LatLng(driverLocation);
  //var binLocation = new google.maps.LatLng(binLocation);

  var driverLocation = {lat:driverlat,lng:driverlong};
  var binLocation = {lat:binlat,lng:binlong};
  
  var mapOptions = {
    zoom: 14,
    mapTypeId: 'roadmap',
    center: {lat:driverlat,lng:driverlong }
  }
  var map = new google.maps.Map(document.getElementById('MapArea'), mapOptions);
  directionsRenderer.setMap(map);
  calcRoute(directionsService,directionsRenderer,driverLocation,binLocation)
}


function calcRoute(directionsService,directionsRenderer,driverLocation,binLocation) {
  var selectedMode = "DRIVING";
  var request = {
      origin: driverLocation,
      destination: binLocation,
      // Note that JavaScript allows us to access the constant
      // using square brackets and a string value as its
      // "property."
      travelMode: google.maps.TravelMode[selectedMode]
  };
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(response);
      var steps=response.routes[0].legs[0].steps
      console.log(steps)
      steps.forEach(function(step) {
        $("#DirectionArea").append("<div class='space'></div>"+step.instructions)
      });

    }
  });
}


function getCurrentLocation(callBack){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
  
        var locationString = latitude + ',' + longitude;
        console.log('Location: ' + locationString);
        localStorage.setItem("Location",locationString)
        callBack(locationString)
      },
      function(error) {
        console.error('Error getting location:', error);
        openToast("error getting location")
        callBack(0,0)
      }
    );
  } else {
    openToast('Geolocation is not supported by this device.');
    callBack(0,0)
  }
}


function loadReading(){
  draggableDiv = document.getElementById('myDiv');
  // Start the camera when the page loads

  videoElement = document.getElementById('videoElement');

  // Event listeners for touch events
  draggableDiv.addEventListener('touchstart', startDrag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', endDrag);

  startCamera();
}




// Get the draggable div element
var draggableDiv;

// Video element for camera stream
var videoElement;

// MediaStream object for camera
var mediaStream;

var isDragging;
// Function to start the camera
async function startCamera() {
  try {
    // Request permission to access the camera
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    // Set the media stream as the source of the video element
    videoElement.srcObject = stream;

    // Store the media stream for later use
    mediaStream = stream;
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
}

// Function to stop the camera
function stopCamera() {
  // Stop the media stream tracks
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null; // Clear the video element source
  }
}

// Function to capture an image from the video stream
// Function to capture an image from the video stream
function captureImage() {
  // Create a canvas element with the same dimensions as the video
  var canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  var ctx = canvas.getContext('2d');

  // Draw the video frame onto the canvas
  ctx.drawImage(
    videoElement,
    0, 0, canvas.width, canvas.height
  );

  // Calculate the dimensions and position of the draggable div
  var videoRect = videoElement.getBoundingClientRect();
  var draggableRect = draggableDiv.getBoundingClientRect();
  var rectX = draggableRect.left - videoRect.left;
  var rectY = draggableRect.top - videoRect.top;
  var rectWidth = draggableRect.width;
  var rectHeight = draggableRect.height;

  // Create a new canvas element with the dimensions of the draggable div
  var croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = rectWidth;
  croppedCanvas.height = rectHeight;
  var croppedCtx = croppedCanvas.getContext('2d');

  // Draw the cropped portion from the video canvas onto the new canvas
  croppedCtx.drawImage(
    canvas,
    rectX, rectY, rectWidth, rectHeight,
    0, 0, rectWidth, rectHeight
  );

  // Get the captured image data URL
  var capturedImageData = croppedCanvas.toDataURL();

  // Set the captured image as the source of the captured image element
  var capturedImage = document.getElementById('capturedImage');
  capturedImage.src = capturedImageData;
}


// Function to capture an image from the video stream
function captureImage() {
  // Create a canvas element with the same dimensions as the video
  var canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  var ctx = canvas.getContext('2d');

  // Draw the video frame onto the canvas
  ctx.drawImage(
    videoElement,
    0, 0, canvas.width, canvas.height
  );

  // Calculate the dimensions and position of the draggable div
  var videoRect = videoElement.getBoundingClientRect();
  var draggableRect = draggableDiv.getBoundingClientRect();
  var rectX = draggableRect.left - videoRect.left;
  var rectY = draggableRect.top - videoRect.top;
  var rectWidth = draggableRect.width;
  var rectHeight = draggableRect.height;

  // Calculate the scaling factor for the canvas based on video size
  var scaleX = videoElement.videoWidth / videoRect.width;
  var scaleY = videoElement.videoHeight / videoRect.height;

  // Calculate the position and dimensions of the cropped region on the canvas
  var cropX = rectX * scaleX;
  var cropY = rectY * scaleY;
  var cropWidth = rectWidth * scaleX;
  var cropHeight = rectHeight * scaleY;

  // Create a new canvas element with the dimensions of the draggable div
  var croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = cropWidth;
  croppedCanvas.height = cropHeight;
  var croppedCtx = croppedCanvas.getContext('2d');

  // Draw the cropped portion from the video canvas onto the new canvas
  croppedCtx.drawImage(
    canvas,
    cropX, cropY, cropWidth, cropHeight,
    0, 0, cropWidth, cropHeight
  );

  // Get the captured image data URL
  var capturedImageData = croppedCanvas.toDataURL();

  // Set the captured image as the source of the captured image element
  var capturedImage = document.getElementById('capturedImage');
  capturedImage.src = capturedImageData;
}

 // Function to convert the captured image to grayscale
 function convertToGrayscale() {
  // Get the captured image element
  var capturedImage = document.getElementById('capturedImage');

  // Create a canvas element
  var canvas = document.createElement('canvas');
  canvas.width = capturedImage.width;
  canvas.height = capturedImage.height;
  var ctx = canvas.getContext('2d');

  // Draw the captured image on the canvas
  ctx.drawImage(capturedImage, 0, 0);

  // Get the pixel data from the canvas
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;

  // Loop through each pixel and convert it to grayscale
  for (var i = 0; i < data.length; i += 4) {
    // Get the RGB components of the pixel
    var r = data[i];
    var g = data[i + 1];
    var b = data[i + 2];

    // Calculate the grayscale value using the average method
    var gray = (r + g + b) / 3;

    // Set the RGB components of the pixel to the grayscale value
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  // Put the modified pixel data back to the canvas
  ctx.putImageData(imageData, 0, 0);

  // Set the converted grayscale image as the source of the captured image element
  capturedImage.src = canvas.toDataURL();
}

// Function to switch the camera facing mode
async function switchCamera(facingMode) {
  stopCamera();
  await startCamera();
  const videoTracks = mediaStream.getVideoTracks();
  const constraints = {
    video: { facingMode: { exact: facingMode } },
  };
  videoTracks[0].applyConstraints(constraints);
}

// Function to save the captured image on the server
function saveImage() {
  // Get the captured image data URL
  var capturedImageData = document.getElementById('capturedImage').src;

  // Create a new XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Configure the request
  xhr.open('POST', apiUrl+"save-image.php", true);

  // Set the content type header for sending image data
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Send the captured image data as the request body
  xhr.send('imageData=' + encodeURIComponent(capturedImageData));

  // Handle the response from the server
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log('Image saved successfully.');
        var response=xhr.responseText
        console.log(response)
        if(response.indexOf("Error")!=-1){
          alert("error failed to save image to server")
        }else{
          var imageUri=apiUrl+"img/"+response
          const apiKey = 'AIzaSyCDs368Jp-mAflfjdEQxm25-5QGeRFBrMQ';
          console.log(imageUri)
          performOCR(imageUri, apiKey)
        }
      } else {
        console.error('Failed to save the image.');
      }
    }
  };
}

// Function to handle the start of a drag
function startDrag(e) {
  isDragging = true;
  var touch = e.targetTouches[0];
  offsetX = touch.clientX - draggableDiv.offsetLeft;
  offsetY = touch.clientY - draggableDiv.offsetTop;
}

// Function to handle dragging
function drag(e) {
  if (!isDragging) return;
  e.preventDefault(); // Prevent scrolling on touch devices

  var touch = e.targetTouches[0];

  // Calculate the new position of the div
  var x = touch.clientX - offsetX;
  var y = touch.clientY - offsetY;

  // Update the position of the div
  draggableDiv.style.left = x + 'px';
  draggableDiv.style.top = y + 'px';
}

// Function to handle the end of a drag
function endDrag() {
  isDragging = false;
}




async function performOCR(imageUri, apiKey) {
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  const requestBody = {
    requests: [
      {
        image: {
          source: {
            imageUri: imageUri
          }
        },
        features: [
          {
            type: 'TEXT_DETECTION'
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data)
      const extractedText = data.responses[0].textAnnotations[0].description;
      console.log('Extracted Text:', extractedText);
      $("#meter_reading").val(extractedText)
    } else {
      throw new Error('Error performing OCR:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error performing OCR:', error);
  }
}



