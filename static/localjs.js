function updateCart(c){
    if (c){
        console.log('refresh table');
    
        req=$.ajax({
            type:"GET",
            url:"/updateCart",
            data:{'username':c}
        });
    
        req.done(function(data) {
            console.log(typeof data.mycart);
            console.log(data.mycart.length);
            let text = "";
            for (let i = 0; i < data.mycart.length; i++) {
                text += '<div class="row cart">'+
                '<div class="col colcart">'+data.mycart[i]['id']+" "+data.mycart[i]['itemid']+"</div>"+
                '<div class="col colcart">'+
                    "<button class='btn modqty' onclick='addCartitem("+data.mycart[i]['id']+",0)'>-</button>"+
                    data.mycart[i]['itemqty']+
                    "<button class='btn modqty' onclick='addCartitem("+data.mycart[i]['id']+",1)'>+</button>"+
                "</div>"+
                "<div class='col btncls'>"+"<button class='btn-close' onclick='delCart("+data.mycart[i]['id']+")'></button>"+"</div>"+
                "</div>";
                }
            document.getElementById("mycartmodal").innerHTML = text;
        });
        
    }
    else{
    }
}

function addToCart(a,c){
    if (c){
        console.log('add cart');

        req=$.ajax({
            type:"POST",
            url:"/addajax",
            data:{"itemid":a,"itemqty":1,'username':c}
        });
    
    }
    else{
        location.href="/login";
    }
}

function delCart(a){
    console.log('delcart');

    req=$.ajax({
        type:"POST",
        url:"/delcartitem/"+a
    });

    req.done(function(data) {
        updateCart(data.curuser)
    });
}

function addCartitem(a,b){
    console.log('add qty');

    req=$.ajax({
        type:"POST",
        url:"/addCartitem",
        data:{"itemid":a,"cal":b}
    });

    req.done(function(data) {
        updateCart(data.curuser)
    });
}


