/* ABHINAV */


// alert("-- QUEUE Data Structure --\n\n 📂 Array Based Implementation\n 📂 Linear Queue\n 📂 Queue -> FIFO\n 📂 Initially Set the Capacity.\n\n Thank You 😊.");

var enqueue_btn = null;
var programa_ran = "";
var front = -1, rear = -1;
var capacity = 10;
var isCapSet = false;
var isEnqueueEnable = false;
var lastCapcity = 0;

const enqueue = () => {
    isEnqueueEnable = true;
    classSetter("enqueue");
    if(!isCapSet){
        document.getElementById("output").innerHTML = `
        <div class="output-enqueue-set-cap" style="font-size: 20px;"> You need to set the capacity before enqueue operation.</div>`;
    }

    else if(rear+1 >= capacity){
        document.getElementById("setcapbtn").disabled = false;
        document.getElementById("output").innerHTML = `
        <div class="output-enqueue-overflow"> Overflow! </div>
        
        <div class="output-secondary-details">
                <div> Front : ${front}</div>
                <div> Rear &nbsp;: ${rear}</div>
                <div> Capacity : ${isCapSet ? capacity : 0}</div>
                <br><br>
                <div> To Enqueue : Increase Capacity by Reset </div>
        </div>
        `; 
    }
    else {
        document.getElementById("output").innerHTML = `
                <div class="output-head-op">Enqueue</div>
                    <input type="text" id="data-input" placeholder="Enter Data...">
                    <button class="done" onclick="dataEnqueue()">Enqueue</button>
                    <div class="description"> Insertion from Rear <br><br> FIFO (First In First Out)</div>
        `;
    }
}

const dequeue = () => {
    classSetter("dequeue");
    if(!isCapSet){
        document.getElementById("output").innerHTML = `
        <div class="output-enqueue-set-cap" style="font-size: 20px;"> You need to set the capacity.</div>`;
    }
    else if((front > rear) || !isEnqueueEnable || front == -1){
        document.getElementById("output").innerHTML = `
        <div class="output-dequeue-overflow"> Underflow! </div>
        
        <div class="output-secondary-details">
                <div> Front : ${front}</div>
                <div> Rear &nbsp;: ${rear}</div>
                <div> Capacity : ${isCapSet ? capacity : 0}</div>
                <br><br>
                <div> To Dequeue : Enqueue More Data </div>
        </div>
        `;
    } 
    else {
        let d = document.getElementById(`data${front}`).innerText;
        document.getElementById(`data${front}`).style.backgroundColor = "#00000014";
        document.getElementById("output").innerHTML = `
        <div class="output-head-op">Dequeued <br>${d.slice(0, d.length-1)}</div>

        <div class="output-secondary-details">
                <div> Front : ${front}</div>
                <div> Rear &nbsp;: ${rear}</div>
                <div> Capacity : ${isCapSet ? capacity : 0}</div>
                <div> Front Moved to : ${front+1}</div>
                <br><br>
                <div class="description" style="margin-top:-10px">Deletion from Front <br><br> FIFO (First In First Out) </div>
        </div>
        `;
        document.getElementById(`data${front}`).innerHTML = `<span class="index">${front}</span>`;
        front++;
        document.getElementById("front-val").innerText = front;
    }
    
}

const peek = () => {
    classSetter("peek");
    if(front > rear || !isEnqueueEnable || !isCapSet || front == -1){
        document.getElementById("output").innerHTML = `
        <div class="output-dequeue-overflow"> Nothing to Peek! </div>
        
        <div class="output-secondary-details">
                <div> Front : ${front}</div>
                <div> Rear &nbsp;: ${rear}</div>
                <div> Capacity : ${isCapSet ? capacity : 0}</div>
        </div>
        `;
    } 
    else {
        let d = document.getElementById(`data${front}`).innerText;
        document.getElementById("output").innerHTML = `
        <div class="output-head-op">Peeked <br>${d.slice(0, d.length-1)}</div>

        <div class="output-secondary-details">
                <div> Front : ${front}</div>
                <div> Rear &nbsp;: ${rear}</div>
                <div> Capacity : ${isCapSet ? capacity : 0}</div>
                <div class="description" style="margin-top:50px">Getting the value of the front of the queue without removing it</div>
        </div>
        `;
    }
}

const isEmpty = () => {
    classSetter("isempty");
    if(front == -1){
        document.getElementById("output").innerHTML = `
        <div class="output-isfull-yes-no" style="color: #00b376;">Yes!</div>

        <div class="output-secondary-details">
            <div> Front : ${front}</div>
            <div> Rear &nbsp;: ${rear}</div>
            <div> Capacity : ${isCapSet ? capacity : 0}</div>
            <br><br>
        </div>
        `;
    }

    else {
        document.getElementById("output").innerHTML = `
        <div class="output-isfull-yes-no" style="color: #e00000;">No!</div>
    
        <div class="output-secondary-details">
            <div> Front : ${front}</div>
            <div> Rear &nbsp;: ${rear}</div>
            <div> Capacity : ${isCapSet ? capacity : 0}</div>
        </div>
        `;
    }
}

const isFull = () => {
    classSetter("isfull");
    
    if(rear+1 >= capacity){
            document.getElementById("output").innerHTML = `
            <div class="output-isfull-yes-no" style="color: #00b376;">Yes!</div>
    
            <div class="output-secondary-details">
                <div> Front : ${front}</div>
                <div> Rear &nbsp;: ${rear}</div>
                <div> Capacity : ${isCapSet ? capacity : 0}</div>
                <br><br>
            </div>
        `;
    }

    else {
        document.getElementById("output").innerHTML = `
        <div class="output-isfull-yes-no" style="color: #e00000;">No!</div>
    
        <div class="output-secondary-details">
            <div> Front : ${front}</div>
            <div> Rear &nbsp;: ${rear}</div>
            <div> Capacity : ${isCapSet ? capacity : 0}</div>
            <br><br>
            <div> To Full : Enqueue ${isCapSet ? capacity - (rear+1) : 0} elements </div>
        </div>
    `;
    }
}


const setCapacity = () => {
    capacity = parseInt(document.getElementById("capacity").value);
    if((Number.isNaN(capacity) || (capacity < rear+1) || capacity <= 0)){
        isCapSet = false;
        document.getElementById("capacity").style.border = "2px solid red";
    }
    else {
        isCapSet = true;
        lastCapcity = capacity;
        document.getElementById("capacity").style.border = "none";
        document.getElementById("capacity").disabled = true;
        document.getElementById("setcapbtn").style.backgroundColor = "#d6d6d6b3";
        document.getElementById("setcapbtn").innerText = "Reset";
        document.getElementById("setcapbtn").setAttribute("onclick", "resetCapacity()");
        if(isEnqueueEnable)
            enqueue();
    }
}

const resetCapacity = () => {
    isCapSet = false;
    if(!isCapSet){
        document.getElementById("output").innerHTML = `
        <div class="output-enqueue-set-cap" style="font-size: 20px;"> You need to set the capacity before enqueue operation.</div>`;
    }

    document.getElementById("capacity").disabled = false;
    document.getElementById("setcapbtn").innerText = "Set";
    document.getElementById("setcapbtn").style.backgroundColor = "#ff141452";
    document.getElementById("setcapbtn").setAttribute("onclick", "setCapacity()");
}

var input_data = "";
const dataEnqueue = () => {
    input_data = document.getElementById("data-input").value;
    
    if(input_data == ""){
        document.getElementById("data-input").style.border = "2px solid red";
    } 
    else if(rear+1 >= capacity){
        document.getElementById("setcapbtn").disabled = false;
        document.getElementById("output").innerHTML = `
        <div class="output-enqueue-overflow"> Overflow! </div>
        
        <div class="output-secondary-details">
                <div> Front : ${front}</div>
                <div> Rear &nbsp;: ${rear}</div>
                <div> Capacity : ${isCapSet ? capacity : 0}</div>
                <br><br>
                <div> To Enqueue : Increase Capacity by Reset </div>
        </div>
        `; 
    }
    else {  
        if(front == -1)
            front = 0;
        
        rear++;
        document.getElementById("data-input").style.border = "none";
        document.getElementById("front-val").innerText = front;
        document.getElementById("rear-val").innerText = rear;
        document.getElementById("data-input").value = "";
        let newNode = document.createElement("div");
        newNode.setAttribute("class", "data");
        newNode.setAttribute("id", `data${rear}`);
        newNode.appendChild(document.createTextNode(input_data));
        let indexNode = document.createElement("span");
        indexNode.setAttribute("class", "index");
        indexNode.appendChild(document.createTextNode(rear));
        newNode.appendChild(indexNode);
        document.getElementById("queue-cnt").appendChild(newNode);
    }
}

var selectedID = "";
const classSetter = (id) => {
    // selectedID
    if(programa_ran != ""){
        document.getElementById(programa_ran).setAttribute("class", "resize"); 
        document.getElementById(programa_ran).style.backgroundColor = "#ff141452";
    }
    
    programa_ran = id;
    document.getElementById(id).setAttribute("class", "expand");
    document.getElementById(id).style.backgroundColor = "#68f1c3db";

}

const clearQueue = () => {
    enqueue_btn = null;
    front = -1;
    rear = -1;
    capacity = 10;
    isCapSet = false;
    isEnqueueEnable = false;
    lastCapcity = 0;
    if(programa_ran != ""){
        document.getElementById(programa_ran).setAttribute("class", "resize"); 
        document.getElementById(programa_ran).style.backgroundColor = "#ff141452";
    }
    programa_ran = "";
    document.getElementById("queue-cnt").innerHTML = "";
    document.getElementById("capacity").value = "";
    document.getElementById("capacity").disabled = false;
    document.getElementById("setcapbtn").innerText = "Set";
    document.getElementById("setcapbtn").style.backgroundColor = "#ff141452";
    document.getElementById("setcapbtn").setAttribute("onclick", "setCapacity()");
    document.getElementById("setcapbtn").disabled = false;
    document.getElementById("front-val").innerText = "-1";
    document.getElementById("rear-val").innerText = "-1";
    document.getElementById("output").innerHTML = `<div class="output-enqueue-set-cap" style="font-size: 20px;"> You need to set the capacity before enqueue operation.</div>`;
}