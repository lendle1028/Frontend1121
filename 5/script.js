function topic(id, count){
    this.name = document.getElementById(id).innerText;
    this.content = document.getElementById(id).outerHTML;
    this.count = 0;
    this.address = this.content.split('"')[1];
    this.addclick = function(){
        this.count+=1;
    }
}

var ranklist = []

function count_click(id){
    var name = document.getElementById(id).innerText
    var check = new Boolean(false); 
    for(var i =0; i < ranklist.length; i++){
        if(ranklist[i].name == name){
            ranklist[i].addclick();
            check = true;
            break;
        }
    }
    if(check == false){
        var newobject = new topic(id,1);
        ranklist.push(newobject);
    }
    ranklist.sort(function (a, b){
        return b.count - a.count 
    })
    document.getElementById("top").innerHTML = ranklist[0].content;
    document.getElementById("second").innerHTML = ranklist[1].content;
    document.getElementById("third").innerHTML = ranklist[2].content;
}

function rendom_recommend(){
    let result = ranklist[Math.floor(Math.random()*ranklist.length)]
    if(confirm("為你推薦:\n"+result.name)){
        window.open(result.address);
    }
}