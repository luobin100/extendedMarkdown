
$( document ).ready(function() {

    // 获得上次编辑的数据
    document.getElementById('editor').value = localStorage.editData || "" // 没有数据就设为空

    // 设置自定义 table class 需要设置  customize 的 marked renderer
    var renderer = new marked.Renderer();
    renderer.table = function (header, body) {
        return '<table class="table-bordered table-striped">'+header+body+'</table>'
    };
    // 设置代码的语法高亮显示，要用到 highlight.js 库，使用setOptions来设置。
    marked.setOptions({
        renderer: renderer,
        highlight: function (code) {
            return hljs.highlightAuto(code).value; // highlight.js 默认的变量名 hljs
        }
    });


    addButtonEvent();

    $("#btn-edit").click(function(){
        if($( this).hasClass( "selected" )){
            return false;
        }

        toggleElems();

    });
    $("#btn-preview").click(function(){
        if($( this).hasClass( "selected" )){
            return false;
        }
        extendedMarkdown($("#editor").val());

        toggleElems();

    });

    function toggleElems() {
        $("#btn-edit").toggleClass("selected");
        $("#editor").toggleClass("active");
        $("#btn-preview").toggleClass("selected");
        $("#preview").toggleClass("active");
    }
  });



function addButtonEvent(){
    $( ".expando-button" ).click(function() {
        $(this).toggleClass("expanded collapsed");
        $(this).next().filter(".origin-content").toggleClass("expanded collapsed");
    });
}

function extendedMarkdown(str){




    var arrMatched = str.match(/\$\*([\s\S]*?)\*\$/g);

    // 如果没有需要 extend 的内容，直接 parse markdown
    if (!arrMatched){
        marked.setOptions({gfm: true});
        document.getElementById('preview').innerHTML =
            marked($("#editor").val());

        return;
    }

    var objArr = [];
    var editorVal = $("#editor").val()

    // replace extended contents to uids
    arrMatched.forEach(element => {
        var uid =  moment().format('YYYY_MM_DD_HHmmss.SSS') + '_' + Math.random().toString();
        var innerText = element.replace(/(\$\*)|(\*\$)/g,'');

        objArr.push({
            orgin: element,
            uid: uid,
            innerText: innerText
        });
        // // 要当作 Regex 来用，所以 要加上转义字符 \$\*
        // elementRegex = element.replace(/\$\*/g, "\\$\\*").replace(/\*\$/g, "\\*\\$")
        // // .
        // //                     // 所有的其他正则表达式使用的字符都要转义
        // //                     replace(/\./g, "\\.").
        // //                     replace(/\*/g, "\\*").
        // //                     replace(/\^/g, "\\^").
        // //                     replace(/\$/g, "\\$").
        // //                     replace(/\\/g, "\\\\").
        // //                     replace(/\(/g, "\\(").replace(/\)/g, "\\)").
        // //                     replace(/\[/g, "\\[").replace(/\]/g, "\\]").
        // //                     replace(/\{/g, "\\{").replace(/\}/g, "\\}")
        // var re = new RegExp(elementRegex,"g");
        // console.log("start-------------",editorVal);
        // // 就算有两个以上完全一样的内容也没关系，原来是重复的，我等下再replace回来也还是一样的，内容不会变。
        // editorVal = editorVal.replace(re,uid);
        // console.log("end-------------",editorVal);
        //

        // 用 split + join 代替 replace
        // 这种方法可以不用 regular expression
        editorVal = editorVal.split(element).join(uid);

    });
    console.log(objArr);
    var resultHtml = marked(editorVal);


    // replace uids to extended contents
    objArr.forEach(element => {

        var strHtml = `<span class="expando-button crosspost collapsed"></span>
                    <textarea rows="3" cols="70" class="origin-content collapsed">${element.innerText}</textarea>`;
        // var re = new RegExp(element.uid,"g");
        // resultHtml = resultHtml.replace(re, strHtml);
        resultHtml = resultHtml.split(element.uid).join(strHtml);

    });
    document.getElementById('preview').innerHTML = resultHtml;

    // 为 expando-button 增加click事件
    addButtonEvent();


}

// 退出前保存编辑数据，保存到 localStorage
window.onbeforeunload = function(){
    localStorage.editData = document.getElementById('editor').value
}
