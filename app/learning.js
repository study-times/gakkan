var firebaseConfig = {

    apiKey: "AIzaSyDZG5TL_cjWvPHl-Z50WYi5pavCeweShzo",
    authDomain: "gakusyuzikan-589f0.firebaseapp.com",
    databaseURL: "https://gakusyuzikan-589f0-default-rtdb.firebaseio.com",
    projectId: "gakusyuzikan-589f0",
    storageBucket: "gakusyuzikan-589f0.appspot.com",
    messagingSenderId: "882074972938"
    
    };
    // Initialize FireBase
    firebase.initializeApp(firebaseConfig);
    var db=firebase.database();
    const auth = firebase.auth();
    
    var resettime;

    setTimeout(() => {
        if(!auth.currentUser){
            setTimeout(() => {
                if(!auth.currentUser){
                location.href="./index.html";
             }else{
                index();
             }
        }, 500);
         }else{
            index();
         }
        }, 1000);


    function index(){
     document.getElementById("runArea").remove();
        db.ref('users/'+auth.currentUser.uid).on('value', function (obj) {
            if(!obj.val()){
                console.log("no obj")
                db.ref('users/'+auth.currentUser.uid).update({
        "name": auth.currentUser.displayName,
        "reset":4,
        "status":{
        "now":"stop",
        "time": 0,
        "record":new Date()
        }
       });
            }else{
        udata=obj.val();
        resettime=udata.reset;
    var currentTime = udata.status.time;
    const hour = Math.floor(currentTime/3600);
    const min = Math.floor((currentTime-3600*hour)/60);
    const sec = currentTime-3600*hour-min*60;
    const h = String(hour).padStart(2, '0');
    const m = String(min).padStart(2, '0');
    const s = String(sec).padStart(2, '0');
    time.textContent = `${h}:${m}:${s}`;
            }
    });
    }
    
            var rotate = localStorage.getItem('rotate');
            var check = document.getElementById('switch1').checked;
            var center = document.getElementById('center');
            var setting = document.getElementById('back');
            var resettime;
            


            console.log(rotate)
          if(rotate=="true"){
            document.getElementById('switch1').checked=true;
                center.style.cursor="not-allowed";
            }else if(!rotate){
                document.getElementById('switch1').checked=true;
                center.style.cursor="not-allowed";
            }else if(rotate=="false"){
                center.setAttribute('onclick','start()');
                center.style.cursor="pointer";
            }
    
            if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
                if(rotate=="true"){
                window.addEventListener("orientationchange", function() {
        var orientation = window.orientation;
        if (orientation === 0) {
            stop();
        } else {
            start();
      }
    });
}
      } else {
        center.setAttribute('onclick','start()');
        center.style.cursor="pointer";
        document.getElementById('tggle').style.display="none";
                document.getElementById('switch1').checked=false;
        localStorage.setItem('rotate','false');
      }
    
    
    
            function routate(){
            var check = document.getElementById('switch1').checked;
                if(check){
                    localStorage.setItem('rotate',"true");
                center.setAttribute('onclick','');
                center.style.cursor="not-allowed";
                }else{
                    localStorage.setItem('rotate',"false");
                center.setAttribute('onclick','start()');
                center.style.cursor="pointer";
                }
            }
    
            function start(){
            var check = document.getElementById('switch1').checked;
                document.body.style.backgroundColor='#Ffa07a';
                document.getElementById('status').innerText='学習中';
                document.getElementById('tggle').style.display="none";
                document.getElementById('changebutton').style.display="none";
                setting.style.display="none";
                if(!check){	
                    center.setAttribute('onclick','stop()');
                }
                
                if(!checkdate()){
                    retimer();
                }
                saimer();
            }
    
            
            function stop(){
            var check = document.getElementById('switch1').checked;
                document.body.style.backgroundColor="lightgreen";
                document.getElementById('status').innerText='休憩中';
                document.getElementById('changebutton').style.display="block";
                setting.style.display="block";
                if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
                document.getElementById('tggle').style.display="block";
      } else {
      }
                if(!check){
                    center.setAttribute('onclick','start()');
                }
                stimer();
            }
    
    
            const time = document.getElementById('time');
    //https://tcd-theme.com/2022/06/javascript-stopwatch.html
    // 開始時間
    let rtime;
    // 停止時間
    // タイムアウトID
    let timeoutID;
    
    // スタートボタンがクリックされたら時間を進める
    function saimer(){
        rtime = Number(udata.status.time);
        db.ref('users/'+auth.currentUser.uid+'/status').update({
            "time":rtime,
            "now":new Date(),
            "record":new Date()
        });
      displayTime();
    }
    
    // 時間を表示する関数
    function displayTime() {
      var currentTime = rtime;
      const hour = Math.floor(currentTime/3600);
      const min = Math.floor((currentTime-3600*hour)/60);
      const sec = currentTime-3600*hour-min*60;
      const h = String(hour).padStart(2, '0');
      const m = String(min).padStart(2, '0');
      const s = String(sec).padStart(2, '0');
      rtime=rtime+1;
      time.textContent = `${h}:${m}:${s}`;
      timeoutID = setTimeout(displayTime, 1000);
    }
    
    // ストップボタンがクリックされたら時間を止める
    function stimer(){
      clearTimeout(timeoutID);
      db.ref('users/'+auth.currentUser.uid+'/status').update({
        "now":"stop",
        "time": rtime,
        "record":new Date()
    });
    var ago = new Date();
    ago.setHours(ago.getHours() -Number(resettime));
    var dt = new Date(ago);
    var y = dt.getFullYear();
  var m = ('00' + (dt.getMonth()+1)).slice(-2);
  var d = ('00' + dt.getDate()).slice(-2);
  var format = y + '-' + m + '-' + d;
    db.ref('archive/'+format+'/'+auth.currentUser.uid).update({
        "name":auth.currentUser.displayName,
        "time":Number(rtime)/60
    })
    }


    function format(dt){
        var y = dt.getFullYear();
      var m = ('00' + (dt.getMonth()+1)).slice(-2);
      var d = ('00' + dt.getDate()).slice(-2);
      var format = y + '-' + m + '-' + d;
      return format
    }
    

    function retimer(){
      time.textContent = '00:00:00';
      stopTime = 0;
      var date = new Date(udata.status.record);
      var day = format(date);
      console.log(day);
      var weekago = new Date();
      weekago.setDate(weekago.getDate() - 7);
      var week = format(new Date(weekago));
      console.log(week);
      var minuite = Number(udata.status.time)/60;
    db.ref('archive/'+day+'/'+auth.currentUser.uid).update({
        "name":auth.currentUser.displayName,
        "time":minuite,
    });
    db.ref('users/'+auth.currentUser.uid+'/status').update({
      "now":"stop",
      "time": stopTime,
      "record":new Date()
  });
  db.ref('archive/'+week).remove();
    }
    
    function checkdate(){
        var recordDate = udata.status.record;
        var rec = new Date(recordDate);
    var ago = new Date();
    ago.setHours(ago.getHours() - Number(resettime));
    rec.setHours(rec.getHours() - Number(resettime));
    console.log("now time -"+resettime+" hour="+ago);
    console.log("recorded time -"+resettime+" hour="+rec);
    if(new Date(ago).getDate() == new Date(rec).getDate()){
        console.log('true');
        return true;
    }else{
        console.log('false');
        return false;
    }
    
    }