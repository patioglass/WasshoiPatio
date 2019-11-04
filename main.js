var canvas;
var context;
var img;
var img_src;
var fire;
var timer_start = false;
var main_timer = null;
var prevtime;
var time; // 経過時間
var x,y;     //画像座標
var vx,vy;  //移動速度
var image_width;// 画像サイズ
var image_height;
var ga = 0
var max_vx = 400; //vxの最大
var min_vx = -400;//vxの最少
var count = 0;
var flag = false;
var fire_height;

function wasshoi(){
    count++;
    
    if((count+1)%16==0){
        fire_height -=canvas.height/10;
    }
}
$(function(){
    
    function initialize() {
        $(".wrapper").fadeOut("slow");
        $(".game_show").fadeIn();
        canvas = document.getElementById("canvas");
        if (!canvas || !canvas.getContext) {
            alert("error:no canvas");
            return false;
        }
        canvas.width = 600;
        canvas.height = window.innerHeight;
        $(".wasshoi").css({
            "margin-top": canvas.height/7
        });
        context = canvas.getContext("2d");
        img = new Image();
        img.src = img_src;
        image_width = canvas.height/8;
        image_height = canvas.height/8;

        fire = new Image();
        fire_height = canvas.height/5*4;
        fire.src = "./bou.jpg";
        img.onload = reset();
    }

    function reset(){
        if( timer_start == true ){
            clearInterval(main_timer);
            timer_start = false;
        }

        //canvas クリア
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 初期位置
        x = canvas.width/2 - image_width/2;
        y = canvas.height/2 - image_height/2 + canvas.height/5;

        prevtime = (new Date()).getTime();
        main_loop = setInterval(main_loop,30);
        timer_start = true;

        vx = 0;
        vy = 0;
    }



    //canvasをクリックしたときに実行
    function start() {
        vx = (Math.random()*((max_vx+1)-min_vx))+min_vx;
        vy = -1*(canvas.height);
        ga = 1000;

    }

    //メインループ。等間隔で実行
    function main_loop() {
        //前回実行時の時間差をミリ秒で取得
        ct = (new Date()).getTime();  
        dt = ct - prevtime;             

        //重力加速
        vy += ga*dt/1000;

        //経過時間から移動量を計算
        x += vx*dt/1000;                
        y += vy*dt/1000;

        // x座標がcanvas.widthのサイズを超えたら反転する
        if( x+image_width > canvas.width ){
            x = canvas.width-image_width;
            vx = -vx;
        }
        else if( x < 0 ){
            x = 0;
            vx = -vx;
        }

        //y座標がcanvas.heightのサイズを超えたら反転する
        if( y+image_height > canvas.height ){
            y = canvas.height-image_height;
            vy = -vy;
        }
        else if( y < 0 ){
            y = 0;
            vy = -vy
        }

        //画面クリア
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.drawImage(img, x,y,image_width,image_height );
        context.drawImage(fire,0,fire_height,600,canvas.height/5);
        prevtime = ct;
        
        if(fire_height < y && flag){
            $(".sound").get(0).play();
            $(".game_show").fadeOut("slow");
            $(".result").fadeIn();
            $("h2").append(count+"秒の間、"+viewModel.screen_name()+"をWasshoiした");
            $(".result_score").attr("href","http://twitter.com/intent/tweet?url=http://patioglass.github.io/WasshoiPatio&amp;text="+count+"秒の間、 @"+viewModel.screen_name()+"をWasshoiした&amp;hashtags=Wasshoiぱちお");
            flag = false;
        }
        judge();
        
    }


        function judge(){
            
            context.fillStyle = "black";
            context.font = "40px 'ＭＳ ゴシック'";
            context.textAlign = "left";
            context.fillText(count+"秒間Wasshoi中!",canvas.width/3,canvas.height/8,400);
            
            context.fillStyle = "blue";
            context.font = "30px 'ＭＳ ゴシック'";
            context.textAlign = "left";
            context.fillText("Wasshoi!",x,y,200);
            //クリック処理
            canvas.addEventListener("click",function(e){

                var can = e.target.getBoundingClientRect();
                mouseX = e.clientX - can.left;
                mouseY = e.clientY - can.top;

                if(x-50 < mouseX && mouseX < x+image_width+50){
                    if(y-50 < mouseY && mouseY < y+image_height+50){

                        $(".sound1").get(0).play();
                        start();
                        if(!flag && count==0){
                            flag = true;
                            time = setInterval('wasshoi()', 1000);
                        }
                    }
                }
            },false);
        }
        var ViewMoel =function(){
            this.screen_name = ko.observable("");
            this.update = function(){
                return this.screen_name();
            }
            this.clickFunction = function(){
                $(".clickButton").click(function(){
                    img_src =  "http://furyu.nazo.cc/twicon/"+viewModel.screen_name()+"/original";
            initialize();
                });    
            }
        }

        var viewModel = new ViewMoel();
        ko.applyBindings(viewModel);
    

});