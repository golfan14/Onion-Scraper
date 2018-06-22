console.log("connected");

var saveButtons = $(".comment-save");

console.log(saveButtons);

// saveButtons.click(function(event) {
//     console.log(event.target.dataset.id);
//     var articleId = event.target.dataset.id;
//     var input = $(`#${articleId}`);
//     console.log(input.val());
//     var newComment = {
//         articleId: articleId,
//         content: input.val()
//     };
//     $.post("/comments", newComment, function(data) {
//         console.log(data);
//     })
// })




$(document).on("click", "#.comment-save", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            body: $("#article-comment-input").val()
        }
    })
    .then(function(data) {
        console.log(data); 
    })    
});

$("#article-comment-input").val("");



