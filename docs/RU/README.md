
# svelte-color-calendar

Простой, легко интегрируемый в любой фреймворк календарь с минимальным рантаймом. Без использования jquery и bootstrap

![image](https://user-images.githubusercontent.com/40761960/194060853-0b4745c3-663b-42a4-ba5d-05174f2a033a.png)

## Особенности:

Под капотом используется улучшенный форк color-calendar, написанный когда-то Pawan Kolhe

Особенностью этого календаря является:
- Возможность ограничения выбора дат по месяцам
- Относительно небольшой размер - 25 KB *(для Svelte проекта)* или 27.8 КБ *(в umd/esm формат)*
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


### React:

```jsx
import { useEffect, useRef, useState } from "react";
import Calendar from "svelte-color-calendar";

export default function App() {
  const inputContainer = useRef(null);
  let [date, setDate] = useState("?");
  const isRunned = useRef(false);

  useEffect(() => {
    if (!isRunned.current) isRunned.current = true;
    else {
      new Calendar({
        target: inputContainer.current,
        props: {
          blank: false,
          selectedDate: new Date(),
          onSelect: (date) => setDate(date.toLocaleDateString())
        }
      });
    }

    return () => {};
  }, []);

  return (
    <div>
      <h1>Date:</h1>
      <div ref={inputContainer}></div>
      <b>{date}</b>
    </div>
  );
}
```

Рабочий пример с [React 17](https://coding-style.ru/code_reviews/315/edit?compiler=html) и [18](https://codesandbox.io/s/stupefied-yonath-9u7h4x?file=/src/App.js)


### Чистый javascript 

- C модулями:

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


## Опции

`selectedDate?: Date = new Date` - выбранная дата. По умолчанию используется сегодня

`blank?: boolean = true` - использовать для пустого начального значения. Для достижения желаемого эффекта используйтеselectInitialDate: false

`selectInitialDate?: false` - показать или скрыть текущую дату перед выбором (по умолчанию сегодня или первый день месяца будут неявно выделены как текущие до выбора пользователя)

`placeholder?: string = '-'` - действует только с blank = true- иначе будет отображаться текущая дата

`startMonth?: Date` - дата начала месяца допустимого выбора

`endMonth?: Date` - дата окончания месяца допустимого выбора

`onSelect?: (date: Date) => void` - обратный вызов срабатывает, когда пользователь выбирает дату

`shortMonthValues?: string[] = null` - список коротких названий месяцев

`weekdayValues?: string[] = null` - список названий дней недели


# Обзор 

Таблица сравнения возможностей с популярными календарями svelte:

Календарь                                                                       | размер бандла       | возможность ограничения в выборе дат | выбор диапазона 
-|-|-|-
**[svelte-color-calendar](https://github.com/Sanshain/svelte-color-calendar)**  | 25 кб               | по месяцам                           | -          |
[sve-calendar](https://github.com/Sanshain/sve-calendar/tree/sv-calendar)       | 31 кб               | по дням                              | -          |
[svelte-calendar](https://github.com/6eDesign/svelte-calendar)                  | 45 кб               | по дням                              | -          |
[svelte-flatpickr](https://github.com/jacobmischka/svelte-flatpickr)            | 51 кб               | по дням                              | *есть \**  |
[svelte-datepicker](https://github.com/andrew-secret/svelte-datepicker)         | 27 кб *+123 кб\*\** | по дням                              | -          |
[svelte-mui/Datepicker](https://svelte-mui.vercel.app/datepicker)               | 48 кб               | -                                    | -          |
**Прочие**:
[react-calendar](https://github.com/wojtekmaj/react-calendar)                   | 57 кб *+18 кб\*\**  | по дням                              | есть       |
[react-date-range](https://www.npmjs.com/package/react-date-range)              | 78 кб *+18 кб\*\**  | по дням                              | есть       |
[rc-calendar](https://github.com/wojtekmaj/react-calendar)                      | 331 кб *+18 кб\*\** | ?                                    | ?          |
[v-calendar](https://github.com/nathanreyes/v-calendar)                         | 206 кб *+95 кб\*\** | по дням                              | есть       |

- \* - у svelte-flatpickr выбор диапазона доступен только в пределах одного месяца
- \*\* - требуют для своей работы установки дополнительных пакетов



