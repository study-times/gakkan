    
    /**-----------------------------------
     * -------FireBaseのインストール--------*/
    firebase.initializeApp(firebaseConfig);
    var db=firebase.database();
    const auth = firebase.auth();
    
    var resettime;
    var rotate = localStorage.getItem('rotate');
            var check = document.getElementById('switch1').checked;
            var center = document.getElementById('center');
            var setting = document.getElementById('back');
            var resettime;
            const showTime = document.getElementById('time');
    //https://tcd-theme.com/2022/06/javascript-stopwatch.html


    var RDB_STATUS_TIME;// RDB用一時保存用記録時間
    var RDB_STATUS_RECORD;// RDB用最終更新時刻
    var RDB_STATUS_NOW;// RDB用現状表示
    var RDB_ARCHIVE_TIME;//RDBアーカイブ用記録時間
    
    var timer;              // setinterval, clearTimeoutで使用
    var startTime;          // 開始時間
    var elapsedTime = 0;    // 経過時間
    var holdTime;       // 一時停止用に時間を保持
    
    
    //**Firebaseのリセットを行ってからユーザーを取得 */
    var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
                //**認証が成功したら、index()を実行する */
                index();
        }else{
            location.href="./index.html";
        }
        // 登録解除
        unsubscribe();
      });

      
        /**-------------------------------
         * ----------FirebaseRDBから初期値を取得 */
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

            console.log(rotate)
            //**画面回転の可否を確認 */
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
                //**画面回転時スタート、ストップ動作 */
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
                //**スタート動作。カウントアップスタート、DB更新 */
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
                    //**最終の更新が今日であるかの確認を行い、最終更新が今日以前であった場合、タイマーをリセットする */
                    retimer();
                }
                holdTime = Number(udata.status.time)*1000;
                RDB_STATUS_NOW = new Date();
                RDB_STATUS_RECORD = new Date();
        db.ref('users/'+auth.currentUser.uid+'/status').update({
            "now":RDB_STATUS_NOW,
            "record":RDB_STATUS_RECORD
        });
        // 開始時間を現在の時刻に設定
        startTime = Date.now();
    
        // 時間計測
        displayTime();
    
            }
    
            
            function stop(){
                // タイマー停止
                clearInterval(timer);
            
                // 停止時間を保持
                holdTime += Date.now() - startTime;
        
                RDB_STATUS_TIME = Math.floor(holdTime/1000);
                RDB_ARCHIVE_TIME = holdTime/1000/60;
                //**ストップ動作。 カウントアップを停止し、DBに記録*/
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
                
      db.ref('users/'+auth.currentUser.uid+'/status').update({
        "now":"stop",
        "time": RDB_STATUS_TIME,
        "record":new Date()
    });
    var ago = new Date();
    ago.setHours(ago.getHours() -Number(resettime));
    var dt = new Date(ago);
    var y = dt.getFullYear();
  var m = ('00' + (dt.getMonth()+1)).slice(-2);
  var d = ('00' + dt.getDate()).slice(-2);
  var forma = y + '-' + m + '-' + d;
  if(forma=='NaN-aN-aN'){
  }else{
                //**DB記録 */
    db.ref('archive/'+forma+'/'+auth.currentUser.uid).update({
        "name":auth.currentUser.displayName,
        "time":RDB_ARCHIVE_TIME
    })
}
            }
    
    
    
    
    // カウントアップ
    function displayTime() {
        // タイマーを設定
        timer = setTimeout(function () {
            // 経過時間を設定し、画面へ表示
            elapsedTime = Date.now() - startTime + holdTime;
            showTime.textContent = new Date(elapsedTime).toISOString().slice(11, 19);
            // 関数を呼び出し、時間計測を継続する
            displayTime();
        }, 1000);
    }
    


    function format(dt){
        //**日付を定形にフォーマットする */
        var y = dt.getFullYear();
      var m = ('00' + (dt.getMonth()+1)).slice(-2);
      var d = ('00' + dt.getDate()).slice(-2);
      var format = y + '-' + m + '-' + d;
      return format
    }
    

    function retimer(){
        //**タイマーのリセット */
        elapsedTime = 0;
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
      if(day=='NaN-aN-aN'){
      }else{
    db.ref('archive/'+day+'/'+auth.currentUser.uid).update({
        "name":auth.currentUser.displayName,
        "time":minuite,
    });
}
    db.ref('users/'+auth.currentUser.uid+'/status').update({
      "now":"stop",
      "time": stopTime,
      "record":new Date()
  });
  db.ref('archive/'+week).remove();
  //**今日の日付に0を挿入することを追加する！！ */
    }
    
    function checkdate(){
        //**最終更新が今日であることの確認 */
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
    
    function comparison(){
        //**比較ページ読み込み */
            if(!udata.status.time){
                alert('一度スタートしてから押してください');
            }else{
                location.href="./comparison.html"
            }
    }