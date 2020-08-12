var p1=true;
var avlDice=5;
var rollCnt=3;
var turnCnt=24;

$(document).ready(function(){

    $('#rollbutton').click(function(){
    	if(rollCnt!=0) diceRoll();
    });

    $('.diceslot').click(function(){
        var tmp=$(this).html();
	if(!isNull(tmp)){
		
		$(this).html('');

        	$('.keepslot').each(function(){
        		if(isNull($(this).html())) {
        			$(this).html(tmp);
        			return false;
        		}
        	});

        	avlDice--;

        	if(avlDice==0) chkScore();
	}
    });

    $('.keepslot').click(function(){
    	if(rollCnt!=0){
    		var tmp=$(this).html();
		if(!isNull(tmp)){
			$(this).html('');

            		$('.diceslot').each(function(){
                		if(isNull($(this).html())) {
                    		$(this).html(tmp);
                    		return false;
                		}
            		});

            		avlDice++;

            		cnlScore();
		}
            
    	}
    });

    $('.unlock').click(function(){
    	if(!isNull($(this).html())) lockScore($(this));
    });

    $("#resetBtn").on("click", reset);

});

function isNull(par){
	if(par==''||par==null) return true;
	else return false;
}
function reset(){
	location.reload();
}
function diceRoll(){
    $('.diceslot').each(function(){
    	$(this).html('');
    });

	for(var i=1;i<=avlDice;i++){
		var tmp=Math.floor(Math.random()*6+1);
		$('#diceslot'+i).html(tmp);
	}

	rollCnt--;
	updateMonitor();

	if(rollCnt==0) keepForce();
}
function keepForce(){
	$('.diceslot').each(function(){
        if(!isNull($(this).html())){
        	var tmp=$(this).html();
        	$(this).html('');
        	$('.keepslot').each(function(){
                if(isNull($(this).html())) {
                    $(this).html(tmp);
                    return false;
                }
            });
        }
    });
	chkScore();
}
function chkScore(){
	var sArr=[0, 0, 0, 0, 0, 0, 0];

	$('.keepslot').each(function(){
        sArr[$(this).html()]++;
    });

	if(p1){
		$('.scorep1').each(function(){
			if($(this).hasClass('unlock')) $(this).html(getScore($(this).attr('id'), sArr));
		});
	}else{
		$('.scorep2').each(function(){
			if($(this).hasClass('unlock')) $(this).html(getScore($(this).attr('id'), sArr));
        });
	}
}
function cnlScore(){
	if(p1){
        $('.scorep1').each(function(){
            if($(this).hasClass('unlock')) $(this).html('');
        });
    }else{
        $('.scorep2').each(function(){
            if($(this).hasClass('unlock')) $(this).html('');
        });
    }
}
function getScore(par, arr){
	if(par=='ones'){
	    return arr[1];
	}else if(par=='twos'){
		return arr[2]*2;
	}else if(par=='threes'){
		return arr[3]*3;
    }else if(par=='fours'){
    	return arr[4]*4;
    }else if(par=='fives'){
    	return arr[5]*5;
    }else if(par=='sixes'){
    	return arr[6]*6;
    }else if(par=='choice'){
        var cnt=arr[1];
        cnt+=arr[2]*2;
        cnt+=arr[3]*3;
        cnt+=arr[4]*4;
        cnt+=arr[5]*5;
        cnt+=arr[6]*6;
        return cnt;
    }else if(par=='kind'){
    	var cnt=0;
    	x:
        for(var i=1;i<=6;i++){
        	if(arr[i]==4) {
        		cnt+=i*4;
        		for(var j=1;j<=6;j++){
                    if(arr[j]==1){
                        cnt+=j;
                        break x;
                    }
                }
        	}
        }
    	return cnt;
    }else if(par=='house'){
    	var cnt=0;
        x:
        for(var i=1;i<=6;i++){
            if(arr[i]==3) {
                cnt+=i*3;
                for(var j=1;j<=6;j++){
                    if(arr[j]==2){
                        cnt+=j*2;
                        break x;
                    }
                }
                cnt=0;
            }
        }
        return cnt;
    }else if(par=='lst'){
        var cnt=0;
        if(arr[1]!=0&&arr[2]!=0&&arr[3]!=0&&arr[4]!=0) cnt+=15;
        else if(arr[2]!=0&&arr[3]!=0&&arr[4]!=0&&arr[5]!=0) cnt+=15;
        else if(arr[3]!=0&&arr[4]!=0&&arr[5]!=0&&arr[6]!=0) cnt+=15;
        return cnt;
    }else if(par=='bst'){
    	var cnt=0;
        if(arr[1]!=0&&arr[2]!=0&&arr[3]!=0&&arr[4]!=0&&arr[5]!=0) cnt+=30;
        else if(arr[2]!=0&&arr[3]!=0&&arr[4]!=0&&arr[5]!=0&&arr[6]!=0) cnt+=30;
        return cnt;
    }else if(par=='yacht'){
    	var cnt=0;
    	for(var i=1;i<=6;i++){
            if(arr[i]==5) {
                cnt+=50;
                break;
            }
        }
        return cnt;
    }
}
function lockScore(par){
	par.removeClass('unlock');
	par.addClass('lock');
	chkBonus();
	chkTs();
	cnlScore();
	$('.keepslot').each(function(){
        $(this).html('');
    });
	turnCnt--;
	if(turnCnt==0){
		chkWinner();
	}else{
		p1=!p1;
	    avlDice=5;
	    rollCnt=3;
	    updateMonitor();
	}
}
function chkBonus(){
	if(p1){
		var cnt=0;
        $('.scorep1.lock.bn').each(function(){
            if(!isNull($(this).html())) cnt+=$(this).html()*1;
        });
        if(cnt>=63) {
        	$('#bonus1').html('35');
        	$('#bonus1').removeClass('unlock');
        	$('#bonus1').addClass('lock');
        }
    }else{
    	var cnt=0;
        $('.scorep2.lock.bn').each(function(){
            if(!isNull($(this).html())) cnt+=$(this).html()*1;
        });
        if(cnt>=63) {
        	$('#bonus2').html('35');
        	$('#bonus2').removeClass('unlock');
            $('#bonus2').addClass('lock');
        }
    }
}
function chkTs(){
	if(p1){
		var cnt=0;
		$('.scorep1.lock').each(function(){
            cnt+=$(this).html()*1;
        });
		$('#ts1').html(cnt);
	}else{
		var cnt=0;
        $('.scorep2.lock').each(function(){
            cnt+=$(this).html()*1;
        });
        $('#ts2').html(cnt);
	}
}
function chkWinner(){
    var tmp1=$('#ts1').html();
    var tmp2=$('#ts2').html();
    if(tmp1==tmp2) alert("Draw Game");
    else if(tmp1>tmp2) alert("Player1 Win!");
    else alert("Player2 Win!");
    reset();
}
function updateMonitor(){
    if(p1) $('#turn').html('Player1');
    else $('#turn').html('Player2');
    $('#dice').html(rollCnt);
}