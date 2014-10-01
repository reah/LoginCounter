$(document).ready(function(){
	var messages = {
		'-1': 'Bad Login Credentials',
		'-2': 'User Already Exists',
		'-3': 'Bad Username',
		'-4': 'Bad Password'
	}
    
    $(function(){
        $('#countScreen').hide();
    });
    
    
	$('#login').click(function(e){
		e.preventDefault();
		var username = $('#name').val();
		var password = $('#pw').val();
		console.log(username);
		console.log(password);
		$.ajax({
			type: 'POST',
			url: 'http://localhost:9000/users/add',
			data: JSON.stringify({user: username, password: password}),
			contentType: "application/json",
			dataType: "json",
			success: function(data){
				console.log(data);
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
			url: 'http://www.reah-logincounter.herokuapp.com/users/add',
			data: JSON.stringify({user: username, password: password}),
			contentType: "application/json",
			dataType: "json",
			success: function(data){
				console.log(data);
				var errCode = (data['errCode']).toString();
				$("#message").html(messages[errCode]);
				$("#countScreen #name").html(username);
				$("#countScreen #count").html(data['count']);
				$("#loginScreen").hide();
			}
		});
	});
});