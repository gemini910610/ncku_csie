const get_prompt = (text, target) =>
{
    let result = '';

    const request = new XMLHttpRequest();
    request.open('get', './assets/prompt.txt', false);
    request.addEventListener('load', () =>
    {
        result = request.responseText;
    });
    request.send();

    result = result.replaceAll('{target}', target);
    result = result.replaceAll('{text}', text);

    return result;
}

const translate = (text, todo, target = 'traditional chinese') =>
{
    const prompt = get_prompt(text, target);
    const token = 'sk-Ht1jQBbbhjJQUDvR5MJC3T4A7CURmtU06yEX12LXNdxrItzd';
    let result = '';

    const request = new XMLHttpRequest();
    request.open('post', 'https://api.chatanywhere.org/v1/chat/completions');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.addEventListener('load', () =>
    {
        result = JSON.parse(request.responseText);
        todo(result.choices[0].message.content);
    })
    request.send(JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0
    }));
};

const translator = document.querySelector('.translator');
const collapse = document.querySelector('.collapse');
collapse.addEventListener('click', () =>
{
    translator.classList.toggle('hidden-translator');
});

const translate_button = document.querySelector('.translator div:not(.collapse)');
const translate_text = document.querySelector('.translator #translate');
const set_translate_result = (result) =>
{
    translate_text.value = result;
}
translate_button.addEventListener('click', () =>
{
    const text = document.querySelector('.translator textarea').value;
    if (text === '')
    {
        return;
    }
    translate_text.value = 'translating...';
    translate(text, set_translate_result);
});