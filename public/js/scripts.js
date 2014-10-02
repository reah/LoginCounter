$(document).ready(function(){
	// var url_local = 'http://localhost:3000';
	// var url_heroku = 'http://reah-webapp.herokuapp.com';
	var messages = {
		'-1': 'Bad Login Credentials',
		'-2': 'User Already Exists',
		'-3': 'Bad Username',
		'-4': 'Bad Password'
	}
    
    $(function(){
        $('#countScreen').hide();
        $('#logout').hide();
    });
    
    $('#logout').click(function(e){
		$('.wrapper').show(); 
        $('#countScreen').hide();
		$("#message").hide();
		$("#login").show();
		$("#logout").hide();
		$("#omer").hide();
    });

    $('#name').keyup(function(){
    	$('#req').hide();
    	if($('#name').val().length > 128){
    		$('#name').val($('#name').val().substring(0, 128));
		}
    });

    $('#name').blur(function(){
    	if($('#name').val().length <= 0){
    		$('#req').show();
    	}
    });

    $('#pw').keyup(function(){
    	if($('#pw').val().length > 128){
    		$('#pw').val($('#pw').val().substring(0, 128));
		}
    });

    
	$('#login').click(function(e){
		console.log('clicking login button');
		e.preventDefault();
		var username = $('#name').val();
		var password = $('#pw').val();
		console.log(username);
		console.log(password);
		$.ajax({
			type: 'POST',
			url: '/users/login',
			data: JSON.stringify({user: username, password: password}),
			contentType: "application/json",
			dataType: "json",
			success: function(data){
				console.log(data);
				var errCode = (data['errCode']).toString();
				if(errCode < 0){
					$("#message").html(messages[errCode]);
					$("#message").show();
				}else{
					if(username == 'Omer' || username == 'omer'){
						$('#omer').css('display', 'block');
					}
					$("#message").hide();
					$("#countScreen").show();
					$("#countScreen #name").html(username);
					$("#countScreen #count").html(data['count']);
					$(".wrapper").hide();
					$("#logout").css('display', 'block');				
				}
			}
		});
	});
		$('#register').click(function(e){
		e.preventDefault();
		var username = $('#name').val();
		var password = $('#pw').val();
		console.log(username);
		console.log(password);
		$.ajax({
			type: 'POST',
			url: '/users/add',
			data: JSON.stringify({user: username, password: password}),
			contentType: "application/json",
			dataType: "json",
			success: function(data){
				console.log(data);
				var errCode = (data['errCode']).toString();
				if(errCode < 0){
					$("#message").html(messages[errCode]);
					$('#message').show();

				}else{
					if(username == 'Omer' || username == 'omer'){
						$('#image').show();
					}
					$('#message').hide();
					$('#countScreen').show();
					$("#countScreen #name").html(username);
					$("#countScreen #count").html(data['count']);
					$(".wrapper").hide();
					$('#logout').show();
				}
				
			}
		});
	});
});