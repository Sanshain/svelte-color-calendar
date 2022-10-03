<script lang="ts">
    import { onMount } from "svelte";
	//@ts-ignore
	import Calendar from "corrected-color-calendar";	
	// import Calendar from "color-calendar";	
	// import Calendar from "../sub_modules/color-calendar/dist/bundle.cjs";
	// import * as Calendar from "../sub_modules/color-calendar/dist/bundle.cjs";


	// import "./theme-glass.css"
	// import "./theme-basic.css"
	import "../sub_modules/color-calendar/dist/css/theme-basic.css"

	import { createEventDispatcher } from 'svelte';

	
	// export let name: string = '';
	export let placeholder: string = '-';
	export let selectedDate: Date = null;
	/**
	 * @description opened flag
	 */
	export let opened = false;
	/**
	 * @description is empty template. else on empty selectedDate will automatic established today date
	 */
	export let blank: boolean = true;
	/**
	 * @example: new Date(2021, 11)
	 */	
	export let startMonth: Date = null;
	/**
	 * @example: new Date(2022, 11)
	 */
	export let endMonth: Date = null;
	export let selectInitialDate = true;

	export let onSelect = null;
	

	$: value = blank ? placeholder : (selectedDate ? selectedDate.toLocaleDateString() : '');
	
	let calendar = null;
	let monthChanged = false;
	let inited = false;

	const dispatch = createEventDispatcher();

	onMount(() => {		
		
		calendar = new Calendar({
			id: "#calendar",
			calendarSize: "small",
			currentDate: selectedDate || new Date(),
			startMonth,
			endMonth,
			selectInitialDate,
			// eventsData:[
			// 	{
			// 		start: '2022-09-17T06:00:00',
			// 		end: '2022-09-18T20:30:00',
			// 		name: 'Blockchain 101'
			// 	}
			// ],
			dateChanged: (currentDate?: Date, filteredDateEvents?: object[]) => {
				
				if (monthChanged) return monthChanged = false;

				if (opened) blank = false;

				selectedDate = currentDate;												
				opened = false;
				
				onSelect && onSelect(currentDate)
				dispatch('select', {
					selectedDate
				})
			},
			monthChanged: (currentDate?: Date, filteredDateEvents?: object[]) => {				

				if (inited) monthChanged = true;
				else{
					inited = true;					
				}				
			},
			selectedDateClicked: (currentDate?: Date, filteredDateEvents?: object[]) => {}			
		});
		
	})
</script>

<div class="container">
	<!-- <input type="text" {name} {placeholder} bind:value={value} /> -->
	<div class="input" on:click={() => opened = !opened}>{value || placeholder}</div>	
	<div id="calendar" class:opened></div>
</div>

<style lang="less">
	.container {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;		
	}
	.input{
		border:1px solid gray;
		text-align: left;
		padding: 2px 0.5em;
		border-radius: 0.5em;	
		min-height: 1.5em;
		cursor: pointer;
	}
	#calendar{
		display: none;			
	}
	// .input:focus{
	// 	box-shadow: 0 0 5px #999;
	// }
	.opened{
		display: block !important;		
	}

	#calendar :global(.calendar__day-today>.calendar__day-box){
		--today-color-primary: #999 !important;
	}	

	//@ change today style:
	#calendar :global(.calendar__day-today>.calendar__day-box){		
		background-color: #999 !important;
		background-color: var(--today-color-primary) !important;
		box-shadow: 0 3px 15px -5px #999 !important;
		box-shadow: 0 3px 15px -5px var(--today-color-primary) !important;
		transition: .2s;
	}


	//@ change today hover:

	// #calendar :global(.calendar__day-today:hover>.calendar__day-box){
	// 	background-color: lightgray !important;
	// }
	// #calendar :global(.calendar__day-today:hover>.calendar__day-text){	
	// 	color: black !important;
	// }

	
	//@ change selected style:

	// #calendar :global(.calendar__day-selected:not(.calendar__day-today)>.calendar__day-box){
	// 	background-color: black !important;
	// }

</style>