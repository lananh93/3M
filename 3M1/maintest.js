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
    var cw = canvas.width = 1800;
    ch = canvas.height = 1500;
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
    var doing =false;

    $("#clear").click(function(){
        if(view || !doing) return;
        clear();
        paths = [];
        texts = [];
        currentPathIndex = 0;
        // view = false;
    });

    function clear(){
        context.clearRect(0,0, canvas.width,canvas.height);
        $('.resize_left').remove();
        $('.resize_right').remove();
        $('.cen').remove();
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
                left: 850,
                top: 600
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
    // alert("Click New Porject to Start !");

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //start function draw()...
    var preX;
    var preY;
    // var canvas;
    var context;
    var imageData;
    var paint = false;
    // hàm vẽ theo sự kiện chuột đồng thời lưu toạ độ vào biến paths, idea vào biến tests
    function draw() {
        var canvas = document.getElementById("canvas");
        context = canvas.getContext('2d');
        $canvas.mousedown(function(e){
            if(view || !doing) return;
            if(event.which == 1){
                console.log("xxx");
                preX = e.pageX - canvas.offsetLeft;
                preY = e.pageY - canvas.offsetTop;
                paint = true;
                imageData = context.getImageData(0,0,canvas.width,canvas.height);
            }
        });

        $canvas.mousemove(function(e) {
            if (view || !doing) return;
            if(paint == true && event.which==1){
                var x = e.pageX - canvas.offsetLeft;
                var y = e.pageY - canvas.offsetTop;

                canvas.width = canvas.width;
                context.putImageData(imageData,0,0);

                paths[currentPathIndex] = [];

                paths[currentPathIndex].push({x:preX, y:preY});

                context.moveTo(preX, preY);
                context.lineTo(x,y);
                context.stroke();
            }
        });
        $canvas.mouseup(function(e) {
            if(view || !doing) return;
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
                            $('<input type="text" class="resize_left">').attr({
                                placeholder: "New idea",
                                id: x * x + y * y
                            }).css({
                                position:'absolute',
                                left: x-98,
                                top: y +135
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
                    } else {
                        $(".wrapper").append(
                            $('<input type="text" class="resize_right">').attr({
                                placeholder: "New idea",
                                id: x * x + y * y
                            }).css({
                                position:'absolute',
                                left: x,
                                top: y +135
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
                    }
                }
                // console.log(paths);
            }
            paint = false;
            // resize input
            resize_left();
            resize_right();
        });
    }

    // resize_right
    function resize_right(){
        $('.resize_right').keydown(function(){
            var o = $(this).width() + 12;
            // if(e.which == 13) {
            var contents = $(this).val();
            var charlength = contents.length;
            var newwidth =  charlength*9 +100;
            var k = $(this).position();

            context.save();
            context.globalCompositeOperation = 'destination-out';
            context.beginPath();
            context.arc(k.left + o + 5, k.top - 135, 10, 0, 2 * Math.PI, false);
            context.fill();
            context.restore();

            context.beginPath();
            context.moveTo(k.left,k.top - 135);
            context.lineTo(k.left + o,k.top - 135);
            context.lineWidth = 6;
            context.strokeStyle = 'white';
            context.stroke();

            $(this).css({width:newwidth});
            // $(this).blur(); // lenh nay de chuot ra khoi the input khi an enter

            context.beginPath();
            context.moveTo(k.left-2,k.top - 135);
            context.lineTo(k.left + newwidth,k.top - 135);

            context.lineWidth = 5;
            context.strokeStyle = 'blue';
            context.stroke();

            context.beginPath();
            context.fillStyle = "red";
            context.arc(k.left + newwidth + 5,k.top - 135, 5, 0, Math.PI * 2);
            context.fill();
            context.strokeStyle = 'red';
            context.stroke();
            // }
        });
    }
    // chỉnh lại toạ độ
    //resize left
    function resize_left() {
        $('.resize_left').keypress(function(e){

            var o = $(this).width() + 12;
            console.log(o);
            // if(e.which == 13) {
            var contents = $(this).val();
            var charlength = contents.length;
            var newwidth =  charlength*7 + 100;
            var k = $(this).position();

            context.save();
            context.globalCompositeOperation = 'destination-out';
            context.beginPath();
            context.arc(k.left -5, k.top -135, 10, 0, 2 * Math.PI, false);
            context.fill();
            context.restore();

            context.beginPath();
            context.moveTo(k.left + o ,k.top -135);
            context.lineTo(k.left ,k.top -135);
            context.lineWidth = 6;
            context.strokeStyle = 'white';
            context.stroke();

            console.log(newwidth);
            $(this).css({
                left: k.left + o + 2 - newwidth,
                width:newwidth});
            // $(this).blur(); // lenh nay de chuot ra khoi the input khi an enter

            context.beginPath();
            context.moveTo(k.left + o +2,k.top - 135);
            context.lineTo(k.left + o + 2 - newwidth ,k.top -135);

            context.lineWidth = 5;
            context.strokeStyle = 'blue';
            context.stroke();

            context.beginPath();
            context.fillStyle = "red";
            context.arc(k.left + o - newwidth - 5,k.top -135, 5, 0, Math.PI * 2);
            context.fill();
            context.strokeStyle = 'red';
            context.stroke();
            // }
        });
    }
    var scale = 1.0;
    var rate = 1;
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
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0); // horizontal scaling, hori skew, ver skew, ver scaling, hor moving, ver moving
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();
        // ve lai center idea
        clear();
        $('.cen').remove();
        var length = centerIdea.length;

        //ve cac input text
        context.translate(translatePos.x,translatePos.y);
        context.scale(scale,scale);
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
                        context.arc(hor-105-lengthText*7, ver, 5, 0, Math.PI * 2);
                        context.fill();
                        context.strokeStyle = 'red';
                        context.stroke();

                        context.beginPath();
                        context.rect(hor-96-lengthText*7,ver-30,lengthText*7+95, 25);
                        console.lineWidth = "3";
                        context.strokeStyle = "#2aabd2";
                        context.stroke();
                        context.fillStyle = "white";
                        context.fill();

                        context.font ='15px Arial';
                        context.fillStyle = "black";
                        context.fillText(texts[i].value,hor-48-lengthText*7,ver-12);
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
                        context.arc(hor+105 +lengthText*7, ver, 5, 0, Math.PI * 2);
                        context.fill();
                        context.strokeStyle = 'red';
                        context.stroke();

                        context.beginPath();
                        context.rect(hor+2,ver-30,lengthText*7+92, 25);
                        console.lineWidth = "3";
                        context.strokeStyle = "#2aabd2";
                        context.stroke();
                        context.fillStyle = "white";
                        context.fill();

                        context.beginPath();
                        context.font ='15px Arial';
                        context.fillStyle = "black";
                        context.fillText(texts[i].value,hor+49- lengthText*0.5,ver -12);
                        // console.log(texts[i].value);
                        context.closePath();
                    }
                }
            }
        }
        // ve center idea　length là độ dài ký tự
        context.beginPath();
        context.rect(canvas.width/2 -48,436, parseInt(length)*10+143,44);
        context.lineWidth ="6";
        context.strokeStyle = "orange";
        context.stroke();
        context.fillStyle = "white";
        context.fill();
        context.font = '300 25px Arial';
        context.fillStyle = "black";
        context.fillText(centerIdea, 850 + 68 - parseInt(length)*0.98, 468);
        context.closePath();

        // sau khi dùng translate, toạ độ gốc canvas bị thay đổi nhưng toạ độ của chuột ko thay đổi vì toạ độ chuột mặc định theo window éo liên quan đến canvas
    }
    // chuyển chế độ view để zoom và kéo thả
    $('#view').click(function(){
        // context.restore();
        if(view|| !doing) return;
        rate = 1;
        // console.log(view);
        var mousedown = false;

        view = true; // disable ham ve draw
        getText();
        // hàm vẽ lại mindmap ko dùng kéo thả chuột
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
            console.log("rate: " + rate);
            console.log("scaleMultiplier: " + scaleMultiplier);
            console.log("scale: " +scale);
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
            // đếu làm gì cả;
        }
    });
    // hàm vẽ lại mind map theo biến paths và tests
    function drawMM(rate){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        document.getElementById("nameCenter").value = centerIdea;

        // vẽ lại mindmap
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
                // hàm resize input
                resize_left();
                resize_right();
                // vẽ input
                if(paths[i][0].x > paths[i][j].x){
                    $(".wrapper").append(
                        $('<input type="text" class="resize_left">').attr({
                            value: texts[i].value,
                            id: texts[i].id
                        }).css({
                            position: 'absolute',
                            left: xEnd - 98- lengthText*7,
                            top: yEnd +135,
                            width: 100+lengthText*7
                        })
                    );
                    // hiện không resize được là do ko có sự kiện ấn phím, hàm resizeme là hàm của keydown
                    context.moveTo(xEnd+2, yEnd);
                    context.lineTo(xEnd -100- lengthText*7, yEnd);
                    context.stroke();

                    context.beginPath();
                    context.fillStyle = "red";
                    context.arc(xEnd-105 -lengthText*7, yEnd, 5, 0, Math.PI * 2);
                    context.fill();
                    context.strokeStyle = 'red';
                    context.stroke();
                }
                else{
                    $(".wrapper").append(
                        $('<input type="text" class="resize_right">').attr({
                            value: texts[i].value,
                            id: texts[i].id
                        }).css({
                            position:'absolute',
                            left: xEnd,
                            top: yEnd +135,
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
    // function new project
    var order = 0;
    var currentOrder = 0;
    var currentName = '';

    var order = 0;
    var currentOrder = 0;
    var currentName = '';
    function newproject(){
        currentOrder  = order;
        context.clearRect(0,0, canvas.width,canvas.height);
        clear();
        paths = [];
        texts = [];
        currentPathIndex = 0;
        centerIdea ='';
        $(".cen").val(centerIdea);
        var r=$('<input/>').attr({
            type: "button",
            class: "btn btn-primary btn-sm workingMMM",
            value: '',
            order: order
        }).css({
            "margin-left": "5px",
            "margin-top": "3px",
            "width": "12.2%"
        });
        $("#sideBar").append(r);
        $('#sideBar input:last-child').addClass('active');
        $('#sideBar input:last-child').siblings().removeClass("active");
        order ++;
        currentName = '';
    }
    console.log(currentName);
    $('#newproject').click(function() {
        if(view) return;
        if(!paths[0] ==[] && currentName==''){
            var MMname= prompt(" You should save this project firs!: ", "mindmap1");
            if(MMname === null ){
                return;
            }
            else if(!MMname || MMname == 'undefined'){
                alert("Nothing fill, default is mindmap !");
                MMname = "MindMap";
            }
            centerIdea = MMname;
            $(".cen").val(centerIdea);
            $("#sideBar input[order='" + currentOrder + "']").val(centerIdea);
            save();
            newproject();
        }
        else{
            newproject();
        }
        doing =true;
    });
    draw();
    // get order of input (workingMMM)
    $('#sideBar').delegate('.workingMMM', 'click', function() {
        if(view) return;
        doing =true;
        console.log(doing);
        currentOrder = $(this).attr('order');
        currentName = $(this).val();
        context.clearRect(0,0, canvas.width,canvas.height);
        $('.resize_right').remove();
        $('.resize_left').remove();
        $('.cen').remove();
        // vẽ lại mm khi ấn vào tab tên Project
        console.log("currentName: " + currentName);
        logs();
        $(this).addClass('active');
        $(this).siblings().removeClass("active");
        paths =[];
        texts =[];
        currentPathIndex == 0;
        doing = true;
    });

    var ProName = [];
    // lưu vào mongoDb
    $('#save').click(function(){
        if(view || !doing) return;
        //  lấy dữ liệu trong input
        drop();
        getText();
        console.log(order);
        console.log(currentName);
        // save();
        $("#sideBar input[order='" + currentOrder + "']").val(centerIdea);
        currentName = centerIdea;
        // console.log(order);
        save();
        ProName[order] =centerIdea;
        console.log(ProName);
    });

    function save(){
        console.log(ProName[0]);
        // nếu giữ liệu ở input chính chưa có gì thì hỏi, lưu mặc định là mindmap
        if(typeof(paths[0])=='undefined'){
            alert("Nothing to save, please draw first and save again!");
        }
        if(centerIdea==''){
            var MMname= prompt(" Save your mindmap as: ", "mindmap1");
            if(MMname === null ){
                return;
            }
            else if(!MMname || MMname == 'undefined'){
                alert("Nothing fill, default is mindmap !");
                MMname = "MindMap";
            }
            for(var q=1; q< currentOrder; q++){
                if (ProName[q] === MMname){
                    alert("The project has already existed!");
                    return;
                }
                else{
                    centerIdea = MMname;
                    $(".cen").val(centerIdea);
                    $("#sideBar input[order='" + currentOrder + "']").val(centerIdea);
                    currentName = centerIdea;
                }
            }
        }
        if (!paths[0]==[] || !centerIdea==''){
            drop();
            getText();
            console.log(currentName);
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
                    MMname  : centerIdea,
                    user : userId
                },
                success: function(data) {
                    console.log("OK");
                }
            });
        }
    }

    $('#drop').click(function() {
        if(view || !doing) return;
        drop();
        $('.resize_left').remove();
        $('.resize_right').remove();
        $('#nameCenter').remove();
        // logs();
        paths =[];
        texts =[];
        currentPathIndex == 0;
        context.clearRect(0,0, canvas.width,canvas.height);
        $('.resize').remove();
        $('.workingMMM[value="' + currentName + '"]').remove();
        currentName = $("#sideBar input:last-child").val();
        logs();
        $('#sideBar input:last-child').addClass('active');
        $('#sideBar input:last-child').siblings().removeClass("active");
        if (typeof(currentName)=='undefined'){ console.log("drop"); doing =false;}
    });
    // drop collections;
    function drop () {
        // console.log(currentName);
        $.ajax({
            url: 'drop.php',
            dataType: 'json',
            type: 'POST',
            data: {
                user: userId,
                MMname: currentName
            },
            success: function(data){
                console.log("OK");
            }
        });
    }
    // lấy ra project

    logsMM();
    var k = '';
    function logsMM(){
        $('input').remove();
        // center();
        $.ajax({
            url: 'logsMM.php',
            dataType: "json",
            type: "POST",
            data:{
                user : userId,
                MMname: currentName
            },
            success: function(data){
                console.log("OK");
                $.each(data, function (key,value){
                    var r=$('<input/>').attr({
                        type: "button",
                        class: "btn btn-primary btn-sm workingMMM",
                        value: '',
                        order: order,
                    }).css({
                        "margin-left": "5px",
                        "margin-top": "3px",
                        "width": "12.2%"
                    });
                    if ( k != value.MindMap) {
                        $('#sideBar').append(r.attr({
                            'value': value.MindMap,

                        }));
                        order++;
                        k = value.MindMap;
                    }
                    // console.log(order);
                });
            }
        });
    }
    // lấy dữ liệu từ Mongo Db dồng thời vẽ lại mindmap
    function logs() {
        center();
        if (typeof currentName === 'undefined') {
            $('.cen').remove();
            $('.resize').remove();
            $('.resizeme').remove();
            centerIdea = '';
            return;
        }
        // lấy dữ liệu trong db
        // console.log(currentName);
        $.ajax({
            url: 'logs.php',
            dataType: "json",
            type: "POST",
            data:{
                user : userId,
                MMname: currentName
            },
            // nếu thành công thì thực hiện function
            success: function(data) {
                // console.log("ok");
                context.clearRect(0,0, canvas.width,canvas.height);
                // tạo lại input project trên sideBar
                // console.log(order);
                $.each(data, function (key, value) {
                    // console.log(value.MindMap);
                    // gán data trong db vào biến paths và texts
                    paths.push([value.start, value.end]);
                    texts.push([value.ideas]);
                    // document.getElementById("nameCenter").value = value.MindMap;
                    $(".wrapper").append(
                        $('<input type="text" class="cen">').attr({
                            value: value.MindMap,
                            id: "nameCenter"
                        }).css({
                            width: value.MindMap.length*10 + 100,
                            position:'absolute',
                            left: 850,
                            top: 600
                        })
                    );

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
                            $('<input type="text" class="resize_left">').attr({
                                value: value.ideas.value,
                                id: value.ideas.id
                            }).css({
                                position: 'absolute',
                                left: value.end.x - 98,
                                top: value.end.y +135
                            })
                        );
                        resize_left();

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
                            $('<input type="text" class="resize_right">').attr({
                                value: value.ideas.value,
                                id: value.ideas.id
                            }).css({
                                position:'absolute',
                                left: value.end.x,
                                top: value.end.y +135
                            })
                        );
                        resize_right();
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
                    resize_left();
                    resize_right();
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
        $('.resize_left').remove();
        $('.resize_right').remove();
        console.log(texts[p-1].id);
        paths.splice(p -1, 1);
        texts.splice(p -1, 1);

        console.log(paths);
        currentPathIndex -= 1;
        drawMM();
    });
});