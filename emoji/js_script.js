// Import emoji data
let emoji_data = {};
let emoji_tag = {};
d3.json('openmoji.json').then(function(data){
    for (var key in data){
        emoji_data[key] = {"emoji" : data[key]["emoji"],
        "tags" : data[key]["annotation"]};
        emoji_tag = {}
    }
    // emoji_data = data;

});
let stopwords;

// Import stop words
fetch('/terrier.txt').then(r => r.text()).then(data=> {
    stopwords = data.split("\n");
});

function Find_emoji() {
    let txt_input = document.getElementById("txt_to_conv").value;
    document.getElementById("orig_txt").innerHTML = txt_input
    const txt_str = txt_input.split(" ");
    let output_data = document.getElementById("emoji_txt");
    let check = 0;
    const emojified = [];
    for (var word in txt_str){
        if (stopwords.includes(txt_str[word].toLowerCase())){
            emojified.push(txt_str[word]);
            check = 1;
        } else {
            for (var emoji_key in emoji_data){
                if (emoji_data[emoji_key]["tags"].toLowerCase().includes(txt_str[word].toLowerCase().concat(" ")) || emoji_data[emoji_key]["tags"].toLowerCase().includes(" ".concat(txt_str[word].toLowerCase()))){
                    emojified.push(emoji_data[emoji_key]["emoji"]);
                    check = 1;
                    break;
                } 
                else if (emoji_data[emoji_key]["tags"].toLowerCase().includes(txt_str[word].toLowerCase())){
                    emojified.push(emoji_data[emoji_key]["emoji"]);
                    check = 1;
                    break;
                }
            }
        }
        if (check == 0){
            emojified.push(txt_str[word]);
            check = 0;
        } else {
            check = 0;
        }
    }
    output_data.innerHTML = emojified.join(" ");

    $('#emoji_txt').each(function() {
        $(this).html($(this).text().replace(/\b(\w+)\b/g, "<span>$1</span>"))
        // $(this).html($(this).text().replace(/\b(\W+)\b/g, "<span>$1</span>"))
    });

    $('#orig_txt').each(function() {
        $(this).html($(this).text().replace(/\b(\w+)\b/g, "<span>$1</span>"))
    });

    $('#emoji_txt span').hover(
        function() {
            $(this).addClass('highlight');
            // alert(txt_str[emojified.indexOf($(this).html())]);
            let pattern = new RegExp("("+txt_str[emojified.indexOf($(this).html())]+")", "gi");
            let src_str = txt_input;
            src_str = src_str.replace(pattern, "<mark>$1</mark>");
            src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");

            // let hl_str = txt_str;
            // hl_str[emojified.indexOf($(this).html())] = "<span>".concat(hl_str[emojified.indexOf($(this).html())],"</span>");

            // $("#orig_txt").html(hl_str.join(" "));
            $("#orig_txt").html(src_str);
            // alert(emojified.indexOf($(this).html()));
            // $('#orig_txt span')[emojified.indexOf($(this).html())].addClass('highlight');
            // alert($('#orig_txt span').get(1).html());
            // $('#orig_txt span').get(1).addClass('highlight');
        },
        function() {
            $(this).removeClass('highlight');
            $("#orig_txt").html(txt_input);
        }
    );
    
};


