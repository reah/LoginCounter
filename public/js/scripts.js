$(document).ready(function(){
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
		$("#message").hide();
		$("#login").show();
		$("#logout").hide();
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
			url: 'http://localhost:3000/users/login',
			data: JSON.stringify({user: username, password: password}),
			contentType: "application/json",
			dataType: "json",
			success: function(data){
				console.log(data);
				var errCode = (data['errCode']).toString();
				if(errCode < 0){
					$("#message").html(messages[errCode]);
				}else{
					$("#message").html(messages[errCode]);
					$("#countScreen #name").html(username);
					$("#countScreen #count").html(data['count']);
					$(".wrapper").hide();
					$("#logout").show();				
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
			url: 'http://localhost:3000/users/add',
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