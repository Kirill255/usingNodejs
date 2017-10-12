// для todo
$(document).ready(function() {
	// удалить
	$(".delete-task").on("click", function(e) {
		e.preventDefault();
		var target = e.target;
		var attr = $(target).attr("data-deltask-id");
		var scrf = $(target).attr("data-scrf");
		// console.log(attr);
		$.ajax({
			type: "DELETE",
			url: "/todo/delete/" + attr,
			data: {
				_csrf: scrf
			},
			success: function(response) {
				$(target).parent().parent().remove();
				window.location.href = "/todo";
			},
			error: function(error) {
				alert(error);
				console.log(error);
			}
		});
	});

	// изменить выполнена/не выполнена
	$(".checkBox").on("click", function(e) {
		var target = e.target;
		var attr = $(target).attr("data-checktask-id");
		var chek = $(target).attr("checked");
		var flag = 0; // тут мы берём объявляем переменную со значением 0 типа false, тоесть не выполнено
		if (chek) { // в атрибуте у нас стоит если checked, то checked, а если не checked, то undefined, поэтому это условие сработает только если атрибут checked есть
			flag = 1; // если checked, тогда нам нужен флаг 1, что типа true, инчае останется 0, типа false - не выполнена
		}
		// console.log(flag);
		// console.log(chek);
		$.ajax({
			type: "POST",
			url: "/todo/done/" + attr,
			data: {
				checked: flag
			},
			success: function(response) {
				window.location.href = "/todo";
			},
			error: function(error) {
				alert(error);
				console.log(error);
			}
		});
	});

	// показать спрятанное модальное окно редактирования таски
	// $(".edit-task").on("click", function(e) {
	// 	e.preventDefault();
	// 	var target = e.target;
	// 	var attr = $(target).attr("data-edittask-id");
	// 	var scrf = $(target).attr("data-scrf");
	// 	console.log(attr);
	// 	$("#popup-edit").toggleClass("hide");
	// });

	// редактирование задачи
	$(".edit-task").on("click", function(e) { // при нажатии накнопку редактирования
		e.preventDefault();
		var target = e.target;
		var attr = $(target).attr("data-edittask-id"); // определяем на какую именно кнопку м нажали, по совместительству в data-edittask-id хранится id задачи из базы данных
		var scrf = $(target).attr("data-scrf");
		console.log(attr);
		var modal = $(".modal"); //закешируем чтобы тратить меньше ресурсов
		modal.modal('show'); // показываем наше popup-окно
		$.ajax({ // и делаем запрос в базу
			type: "GET",
			url: "/todo/edit/" + attr,
			success: function(response) { // получаем из базы ответ с данными о задаче, её title, describe, и сё остальное что хранится в базе согласно нашей таблице(схеме) в базе данных
				var response = response[0]; // нам приходит массив(да из одного элемента, но массив), поэтому берём первый элемент
				// console.log(response.Title);
				modal.find("input[name='title']").val(response.Title); // заполняем наше popup-окно данными именно этой задачи для редактирования, находим в нашем модальном окне input и в качесте значения передём ему response.Title
				modal.find("textarea[name='describe']").val(response.Describe);
				var btnSave = modal.find("button.save-task"); // находим кнопку save
				btnSave.on("click", function(e){ // при сохранении данных
					var title = modal.find("input[name='title']").val(); // берём новые значения из полей
					var describe = modal.find("textarea[name='describe']").val();
					$.ajax({ // отправляем на свервер все данные, на серевере уже идёт запрос в базу и сохраняет
						type: "POST",
						url: "/todo/edit/" + attr,
						data: {
							title: title,
							describe: describe
						},
						success: function(response) {
							// console.log("ok2");
							window.location.href = "/todo";
						},
						error: function(error) {
							alert(error);
							console.log(error);
						}
					});
				});
				
			},
			error: function(error) {
				alert(error);
				console.log(error);
			}
		});
	});
});