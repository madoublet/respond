// poll js
var poll = {
		
	init:function(){

		$('.take-poll').show();
		$('.poll-results').hide();

		$('.plugin-poll').find('button').click(function(){

			var id = $(this).parents('.plugin-poll').attr('data-id');
			var answer = '';

			var selected = $("input[type='radio'][name='"+id+"']:checked");
			if (selected.length > 0)answer = selected.val();

			if(answer=='')return;

			var url = siteroot+'plugins/poll/poll.php';

			$.post(url, {
				ajax: 'poll.save',
				id: id,
				answer: answer
			}, function(data){

				var total = data.option1+data.option2+data.option3+data.option4+data.option5;

				$('#'+id+' .total').text(total);

				if($('#'+id).find('.result-option1')){
					var percent = ((data.option1/total)*100).toFixed(2);

					$('#'+id + ' .result-option1').find('.progress-percent').text(percent);
					$('#'+id + ' .result-option1').find('.progress-count').text(data.option1);
					$('#'+id + ' .result-option1').find('.bar').css('width', percent + '%');
				}

				if($('#'+id).find('.result-option2')){
					var percent = ((data.option2/total)*100).toFixed(2);

					$('#'+id + ' .result-option2').find('.progress-percent').text(percent);
					$('#'+id + ' .result-option2').find('.progress-count').text(data.option1);
					$('#'+id + ' .result-option2').find('.bar').css('width', percent + '%');
				}

				$('#'+id).find('.take-poll').hide();
				$('#'+id).find('.poll-results').show();

			
			}, 'json');

		});

	}
}

$(document).ready(function(){poll.init();});
