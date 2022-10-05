
# svelte-color-calendar

Простой, легко интегрируемый в любой фреймворк календарь с минимальным рантаймом. Без использования jquery и bootstrap

![image](https://user-images.githubusercontent.com/40761960/194060853-0b4745c3-663b-42a4-ba5d-05174f2a033a.png)

## Особенности:

Под капотом используется улучшенный форк color-calendar, написанный когда-то Pawan Kolhe

Особенностью этого календаря является:
- Возможность ограничения выбора дат по месяцам
- Небольшой размер - 23,1 КБ (уменьшенный)
- Простая интеграция с любым фреймворком

## Установка:

```
npm i svelte-color-calendar
```

Или

```html
<script src="https://unpkg.com/svelte-color-calendar@latest/public/build/bundle.js"></script>
<link rel="stylesheet" href="https://unpkg.com/svelte-color-calendar@latest/public/build/bundle.css">
```

## Использование: 

### Svelte:

```html
<script>
    import Calendar from 'svelte-color-calendar';

    let selectedDate = new Date;
    const select = (event) => console.log(event.detail.selectedDate)
</script>

<Calendar bind:selectedDate blank={true} startMonth={new Date(2021, 11)} endMonth={new Date(2022, 11)} on:select={select} />
```

### ES Modules:

```js
import Calendar from 'svelte-color-calendar';

const app = new Calendar({
    target: document.body,
    props: {
        placeholder: '-',
        blank: false,
        selectedDate: new Date,        
        startMonth: new Date(2021, 11),
        endMonth: new Date(2022, 11),
        onSelect: date => console.log(date)
    }
});

export default app;
```


Предварительно:
import { h } from 'preact';
import { render } from 'preact';
import { useState, useEffect, useRef } from "preact/hooks";
import Calendar from 'svelte-color-calendar';

const App =  () => {

    const inputContainer = useRef(null);
    let [date, setDate] = useState('');

    useEffect(() => {
                                       
        let widget = new Calendar({
            target: inputContainer.current,
            props: {
                blank: false,
                selectedDate: new Date,        
                onSelect: e => setDate(e.detail.selectedDate)
            }
        })        
        return () => {};
    }, []);    

    return <div className="App">        
        <div ref={inputContainer}></div>
        <b>{date}</b>        
    </div>
};

render(<App />, document.body);
Ваниль (эсм):
import Calendar from 'svelte-color-calendar';

const app = new Calendar({
    target: document.body,
    props: {
        placeholder: '-',
        blank: false,
        selectedDate: new Date,        
        startMonth: new Date(2021, 11),
        endMonth: new Date(2022, 11),
        onSelect: date => console.log(date)
    }
});

export default app;
Ваниль:
Посмотрите демо

Опции
выбраннаяДата
selectedDate?: Date = new Date- выбранная дата. По умолчанию используется сегодня

пустой
blank?: boolean = true- использовать для пустого начального значения. Для достижения желаемого эффекта используйтеselectInitialDate: false

выберитеInitialDate
selectInitialDate?: false- показать или скрыть текущую дату перед выбором (по умолчанию сегодня или первый день месяца будут неявно выделены как текущие до выбора пользователя)

заполнитель
placeholder?: string = '-'- действует только с blank = true- иначе будет отображаться текущая дата

startMonth
startMonth?: Date- дата начала месяца допустимого выбора

конец месяца
endMonth?: Date- дата окончания месяца допустимого выбора

onSelect
onSelect?: (date: Date) => void- обратный вызов срабатывает, когда пользователь выбирает дату

ShortMonthValues
shortMonthValues?: string[] = null- список коротких названий месяцев

день неделиЗначения
weekdayValues?: string[] = null- список названий дней недели

