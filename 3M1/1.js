/**
 * Created by lananh on 8/9/16.
 */
$(document).ready(function() {

    $(window).resize(function() {
        $('.wrapper').height($(window).height() - $('.wrapper').offset().top);
        $('.wrapper').width($(window).width() - $('.wrapper').offset().left);
    });
    $(window).resize();

    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        currentPathIndex = 0,
        paths = [],
        texts = [];
    var $canvas = $("#canvas");

    canvas.width = 3000;//window.innerWidth;
    canvas.height = 1000;//window.innerHeight;

    $("#clear").click(function(){
        context.clearRect(0,0, canvas.width,canvas.height);
        $('input').remove();
        center();
    });

    function center(){
        $(".wrapper").append(
            $('<input type="text" class="cen resizeme">').attr({
                placeholder: "Center idea",
                id: "nameCenter"
            }).css({
                position:'absolute',
                left: window.innerWidth/2,
                top: window.innerHeight/2
            })
        );
        // resize input
        $('.resizeme').keydown(function(){
            var contents = $(this).val();
            var charlength = contents.length;
            var newwidth =  charlength*12 +100;
            $(this).css({width:newwidth});
        });
    }
    center();


    function draw(){
        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();


        draw1();

        context.restore();
        context.save();

    }

    //draw line 
    function draw1 () {
        var preX;
        var preY;
        var context;
        var imageData;
        var paint;
        var canvas = document.getElementById("canvas");
        context = canvas.getContext('2d');

        $(canvas).mousedown(function(e){
            if(event.which == 1){
                preX = e.pageX - canvas.offsetLeft;
                preY = e.pageY - canvas.offsetTop;
                paint = true;
                imageData = context.getImageData(0,0,canvas.width,canvas.height);
            }

        });


        $(canvas).mousemove(function(e){
            if(event.which == 1){
                if(paint == true){
                    var x = e.pageX - canvas.offsetLeft;
                    var y = e.pageY - canvas.offsetTop;

                    canvas.width = canvas.width;
                    context.putImageData(imageData,0,0);
                    context.moveTo(preX, preY);
                    context.lineTo(x, y);
                    context.stroke();
                   if (typeof paths[currentPathIndex] == 'undefined'){
                        paths[currentPathIndex] = [];
                        paths[currentPathIndex].push({x:preX, y:preY})
                    }
                }
            }

        });

        $(canvas).mouseup(function(e) {
            if(paint == true){
                if(event.which == 1){
                    var x = e.pageX - canvas.offsetLeft;
                    var y = e.pageY - canvas.offsetTop;

                    if( x != preX || y != preY){
                        context.beginPath();
                        context.moveTo(preX,preY);
                        context.lineTo(x,y);
                        // console.log(x,y);

                        context.lineWidth = 5;
                        context.strokeStyle = 'blue';
                        context.stroke();

                        paths[currentPathIndex].push({x:x, y:y});
                        currentPathIndex+=1;
                        // console.log(x);
                        // console.log("hehe");
                        // console.log(paths);

                        if (preX > x) {
                            $(".wrapper").append(
                                $('<input type="text" class="resizeme">').attr({
                                    placeholder: "New idea",
                                    id: x * x + y * y
                                }).css({
                                    position:'absolute',
                                    left: x - 100,
                                    top: y - 33,
                                    width: 90
                                })
                            );
                            context.beginPath();
                            context.moveTo(x,y);
                            context.lineTo(x - 100,y);

                            context.lineWidth = 5;
                            context.strokeStyle = 'blue';
                            context.stroke();

                            // draw red node.......
                            context.beginPath();
                            context.fillStyle = "red";
                            context.arc(x-100, y, 5, 0, Math.PI * 2);
                            context.fill();
                            context.strokeStyle = 'red';
                            context.stroke();
                        } else {
                            $(".wrapper").append(
                                $('<input type="text" class="resizeme">').attr({
                                    placeholder: "New idea",
                                    id: x * x + y * y
                                }).css({
                                    position:'absolute',
                                    left: x,
                                    top: y - 33,
                                    width: 90
                                })
                            );
                            context.beginPath();
                            context.moveTo(x,y);
                            context.lineTo(x + 100,y);
                            context.lineWidth = 5;
                            context.strokeStyle = 'blue';
                            context.stroke();

                            // draw red node.......
                            context.beginPath();
                            context.fillStyle = "red";
                            context.arc(x+100, y, 5, 0, Math.PI * 2);
                            context.fill();
                            context.strokeStyle = 'red';
                            context.stroke();
                        }
                        $('.resizeme').keydown(function(){
                            // console.log('1');
                            var contents = $(this).val();
                            var charlength = contents.length;
                            newwidth =  charlength*9 + 50;
                            $(this).css({width:newwidth});
                        });
                    }
                }

            }

            paint = false;
        });

        context.restore();
        context.save();
    }


    document.getElementById('edit').addEventListener('click', function() {
        edit();

    }, false);
    var k =0;

    //fuction redraw
    function edit() {
        // save();

        $.ajax({
            url: 'logs.php',
            dataType: "json",
            type: "POST",
            success: function(data) {
                // paths = $mindmap;
                context.clearRect(0,0, canvas.width,canvas.height);
                $('input').remove();
                center();
               currentPathIndex = data.length ;
                console.log(currentPathIndex);
                $.each(data, function (key, value) {
                    paths.push([value.start, value.end]);

                    document.getElementById("nameCenter").value = value.MMname;

                    context.beginPath();
                    context.moveTo(value.start.x, value.start.y);
                    context.lineTo(value.end.x, value.end.y);
                    context.lineWidth = 5;
                    context.strokeStyle = 'blue';
                    context.stroke();

                    if (value.start.x> value.end.x) {
                        // console.log("ngang");
                        $(".wrapper").append(
                            $('<input type="text" class="resizeme">').attr({
                                value: value.ideas.value,
                                id: value.ideas.id
                            }).css({
                                position: 'absolute',
                                left: value.end.x - 100,
                                top: value.end.y - 33
                            })
                        );

                        context.beginPath();
                        context.moveTo(value.end.x, value.end.y);
                        context.lineTo(value.end.x - 100, value.end.y);

                        context.lineWidth = 5;
                        context.strokeStyle = 'blue';
                        context.stroke();


                        // draw red node.......
                        context.beginPath();
                        context.fillStyle = "red";
                        context.arc(value.end.x-100, value.end.y, 5, 0, Math.PI * 2);
                        context.fill();
                        context.strokeStyle = 'red';
                        context.stroke();

                        // console.log(value.end.x);
                        // console.log(value.end.x - 100);
                        //
                        // console.log("done 1");
                    } else if (value.start.x < value.end.x) {

                        $(".wrapper").append(
                            $('<input type="text" class="resizeme">').attr({
                                value: value.ideas.value,
                                id: value.ideas.id
                            }).css({
                                position:'absolute',
                                left: value.end.x,
                                top: value.end.y - 33
                            })
                        );

                        context.beginPath();
                        context.moveTo(value.end.x, value.end.y);
                        context.lineTo(parseInt(value.end.x) + 100, value.end.y); // do lấy từ mảng ra là giá trị kiểu string

                        context.lineWidth = 5;
                        context.strokeStyle = 'blue';
                        context.stroke();

                        // draw red node.......
                        context.beginPath();
                        context.fillStyle = "red";
                        context.arc(parseInt(value.end.x)+100, value.end.y, 5, 0, Math.PI * 2);
                        context.fill();
                        context.strokeStyle = 'red';
                        context.stroke();
                    }
                    $('.resizeme').keydown(function(){
                        // console.log('1');
                        var contents = $(this).val();
                        var charlength = contents.length;
                        newwidth =  charlength*9 + 50;
                        $(this).css({width:newwidth});
                    });

                });
                context.restore();
                context.save();
                console.log(paths);
            }

        });
        // currentPathIndex = k;
        // console.log(currentPathIndex);
        // draw();

        // console.log("done it");
        context.restore();
    }



     var centerIdea;
    // lấy dữ liệu trong thẻ input
    function getText(){
        centerIdea = $(".cen").val();
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

    document.getElementById('save').addEventListener('click', function() {
        save();

    }, false);



    function save(){
        drop();
        getText();
        if (!paths[0]== []){
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
    }


    //undo
    document.getElementById('undo').addEventListener('click', function() {
        undo();

    }, false);



    function undo() {
        context.clearRect(0,0, canvas.width,canvas.height);
        $('input').remove();
        center();
        // console.log(paths);
        var p = paths.length;
        paths.splice(p -1, 1);
        // paths2 = paths.splice(p -1, 1);
        // console.log(paths);

        // save();
        for (var i = 0; i < paths.length; i++) {
            console.log(paths.length);
            // paths.splice(o + 1,1);
            context.beginPath();
            context.moveTo(paths[i][0].x, paths[i][0].y);
            for (var j = 1; j < paths[i].length; j++){

                context.lineTo(paths[i][j].x, paths[i][j].y);
                context.lineWidth = 5;
                context.strokeStyle = 'blue';
                context.stroke();

                if (paths[i][0].x> paths[i][j].x) {
                    $(".wrapper").append(
                        $('<input type="text" class="resizeme">').attr({
                            placeholder: "New idea",
                            id: paths[i][j].x * paths[i][j].x + paths[i][j].y * paths[i][j].y
                        }).css({
                            position:'absolute',
                            left: paths[i][j].x - 100,
                            top: paths[i][j].y - 33,
                            width: 90
                        })
                    );

                    context.beginPath();
                    context.moveTo(paths[i][j].x, paths[i][j].y);
                    context.lineTo(paths[i][j].x - 100, paths[i][j].y);

                    context.lineWidth = 5;
                    context.strokeStyle = 'blue';
                    context.stroke();

                    // console.log("done");
                } else {
                    $(".wrapper").append(
                        $('<input type="text" class="resizeme">').attr({
                            placeholder: "New idea",
                            id: paths[i][j].x * paths[i][j].x + paths[i][j].y * paths[i][j].y
                        }).css({
                            position:'absolute',
                            left: paths[i][j].x,
                            top: paths[i][j].y - 33,
                            width: 90
                        })
                    );

                    context.beginPath();
                    context.moveTo(paths[i][j].x, paths[i][j].y);
                    context.lineTo(paths[i][j].x + 100, paths[i][j].y);

                    context.lineWidth = 5;
                    context.strokeStyle = 'blue';
                    context.stroke();
                    // console.log("do it");
                }

                $('.resizeme').keydown(function(){
                    // console.log('1');
                    var contents = $(this).val();
                    var charlength = contents.length;
                    newwidth =  charlength*9 + 50;
                    $(this).css({width:newwidth});
                });

            }
        }
        console.log("redraw");
        context.restore();
        context.save();
        context.restore();
    }

    document.getElementById('drop').addEventListener('click', function() {
        drop();

    }, false);

    function drop () {
        $.ajax({
            url: 'drop.php',
            dataType: 'json',
            type: 'POST'
        })
    }

    draw();
    // console.log(paths);


});