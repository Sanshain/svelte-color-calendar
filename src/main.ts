import Calendar from './Calendar.svelte';


type CalendarOptions = {
	placeholder?: string,
	blank?: boolean,
	selectedDate?: Date,
	startMonth?: Date,
	endMonth?: Date,
	selectInitialDate?: false,
	onSelect?: CustomEvent<{ selectedDate: Date }>,
	weekdayValues: string[],
	shortMonthValues: string[]
};

type CalendarGenerate = (el: HTMLElement, op: CalendarOptions) => Calendar

const createCalendar: CalendarGenerate = (target: HTMLElement, {
		placeholder = '-', blank, selectedDate, startMonth, endMonth, selectInitialDate = false, onSelect, weekdayValues, shortMonthValues
	}) => new Calendar({

	target: target,
	props: {
		onSelect,
		placeholder,
		blank,
		selectedDate: selectedDate || new Date,
		startMonth,
		endMonth,
		selectInitialDate,
		shortMonthValues,
		weekdayValues
		// customWeekdayValues: new Array(7).fill(0).map((_, i) => i + 1 + ''),
		// customMonthValues: new Array(12).fill(0).map((_, i) => i + 1 + '')
	}
});

export default createCalendar;