$(function(){
    //Caption Modrator
    $(document).on({
        mouseenter: function () {
            if($(this).data("caption")){
                $(".caption").text($(this).data("caption"));
                var offset = $(this).offset();
                if(offset['top']-30 < 0){
                    //when we dont have Enough Space Top of Element
                    $(".caption").removeClass("bot").addClass("top").css({top:offset['top']+$(this).outerHeight()+6,left: ($(this).outerWidth() > $(".caption").outerWidth() ? offset['left']+($(this).outerWidth()/2) : offset['left']-($(this).outerWidth()/2) ) }).show();
                } else {
                    console.log($(this).outerWidth() > $(".caption").outerWidth())
                    //Ok We Have Enough Space , Lets Show Caption Top Of Element
                    $(".caption").removeClass("top").addClass("bot").css({top:offset['top']-$(this).outerHeight()-12,left: ($(this).outerWidth() > $(".caption").outerWidth() ? offset['left']+($(this).outerWidth()/2) : offset['left']-($(".caption").outerWidth()/2)+5 ) }).show();
                }
            }
        },
        mouseleave: function () {
            $(".caption").hide();
        }
    },"*");
    // Lets Save Our Tasks
    $("#save").click(function(e){
        e.preventDefault(); // Lets Prevent Form Submit
        if($("#title").val().trim() == ""){
            alert("Press Enter A Title For That Task");
        } else {
            //Lets Post Datas To Backend
            $.post("ajax.php?task=addtask",{title:$("#title").val(),pri:$("#pri").val()},function(){
                
                $("#title").val("");
                $("#pri").val("1");
                load_tasks();
            });
        }
    });
    load_tasks();
    $(document).on("click",".table .complete",function(){
        $.post("ajax.php?task=complete",{hash:$(this).parent().data("hash")},function(){
            load_tasks()
        });
    });
    $(document).on("click",".table .delete",function(){
        $.post("ajax.php?task=delete",{hash:$(this).parent().data("hash")},function(){
            load_tasks()
        });
    });
});

function load_tasks(){
    $(".loading").show();
    $("#in_queue").html("");
    $("#tasks").html("")
    $.post("ajax.php?task=tasks",{},function(res){
        res = JSON.parse(res);
        for(i in res['queue']){
            $("#in_queue").append('<div class="table p'+res['queue'][i]['pri']+'" data-hash="'+res['queue'][i]['hash']+'"><div class="title">'+res['queue'][i]['title']+'</div> <div class="complete" data-caption="Done">&#9989;</div></div>');
        }
        for(j in res['tasks']){
            $("#tasks").append('<div class="table p'+res['tasks'][j]['pri']+'" data-hash="'+res['tasks'][j]['hash']+'"><div class="title">'+res['tasks'][j]['title']+'</div> <div class="delete" data-caption="Delete">&#9940;</div></div>');
        }
        $(".loading").hide();
    })
}