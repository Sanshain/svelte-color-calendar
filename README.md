# svelte-color-calendar

Ready to production calendar with the possibility of limiting the choice of dates by month

![image](https://user-images.githubusercontent.com/40761960/193658651-e4c5aa5b-6b91-4c79-be45-0a93d2712b38.png)


## Features:

- An improved [color-calendar](https://github.com/PawanKolhe/color-calendar) is used under the hood 
- Possibility of limiting the choice of dates by month
- Easy integration with any framework

## Installation

```sh
npm i svelte-color-calendar
```

## Usage

- [Svelte](https://github.com/Sanshain/svelte-color-calendar/edit/master/README.md#svelte)
- [Preact](https://github.com/Sanshain/svelte-color-calendar/edit/master/README.md#preact)
- [Vanila](https://github.com/Sanshain/svelte-color-calendar/edit/master/README.md#vanila-esm)

### Svelte:

```html

<script>
    import Calendar from 'svelte-color-calendar';

    let selectedDate = new Date;
    const select = (event) => console.log(event.detail.selectedDate)
</script>

<Calendar bind:selectedDate blank={true} startMonth={new Date(2021, 11)} endMonth={new Date(2022, 11)} on:select={select} />
```

### Preact:

```jsx
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
```

### Vanila (esm):

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
        onSelect: e => console.log(e.detail.selectedDate)
    }
});

export default app;
```
