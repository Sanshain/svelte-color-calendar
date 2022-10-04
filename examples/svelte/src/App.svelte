<script lang="ts">	
    // import Calendar from 'svelte-color-calendar/src/Calendar.svelte';	
    // import Calendar from 'svelte-color-calendar/';
    import Calendar from 'svelte-color-calendar/';	    

    let selectedDate = new Date;
    const select = (event) => console.log(event.detail.selectedDate)
</script>

<Calendar bind:selectedDate blank={true} startMonth={new Date(2021, 11)} endMonth={new Date(2022, 11)} on:select={select} />