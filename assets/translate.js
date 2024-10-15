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
let start_position;
let end_position;
let resize = false;
collapse.addEventListener('click', () =>
{
    if (Math.abs(start_position - end_position) > 10)
    {
        return;
    }
    translator.classList.toggle('hidden-translator');
});
collapse.addEventListener('mousedown', (event) =>
{
    start_position = event.pageX;
    resize = true;
});
collapse.addEventListener('touchstart', (event) =>
{
    start_position = event.pageX;
    resize = true;
});
window.addEventListener('mousemove', (event) =>
{
    if (!resize)
    {
        return;
    }
    translator.classList.add('no-transition');
    translator.setAttribute('style', `--width: ${translator.getBoundingClientRect().right - event.pageX - 10}px`);
    translator.classList.remove('no-transition');
});
collapse.addEventListener('touchmove', (event) =>
{
    if (!resize)
    {
        return;
    }
    translator.classList.add('no-transition');
    translator.setAttribute('style', `--width: ${translator.getBoundingClientRect().right - event.pageX - 10}px`);
    translator.classList.remove('no-transition');
});
collapse.addEventListener('mouseup', (event) =>
{
    end_position = event.pageX;
    resize = false;
});
collapse.addEventListener('touchend', (event) =>
{
    end_position = event.pageX;
    resize = false;
    event.preventDefault();
});

const translate_button = document.querySelector('.translator #translate-button');
const clear_button = document.querySelector('.translator #clear-button');
const input_text = document.querySelector('.translator textarea');
const translate_text = document.querySelector('.translator #translate');
const set_translate_result = (result) =>
{
    translate_text.value = result;
}
clear_button.addEventListener('click', () =>
{
    input_text.value = '';
    translate_text.value = '';
});
translate_button.addEventListener('click', () =>
{
    const text = input_text.value;
    if (text === '')
    {
        return;
    }
    translate_text.value = 'translating...';
    translate(text, set_translate_result);
});
