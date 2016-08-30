$(document).ready(function() {

    $(window).resize(function() {
        $('.wrapper').height($(window).height() - $('.wrapper').offset().top);
        $('.wrapper').width($(window).width() - $('.wrapper').offset().left);
    });
    $(window).resize();

    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d");

    var $canvas = $("#canvas");
    var edit = false; // chế độ vẽ
    var view = false;　// chế độ view
    var cw = canvas.width = 3000;
    ch = canvas.height = 1000;
    // biến cho hàm vẽ
    var paint = false,
        currentPathIndex = 0,
        paths = [],
        texts = [];
    // biến cho hàm kéo thả, zoom
    var canvasOffset=$("#canvas").offset();
    var offsetX=canvasOffset.left,
        offsetY=canvasOffset.top,
        startX,startY,mouseX,mouseY,
        mouseDown=false;

    $("#clear").click(function(){
        clear();
    });
    function clear(){
        if(view) return;
        context.clearRect(0,0, canvas.width,canvas.height);
        $('input').remove();
        center();
    }
    // vẽ input trung tâm
    function center(){
        $(".wrapper").append(
            $('<input type="text" class="cen">').attr({
                placeholder: "Center idea",
                id: "nameCenter"
            }).css({
                position:'absolute',
                left: window.innerWidth/2,
                top: window.innerHeight/2
            })
        );
        // resize input
        $('.cen').keypress(function(e){
            if (e.which == 13) {
                var contents = $(this).val();
                var charlength = contents.length +10;
                var newwidth =  charlength*12;
                $(this).css({width:newwidth});
                $(this).blur();
            }

        });
    }
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    center();
    //draw lines , lấy dữ liệu trong database

    draw();
    //start function draw()...
    var preX;
    var preY;
    // var canvas;
    var context;
    var imageData;
    var paint;

    function draw() {
        var canvas = document.getElementById("canvas");
        context = canvas.getContext('2d');

        $canvas.mousedown(function(e){
            if(view) return;
            if(event.which == 1){
                preX = e.pageX - canvas.offsetLeft;
                preY = e.pageY - canvas.offsetTop;
                paint = true;
                imageData = context.getImageData(0,0,canvas.width,canvas.height);
            }
        });

        $canvas.mousemove(function(e){
            if(view) return;
            if(paint == true && event.which==1){
                var x = e.pageX - canvas.offsetLeft;
                var y = e.pageY - canvas.offsetTop;

                canvas.width = canvas.width;
                context.putImageData(imageData,0,0);

                paths[currentPathIndex] = [];
                paths[currentPathIndex].push({x:preX, y:preY});
                // console.log(currentPathIndex);
                // console.log(paths.length);
                // context.beginPath();
                context.moveTo(preX, preY);
                context.lineTo(x,y);
                context.stroke();
            }
        });

        $canvas.mouseup(function(e) {
            if(view) return;
            if(paint == true && event.which==1){

                var x = e.pageX - canvas.offsetLeft;
                var y = e.pageY - canvas.offsetTop;

                if (x != preX || y != preY) {
                    context.beginPath();
                    context.moveTo(preX,preY);
                    context.lineTo(x,y);

                    context.lineWidth = 5;
                    context.strokeStyle = 'blue';
                    context.stroke();
                    paths[currentPathIndex].push({x:x , y:y});
                    currentPathIndex += 1;

                    if (preX > x) {

                        $(".wrapper").append(
                            $('<input type="text" class="resize">').attr({
                                placeholder: "New idea",
                                id: x * x + y * y
                            }).css({
                                position:'absolute',
                                left: x -100,
                                top: y -30,
                                width: 100
                            })
                        );



                        context.beginPath();
                        context.moveTo(x+2,y);
                        context.lineTo(x - 102,y);
                        context.lineWidth = 5;
                        context.strokeStyle = 'blue';
                        context.stroke();
                        re = true;
                        resize2();
                    //
                    } else {
                        $(".wrapper").append(
                            $('<input type="text" class="resizeme">').attr({
                                placeholder: "New idea",
                                id: x * x + y * y
                            }).css({
                                position:'absolute',
                                left: x,
                                top: y -30,
                            })
                        );
                        context.beginPath();
                        context.moveTo(x-2,y);
                        context.lineTo(x + 100,y);

                        context.lineWidth = 5;
                        context.strokeStyle = 'blue';
                        context.stroke();
                        re = false;
                        resizeme();
                       
                    }
                }
            }
            paint = false;
            // resize input
            // enter();
            // resizeme();

        });
    }




    function resizeme(){

        $('.resizeme').keypress(function(e){
            if(e.which == 13) {

                    var contents = $(this).val();
                    var charlength = contents.length;
                    var newwidth =  charlength*9 +100;
                    console.log(contents);
                    $(this).css({
                        width:newwidth});
                    // fitsize(newwidth);
                    // callajax();
                    $(this).blur();
                    var k = $(this).position();

                    context.beginPath();
                    context.moveTo(k.left-2,k.top + 30);
                    context.lineTo(k.left + newwidth,k.top + 30);

                    context.lineWidth = 5;
                    context.strokeStyle = 'blue';
                    context.stroke();
            }
        });
    }
    
    


    function resize2() {
        var count = 1;
        $('.resize').keypress(function(e){
            var o = $(this).width() + 14;
            console.log(o);
            if(e.which == 13) {
                    var contents = $(this).val();
                    var charlength = contents.length;
                    var newwidth =  charlength*9 + 100;
                    var k = $(this).position();

                    console.log(newwidth);
                    $(this).css({
                        left: k.left + o - newwidth,
                        width:newwidth});
                    // fitsize(newwidth);
                    // callajax();
                    $(this).blur();

                    context.beginPath();
                    context.moveTo(k.left + o +2,k.top + 30);
                    context.lineTo(k.left + o - newwidth ,k.top + 30);

                    context.lineWidth = 5;
                    context.strokeStyle = 'blue';
                    context.stroke();
            }
        });
    }

    var re = false;

    var scale = 1.0;
    var scaleMultiplier = 0.8;
    var startDrag = {};
    var translatePos = {
        x: 0,
        y: 0
    };
    // chuyển chế độ view để zoom và kéo thả
    $('#view').click(function(){
        if(view) return;
        console.log(edit);
        var mousedown = false;

        view = true; // disable ham ve draw
        getText();
        // console.log(centerIdea);
        redraw(scale,translatePos); // hàm vẽ lại mindmap ko dùng kéo thả chuột
        //zoom in, zoom out
        $("#plus").click(function(){
            if(edit) return;
            scale /= scaleMultiplier;
            redraw(scale,translatePos);
            scale = 1;
        });
        // zoom out
        $("#minus").click(function(){
            if(edit) return;
            scale *= scaleMultiplier;
            redraw(scale,translatePos);
            scale = 1;
        });
        // sự kiện kéo thả
        canvas.addEventListener("mouseover", function(e){
            if(edit) return;
            mouseDown = false;

        });
        canvas.addEventListener("mousedown", function(e){
            if(edit) return;
            mouseDown = true;
            startDrag.x = e.clientX;
            startDrag.y = e.clientY;
            // console.log(e.clientX, e.clientY);
        });
        canvas.addEventListener("mousemove", function(e){
            if(edit) return;
            if(mouseDown){
                translatePos.x = e.clientX - startDrag.x;
                translatePos.y = e.clientY - startDrag.y;
                // console.log(e.clientX, e.clientY);
                redraw(scale,translatePos);
            }
        });
        canvas.addEventListener("mouseup", function(e){
            if(edit) return;
            mouseDown = false;

        });

        // khi chuột nằm trong canvas, mặc định mouseDown = false, để tránh việc giữ chuột rồi đưa ra ngoài canvas, đưa vào vẫn vẽ

        canvas.addEventListener("mouseout", function(e){
            if(edit) return;
            mouseDown = false;
        });
        // context.restore();
    });

    // lấy dữ liệu trong thẻ input
    var centerIdea;
    function getText(){
        centerIdea = $(".cen").val();
        // lay dữ liệu dạng text từ các nhánh
        for (var i = 0; i < paths.length; i++) {
            for (var j = 1; j < paths[i].length; j++){
                id = paths[i][j].x * paths[i][j].x + paths[i][j].y * paths[i][j].y;
                var text = document.getElementById(id).value;

                texts[i] = {"id" : id, "value" : text};
                // console.log(texts[i].value);
            }
        }

    }


    // hàm vẽ lại trên canvas ko dùng chuột để zoom và kéo thả　
    function redraw(scale,translatePos) {

        // xoa man hinh
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.save();
        // ve lai center idea
        $('input').remove();
        var length = centerIdea.length;
        //ve cac input text

        console.log(paths, texts);

        context.translate(translatePos.x,translatePos.y);
        context.scale(scale,scale);

        // hình tròn xanh để test
        context.beginPath();
        context.fillStyle = "green";
        context.arc(0,0,15,0,Math.PI * 2);
        context.strokeStyle = "green";
        context.lineWidth= 5;
        context.stroke();


        for (var i = 0; i < paths.length; i++) {
            for (var j = 1; j < paths[i].length; j++){

                // ve duong thang
                context.beginPath();
                context.moveTo(paths[i][0].x, paths[i][0].y);
                context.lineTo(paths[i][j].x, paths[i][j].y);
                context.lineWidth = 5;
                context.strokeStyle = 'blue';
                context.stroke();
                context.closePath();
            }
        }
        // Ve idea box
        for (var i = 0; i < paths.length; i++) {

            for (var j = 1; j < paths[i].length; j++){
                var lengthText = texts[i].value.length;
                var hor = parseInt(paths[i][j].x), ver = parseInt(paths[i][j].y);

                // console.log(lengthText);

                // ve text
                // console.log(texts[i]);
                if (paths[i][0].x> hor) {

                    if(parseInt(texts[i].id) == hor * hor + ver * ver){
                        context.beginPath();
                        context.moveTo(hor+2, ver);
                        context.lineTo(hor - lengthText*7 -102,ver);
                        context.lineWidth =5;
                        context.strokeStyle = 'blue';
                        context.stroke();

                        context.beginPath();
                        context.fillStyle = "red";
                        context.arc(hor-100-lengthText*7, ver, 5, 0, Math.PI * 2);
                        context.fill();
                        context.strokeStyle = 'red';
                        context.stroke();

                        context.beginPath();
                        context.rect(hor-90-lengthText*7,ver-35,lengthText*7+90, 30);
                        console.lineWidth = "3";
                        context.strokeStyle = "#2aabd2";
                        context.stroke();
                        context.fillStyle = "white";
                        context.fill();

                        context.font ='15px Arial';
                        context.fillStyle = "black";
                        context.fillText(texts[i].value,hor-48-lengthText*7,ver-15);

                        context.closePath();
                    }

                } else {
                    if(parseInt(texts[i].id) == hor * hor + ver * ver){
                        context.beginPath();
                        context.moveTo(hor-2, ver);
                        context.lineTo(hor + lengthText*7 +102,ver);
                        context.lineWidth = 5;
                        context.strokeStyle = 'blue';
                        context.stroke();

                        context.beginPath();
                        context.fillStyle = "red";
                        context.arc(hor+100 +lengthText*7, ver, 5, 0, Math.PI * 2);
                        context.fill();
                        context.strokeStyle = 'red';
                        context.stroke();

                        context.beginPath();
                        context.rect(hor,ver-35,lengthText*7+90, 30);
                        console.lineWidth = "3";
                        context.strokeStyle = "#2aabd2";
                        context.stroke();
                        context.fillStyle = "white";
                        context.fill();

                        context.beginPath();
                        context.font ='15px Arial';
                        context.fillStyle = "black";
                        context.fillText(texts[i].value,hor+47- lengthText*0.5,ver -15);
                        // console.log(texts[i].value);
                        context.closePath();
                    }
                }
            }
        }
        // ve center idea　length là độ dài ký tự
        context.beginPath();
        context.rect(window.innerWidth/2 - offsetX , window.innerHeight/2 - offsetY,length*15+150,50);
        context.lineWidth ="5";
        context.strokeStyle = "orange";
        context.stroke();
        context.fillStyle = "white";
        context.fill();
        context.font = '500 30px Arial';
        context.fillStyle = "black";
        context.fillText(centerIdea, window.innerWidth/2 + 75 - length*0.5, window.innerHeight/2 + 32);
        context.closePath();

        // sau khi dùng translate, toạ độ gốc canvas bị thay đổi nhưng toạ độ của chuột ko thay đổi vì toạ độ chuột mặc định theo window éo liên quan đến canvas
        // context.translate(window.innerWidth/2,window.innerHeight/2);
        // context.fillText("The deo nao",0,0);
        resizeme();
    }
    // lưu vào mongoDb lưu lines,
    $('#save').click(function(){
        drop();
        if(view) return;
        getText();
        if(centerIdea==''){
            var MMname= prompt(" Please save your mindmap's name: ", "mindmap1");
            if(!MMname || MMname=== ''){
                MMname = "mindmap1";
            }
            centerIdea = MMname;
            $(".cen").val(centerIdea);
        }
        if (!paths[0]==[] || !centerIdea==''){
            // console.log(texts);
            console.log(paths);
            console.log(texts);
            $.ajax({
                url: 'save.php',
                dataType: "json",
                type: "POST",
                data: {                 //  truyen du lieu tu js sang php
                    lines: paths,    // bien uname (tu js) truyen sang php (lay bang $_POST['lines'])
                    ideas: texts,
                    length: paths.length,
                    name  : centerIdea
                },
                success: function(data) {
                    console.log("OK");
                }
            });
        }
    });
    // function logs & edit
    $("#edit").click(function(){
        if(view){
            edit = true;
            view = false;
            clear();
            //????/
            // context.translate(0,0);
            // context.scale(1,1);
            context.restore();
            // lấy tên project
            drawMM();
        }
        else{

            // đếu làm gì cả;
        }
    });
    function drawMM(){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        document.getElementById("nameCenter").value = centerIdea;
        // vẽ lại mindmap
        for (var i = 0; i < paths.length; i++) {
            for (var j = 1; j < paths[i].length; j++){
                var lengthText = texts[i].value.length;
                var xStart = paths[i][0].x, yStart = paths[i][0].y;
                var xEnd = paths[i][j].x, yEnd = paths[i][j].y;

                // vẽ các đường nhánh
                context.beginPath();
                context.moveTo(xStart, yStart);
                context.lineTo(xEnd, yEnd);
                context.lineWidth = 5;
                context.strokeStyle = 'blue';
                context.stroke();
                // hàm resize input
                resizeme();
                // vẽ input
                if(paths[i][0].x > paths[i][j].x){
                    $(".wrapper").append(
                        $('<input type="text" class="resizeme">').attr({
                            value: texts[i].value,
                            id: texts[i].id
                        }).css({
                            position: 'absolute',
                            left: xEnd - 98- lengthText*7,
                            top: yEnd - 30,
                            width: 100+lengthText*7
                        })
                    );
                    // hiện không resize được là do ko có sự kiện ấn phím, hàm resizeme là hàm của keydown
                    context.moveTo(xEnd+2, yEnd);
                    context.lineTo(xEnd -100- lengthText*7, yEnd);
                    context.stroke();

                    context.beginPath();
                    context.fillStyle = "red";
                    context.arc(xEnd-100 -lengthText*7, yEnd, 5, 0, Math.PI * 2);
                    context.fill();
                    context.strokeStyle = 'red';
                    context.stroke();
                }
                else{
                    $(".wrapper").append(
                        $('<input type="text" class="resizeme">').attr({
                            value: texts[i].value,
                            id: texts[i].id
                        }).css({
                            position:'absolute',
                            left: xEnd,
                            top: yEnd - 30,
                            width: 100+lengthText*7
                        })
                    );
                    context.beginPath();
                    context.moveTo(xEnd-2, yEnd);
                    context.lineTo(xEnd + 100 + lengthText*7, yEnd); // do lấy từ mảng ra là giá trị kiểu string

                    context.lineWidth = 5;
                    context.strokeStyle = 'blue';
                    context.stroke();

                    // draw red node.......
                    context.beginPath();
                    context.fillStyle = "red";
                    context.arc(xEnd+105 +lengthText*7, yEnd, 5, 0, Math.PI * 2);
                    context.fill();
                    context.strokeStyle = 'red';
                    context.stroke();
                }
            }
        }
    }
    // drop collections;
    function drop () {
        $.ajax({
            url: 'drop.php',
            dataType: 'json',
            type: 'POST',
            success: function(data){

            }
        });
    }
    // check user, project rồi load mindmap
    logs();

    // lây dữ liệu từ Mongo Db dồng thời vẽ lại mindmap
    function logs() {
        // check username, check project
        // lấy dữ liệu trong db
        $.ajax({
            url: 'logs.php',
            dataType: "json",
            type: "POST",
            // nếu thành công thì thực hiện function
            success: function(data) {
                context.clearRect(0,0, canvas.width,canvas.height);
                $('input').remove();
                center();
                $.each(data, function (key, value) {

                    // gán data trong db vào biến paths và texts
                    paths.push([value.start, value.end]);

                    texts.push([value.ideas]);
                    document.getElementById("nameCenter").value = value.MMname;

                    context.beginPath();
                    context.moveTo(value.start.x, value.start.y);
                    context.lineTo(value.end.x, value.end.y);
                    context.lineWidth = 5;
                    context.strokeStyle = 'blue';
                    context.stroke();

                    value.start.x = parseInt(value.start.x);
                    value.start.y = parseInt(value.start.y);
                    value.end.x = parseInt(value.end.x);
                    value.end.y = parseInt(value.end.y);
                    if (value.start.x> value.end.x) {
                        // console.log("ngang");
                        $(".wrapper").append(
                            $('<input type="text" class="resizeme">').attr({
                                value: value.ideas.value,
                                id: value.ideas.id
                            }).css({
                                position: 'absolute',
                                left: value.end.x - 98,
                                top: value.end.y - 30
                            })
                        );
                        resizeme();
                        context.beginPath();
                        context.moveTo(value.end.x+2, value.end.y);
                        context.lineTo(value.end.x - 100, value.end.y);

                        context.lineWidth = 5;
                        context.strokeStyle = 'blue';
                        context.stroke();


                        // draw red node.......
                        context.beginPath();
                        context.fillStyle = "red";
                        context.arc(value.end.x-105, value.end.y, 5, 0, Math.PI * 2);
                        context.fill();
                        context.strokeStyle = 'red';
                        context.stroke();
                        context.closePath();

                    } else{

                        $(".wrapper").append(
                            $('<input type="text" class="resizeme">').attr({
                                value: value.ideas.value,
                                id: value.ideas.id
                            }).css({
                                position:'absolute',
                                left: value.end.x,
                                top: value.end.y - 30
                            })
                        );
                        resizeme();
                        context.beginPath();
                        context.moveTo(value.end.x-2, value.end.y);
                        context.lineTo(value.end.x + 100, value.end.y); // do lấy từ mảng ra là giá trị kiểu string

                        context.lineWidth = 5;
                        context.strokeStyle = 'blue';
                        context.stroke();

                        // draw red node.......
                        context.beginPath();
                        context.fillStyle = "red";
                        context.arc(value.end.x+105, value.end.y, 5, 0, Math.PI * 2);
                        context.fill();
                        context.strokeStyle = 'red';
                        context.stroke();
                    }
                    resizeme();
                    // console.log(paths.length);
                    currentPathIndex = paths.length;
                });
            }
        });
    }
    //function undo
    $('#undo').click(function(){
        if (currentPathIndex == 0) {
            return;
        }
        getText();
        var p = paths.length;
        var x = document.getElementById(texts[p-1].id);
        $('').remove();
        console.log(texts[p-1].id);
        paths.splice(p -1, 1);
        texts.splice(p -1, 1);

        console.log(paths);
        currentPathIndex -= 1;
        drawMM();
    });
});