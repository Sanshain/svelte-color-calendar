import Calendar from './Calendar.svelte';

type CalendarOptions = {
	placeholder?: string,
	blank?: boolean,
	selectedDate?: Date,
	startMonth?: Date,
	endMonth?: Date,
	selectInitialDate?: false,
	onSelect?: CustomEvent<{ selectedDate: Date }>
};

type CalendarGenerate = (el: HTMLElement, op: CalendarOptions) => Calendar

const createCalendar: CalendarGenerate = (target: HTMLElement, { placeholder = '-', blank, selectedDate, startMonth, endMonth, selectInitialDate = false, onSelect}) => new Calendar({
	target: target,
	props: {
		onSelect,
		placeholder,
		blank,
		selectedDate: selectedDate || new Date,
		startMonth,
		endMonth,
		selectInitialDate
	}
});

export default createCalendar;