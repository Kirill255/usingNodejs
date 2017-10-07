$(document).ready(function() {
	$(".category-delete").click(function(e) {
		var target = e.target;
		var attr = $(target).attr("data-category-id");
		// console.log(attr);
		var scrf = $(target).attr("data-scrf");
		// console.log(scrf);
		$.ajax({
			type: "DELETE",
			url: "/blog/manage/category/delete/" + attr,
			data: {
				_csrf: scrf
			},
			success: function(response) {
				$(target).parent().parent().remove();
				alert("Category Removed");
				window.location.href = "/blog/manage/categories";
			},
			error: function(error) {
				alert(error);
				console.log(error);
			}
		});
	});

	$(".article-delete").click(function(e) {
		var target = e.target;
		var attr = $(target).attr("data-article-id");
		// console.log(attr);
		var scrf = $(target).attr("data-scrf");
		// console.log(scrf);
		$.ajax({
			type: "DELETE",
			url: "/blog/manage/article/delete/" + attr,
			data: {
				_csrf: scrf
			},
			success: function(response) {
				$(target).parent().parent().remove();
				alert("Article Removed");
				window.location.href = "/blog/manage/articles";
			},
			error: function(error) {
				alert(error);
				console.log(error);
			}
		});
	});
});