import Calendar from './Calendar.svelte';

const app = new Calendar({
	target: document.body,
	props: {
		placeholder: '-',
		blank: false,
		selectedDate: new Date,		
		startMonth: new Date(2021, 11),
		endMonth: new Date(2022, 11),
		// selectInitialDate: false
	}
});

export default app;