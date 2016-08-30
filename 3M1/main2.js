
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
    var ch = canvas.height = 1000;
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

    function clear(){
        context.clearRect(0,0, canvas.width,canvas.height);
        $('.cen').remove();
        $('.resize').remove();
        $('.resizeme').remove();
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
        $('.cen').keydown(function(){
            var contents = $(this).val();
            var charlength = contents.length +10;
            var newwidth =  charlength*12;
            $(this).css({width:newwidth});
        });
    }



    //start function draw()...
    var preX;
    var preY;
    var context;
    var imageData;
    var paint;


    // hàm vẽ theo sự kiện chuột đồng thời lưu toạ độ vào biến paths, idea vào biến tests
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
                context.moveTo(preX, preY);
                context.lineTo(x,y);
                context.stroke();

                paths[currentPathIndex] = [];
                paths[currentPathIndex].push({x:preX, y:preY});
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
                                left: x-98,
                                top: y -30
                            })
                        );

                        context.beginPath();
                        context.moveTo(x+2,y);
                        context.lineTo(x - 102,y);
                        context.lineWidth = 5;
                        context.strokeStyle = 'blue';
                        context.stroke();

                        context.beginPath();
                        context.fillStyle = "red";
                        context.arc(x-105,y, 5, 0, Math.PI * 2);
                        context.fill();
                        context.strokeStyle = 'red';
                        context.stroke();

                        resize2();
                    } else {
                        $(".wrapper").append(
                            $('<input type="text" class="resizeme">').attr({
                                placeholder: "New idea",
                                id: x * x + y * y
                            }).css({
                                position:'absolute',
                                left: x,
                                top: y -30
                            })
                        );
                        context.beginPath();
                        context.moveTo(x-2,y);
                        context.lineTo(x + 100,y);

                        context.lineWidth = 5;
                        context.strokeStyle = 'blue';
                        context.stroke();

                        context.beginPath();
                        context.fillStyle = "red";
                        context.arc(x+105,y, 5, 0, Math.PI * 2);
                        context.fill();
                        context.strokeStyle = 'red';
                        context.stroke();

                        resizeme();
                    }
                }
                // console.log(paths);
            }
            paint = false;
        });
        context.restore();
        context.save();
    }
    // draw();

    // Ham resize cho nhung nhanh ben phai
    function resizeme(){
        $('.resizeme').keypress(function(e){
            var o = $(this).width() + 14;
            if(e.which == 13) {

                var contents = $(this).val();
                var charlength = contents.length;
                var newwidth =  charlength*9 +100;
                var k = $(this).position();

                context.save();
                context.globalCompositeOperation = 'destination-out';
                context.beginPath();
                context.arc(k.left + o + 5, k.top + 30, 10, 0, 2 * Math.PI, false);
                context.fill();
                context.restore();

                // console.log(contents);
                $(this).css({
                    width:newwidth});
                $(this).blur(); // lenh nay de chuot ra khoi the input khi an enter

                context.beginPath();
                context.moveTo(k.left-2,k.top + 30);
                context.lineTo(k.left + newwidth,k.top + 30);

                context.lineWidth = 5;
                context.strokeStyle = 'blue';
                context.stroke();

                context.beginPath();
                context.fillStyle = "red";
                context.arc(k.left + newwidth + 5,k.top + 30, 5, 0, Math.PI * 2);
                context.fill();
                context.strokeStyle = 'red';
                context.stroke();
            }
        });
    }

    //Ham resize cho nhung nhanh ben trai
    function resize2() {
        $('.resize').keypress(function(e){
            // context.arc.remove();

            var o = $(this).width() + 14;

            // console.log(o);
            if(e.which == 13) {
                var contents = $(this).val();
                var charlength = contents.length;
                var newwidth =  charlength*9 + 100;
                var k = $(this).position();

                context.save();
                context.globalCompositeOperation = 'destination-out';
                context.beginPath();
                context.arc(k.left -5, k.top + 30, 10, 0, 2 * Math.PI, false);
                context.fill();
                context.restore();

                // console.log(newwidth);
                $(this).css({
                    left: k.left + o - newwidth,
                    width:newwidth});
                $(this).blur(); // lenh nay de chuot ra khoi the input khi an enter

                context.beginPath();
                context.moveTo(k.left + o +2,k.top + 30);
                context.lineTo(k.left + o - newwidth ,k.top + 30);

                context.lineWidth = 5;
                context.strokeStyle = 'blue';
                context.stroke();



                context.beginPath();
                context.fillStyle = "red";
                context.arc(k.left + o - newwidth - 5,k.top + 30, 5, 0, Math.PI * 2);
                context.fill();
                context.strokeStyle = 'red';
                context.stroke();
            }
        });
    }

    var scale = 1.0;
    var scaleMultiplier = 0.8;
    var startDrag = {};
    var translatePos = {
        x: 0,
        y: 0
    };

    // lấy dữ liệu trong thẻ input
    var centerIdea;
    function getText(){
        centerIdea = $(".cen").val();
        // console.log(paths);
        // lay dữ liệu dạng text từ các nhánh 
        for (var i = 0; i < paths.length; i++) {
            for (var j = 1; j < paths[i].length; j++){
                id = paths[i][j].x * paths[i][j].x + paths[i][j].y * paths[i][j].y;
                if (document.getElementById(id) != null) {
                    var text = document.getElementById(id).value;
                    texts[i] = {"id" : id, "value" : text};
                } else {
                    var text = "New Idea";
                    texts[i] = {"id" : id, "value" : text};
                }
            }
        }
    }

    // hàm vẽ lại trên canvas ko dùng chuột để zoom và kéo thả　
    function redraw(scale,translatePos) {
        // xoa man hinh
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0); // horizontal scaling, hori skew, ver skew, ver scaling, hor moving, ver moving
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();

        // ve lai center idea
        $('.cen').remove();
        $('.resize').remove();
        $('.resizeme').remove();
        var length = centerIdea.length;

        //ve cac input text
        context.translate(translatePos.x,translatePos.y);
        context.scale(scale,scale);

        // khung canvas
        context.beginPath();
        context.strokeStyle = "green";
        context.lineWidth= 5;
        context.rect(0,0, canvas.width, canvas.height);
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
    }

    // chuyển chế độ view để zoom và kéo thả
    $('#view').click(function(){
        if(view) return;
        rate = 1;
        var mousedown = false;

        view = true; // disable ham ve draw
        getText();

        // context.restore();
        // redraw(scale,translatePos); // hàm vẽ lại mindmap ko dùng kéo thả chuột

        //zoom in, zoom out
        $("#plus").click(function(){
            if(!view) return;
            scale /= scaleMultiplier;
            redraw(scale,translatePos);
            scale = 1;
            rate /= scaleMultiplier;
        });

        // zoom out
        $("#minus").click(function(){
            if(!view) return;
            scale *= scaleMultiplier;
            redraw(scale,translatePos);
            scale = 1;
            rate *= scaleMultiplier;

        });

        // sự kiện kéo thả
        canvas.addEventListener("mouseover", function(e){
            if(!view) return;
            mouseDown = false;

        });

        canvas.addEventListener("mousedown", function(e){
            if(!view) return;
            mouseDown = true;
            startDrag.x = e.clientX;
            startDrag.y = e.clientY;
            // console.log(e.clientX, e.clientY);
        });

        canvas.addEventListener("mousemove", function(e){
            if(!view) return;
            if(mouseDown){
                translatePos.x = e.clientX - startDrag.x;
                translatePos.y = e.clientY - startDrag.y;
                // console.log(e.clientX, e.clientY);
                context.save();
                redraw(scale,translatePos);
                translatePos.x = translatePos.y =0;
                context.restore();
            }
        });

        canvas.addEventListener("mouseup", function(e){
            if(!view) return;
            mouseDown = false;
        });
        // khi chuột nằm trong canvas, mặc định mouseDown = false, để tránh việc giữ chuột rồi đưa ra ngoài canvas, đưa vào vẫn vẽ

        canvas.addEventListener("mouseout", function(e){
            if(!view) return;
            mouseDown = false;
        });
        redraw(scale,translatePos);
    });

    // function logs & edit
    $("#edit").click(function(){
        if(view){
            view = false;
            clear();
            // context.translate(0,0);
            drawMM(rate);
        }
        else{
            return;
        }
    });

    // hàm vẽ lại mind map theo biến paths và texts
    function drawMM(rate){
        $('.resizeme').remove();
        $('.resize').remove();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        document.getElementById("nameCenter").value = centerIdea;

        // vẽ lại mindmap
        // hình tròn xanh để test
        context.scale(1/rate, 1/rate);
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

                // vẽ input 
                if(paths[i][0].x > paths[i][j].x){
                    $(".wrapper").append(
                        $('<input type="text" class="resize">').attr({
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
                    resize2();
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
                    resizeme();
                }
            }
        }
    }
    // lưu vào mongoDb lưu lines,
    $('#save').click(function() {
        getText();
        $("#sideBar input[order='" + currentOrder + "']").val(centerIdea);

        currentName = centerIdea;
        console.log(currentName);
        console.log(texts);
        save();
        drawMM();
    });

    function save(){
        drop();
        console.log('luu '+centerIdea);
        getText();

        if(centerIdea==''){
            var MMname= prompt(" Please save your mindmap's name: ", "HuanCao");
            centerIdea = MMname;
            $(".cen").val(centerIdea);
        }

        $.ajax({
            url: 'save.php',
            dataType: "json",
            type: "POST",
            data: {                 //  truyen du lieu tu js sang php
                lines: paths,    // bien uname (tu js) truyen sang php (lay bang $_POST['lines'])
                ideas: texts,
                length: paths.length,
                name: centerIdea
            },
            success: function(data) {
                console.log("OK");
            }
        });
    }

    // drop collections;
    $('#drop').click(function() {
        drop();
    });

    function drop() {
        console.log('drop '+currentName);
        $.ajax({
            url: 'drop.php',
            dataType: 'json',
            type: 'POST',
            data: {                 //  truyen du lieu tu js sang php
                collection: currentName,
            }
        });
    }

    // check user, project rồi load mindmap
    // lây dữ liệu từ Mongo Db dồng thời vẽ lại mindmap  
    function logs() {
        if (typeof currentName === 'undefined') {
            $('.cen').remove();
            $('.resize').remove();
            $('.resizeme').remove();
            centerIdea = '';
            return;
        }
        $.ajax({
            url: 'logs.php',
            dataType: "json",
            type: "POST",
            data: {                 //  truyen du lieu tu js sang php
                collection: currentName,
            },
            // nếu thành công thì thực hiện function
            success: function(data) {
                var i = 0;
                context.clearRect(0,0, canvas.width,canvas.height);
                $('.cen').remove();
                $('.resize').remove();
                $('.resizeme').remove();
                center();
                $.each(data, function (key, value) {

                    // gán data trong db vào biến paths và texts
                    paths.push([value.start, value.end]);

                    // texts.push([value.ideas]);
                    texts[i] = value.ideas;
                    i ++;
                    console.log(paths);
                    console.log(texts);
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
                            $('<input type="text" class="resize">').attr({
                                value: value.ideas.value,
                                id: value.ideas.id
                            }).css({
                                position: 'absolute',
                                left: value.end.x - 98,
                                top: value.end.y - 30
                            })
                        );
                        resize2();
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
                    currentPathIndex = paths.length;
                });
            }
        });
    }

    var order = 0;
    var currentOrder = 0;
    var currentName = '';

    $('#newproject').click(function() {
        order ++;
        currentOrder  = order;
        context.clearRect(0,0, canvas.width,canvas.height);
        $('.resizeme').remove();
        $('.resize').remove();
        $('.cen').remove();
        center();
        paths = [];
        texts = [];
        currentPathIndex = 0;
        centerIdea = '';
        $(".cen").val(centerIdea);
        var r=$('<input/>').attr({
            type: "button",
            class: "btn btn-primary btn-sm workingMMM",
            value: '',
            order: order
        });
        $("#sideBar").append(r);
        $('#sideBar input:last-child').addClass('active');
        $('#sideBar input:last-child').siblings().removeClass("active");
        draw();
    });

    // get order of input (workingMMM)
    $('#sideBar').delegate('.workingMMM', 'click', function() {
        paths =[];
        texts =[];
        currentOrder = $(this).attr('order');
        currentName = $(this).val();
        $('.resizeme').remove();
        $('.resize').remove();
        $('.cen').remove();
        context.clearRect(0,0, canvas.width,canvas.height);
        center();
        logs();
        // $(this).removeClass('active');
        $(this).addClass('active');
        $(this).siblings().removeClass("active");
    });


    //function undo 
    $('#undo').click(function(){
        if (currentPathIndex == 0) {
            return;
        }
        getText();
        var p = paths.length;
        $('.resizeme').remove();
        $('.resize').remove();

        paths.splice(p -1, 1);
        texts.splice(p -1, 1);

        currentPathIndex -= 1;
        drawMM();
        $('#save').click();
    });

    $('#delete').click(function(){
        drop();
        paths =[];
        texts =[];
        context.clearRect(0,0, canvas.width,canvas.height);
        $('.resize').remove();
        $('.workingMMM[value="' + currentName + '"]').remove();
        currentName = $("#sideBar input:last-child").val();
        logs();
        $('#sideBar input:last-child').addClass('active');
        $('#sideBar input:last-child').siblings().removeClass("active");
    });
});