window.onsubmit = () => {

    let question = document.getElementById("question").value;

    if(question.length < 4){
        alert("Did you even ask a question???");
        return false;
    }

    return confirm('Are you sure you want to ask this question to the genie?');

}