
$( document ).ready(function() {


    var renderer = new marked.Renderer();
    // marked 需要自己给table加样式
    renderer.table = function (header, body) {
        return '<table class="table-bordered table-striped">'+header+body+'</table>'
    };


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
        $(this).parent().children(".origin-content").toggleClass("expanded collapsed");
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
        // 要当作 Regex 来用，所以 要加上转义字符 \$\*
        elementRegex = element.replace(/\$\*/g, "\\$\\*").replace(/\*\$/g, "\\*\\$")
        var re = new RegExp(elementRegex,"g");

        // 就算有两个以上完全一样的内容也没关系，原来是重复的，我等下再replace回来也还是一样的，内容不会变。
        editorVal = editorVal.replace(re,uid)


    });
    console.log(objArr);
    var resultHtml = marked(editorVal);


    // replace uids to extended contents
    objArr.forEach(element => {

        var strHtml = `<span class="expando-button crosspost collapsed"></span>
                    <textarea rows="3" cols="70" class="origin-content collapsed">${element.innerText}</textarea>`;
    var re = new RegExp(element.uid,"g");
    resultHtml = resultHtml.replace(re, strHtml);

    });
    document.getElementById('preview').innerHTML = resultHtml;

    // 为 expando-button 增加click事件
    addButtonEvent();


}