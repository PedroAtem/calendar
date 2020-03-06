const MONTHS_SHORT_NAME = [
	'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
	'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];
const MONTHS_FULL_NAME = [
	'Janeiro', 'Fevereiro', 'Março', 'Abril',
	'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
	'Outubro', 'Novembro', 'Dezembro'];

const elements = {
	quoteCalendarContainer: null,
	quoteCalendar: null,
	quoteCalendarClose: null,
	quoteCalendarYear: null,
	quoteCalendarMonths: null,
	quoteCalendarDivider: null,
	quoteCalendarWeek: null,
	quoteCalendarDays: null
}

const actions = {
	clickMonth: null
}

const openCalendar = ({ dates, quotes, currentDate, clickMonth }) => {
	actions.clickMonth = clickMonth;
	drawCalendar(dates, quotes, currentDate, false);
}

const updateCalendar = ({ dates, quotes, currentDate }) => {
	drawCalendar(dates, quotes, currentDate, true);
}

const closeCalendar = event => {
	if (event.target.getAttribute('can-close')) {
		elements.quoteCalendarContainer.remove();
	}
}

const drawCalendar = (dates, quotes, currentDate, update) => {
	if (!update) {
		elements.quoteCalendarContainer = createQuoteCalendarContainer();
		elements.quoteCalendar = createQuoteCalendar();
		elements.quoteCalendarClose = createQuoteCalendarClose();
		elements.quoteCalendarYear = createQuoteCalendarYear();
		elements.quoteCalendarMonths = createQuoteCalendarMonths();
		elements.quoteCalendarDivider = createQuoteCalendarDivider();
		elements.quoteCalendarWeek = createQuoteCalendarWeek();
		elements.quoteCalendarDays = createQuoteCalendarDays();
		elements.quoteCalendarContainer.onclick = event => closeCalendar(event);
		['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'].forEach(day =>
			elements.quoteCalendarWeek.append(createQuoteCalendarWeekday(day))
		);
		elements.quoteCalendar.append(elements.quoteCalendarClose);
		elements.quoteCalendar.append(elements.quoteCalendarYear);
		elements.quoteCalendar.append(elements.quoteCalendarMonths);
		elements.quoteCalendar.append(elements.quoteCalendarDivider);
		elements.quoteCalendar.append(elements.quoteCalendarWeek);
		elements.quoteCalendar.append(elements.quoteCalendarDays);
		elements.quoteCalendarContainer.append(elements.quoteCalendar);
		document.querySelector("body").append(elements.quoteCalendarContainer);
	} else {
		while (elements.quoteCalendarMonths.children.length) {
			elements.quoteCalendarMonths.children.item(0).remove();
		}
		while (elements.quoteCalendarDays.children.length) {
			elements.quoteCalendarDays.children.item(0).remove();
		}
	}

	elements.quoteCalendarYear.innerText = currentDate[0];
	dates.forEach(([year, month]) => {
		const monthName = dates.length > 1 ? MONTHS_SHORT_NAME[month - 1] : MONTHS_FULL_NAME[month - 1];
		const monthElement = createQuoteCalendarMonth(monthName, month !== currentDate[1]);
		monthElement.onclick = () => actions.clickMonth([year, month]);
		elements.quoteCalendarMonths.append(monthElement);
	});
	const days = getDaysList(currentDate, quotes);
	days.forEach(({ day, value }) => elements.quoteCalendarDays.append(createQuoteCalendarDay(day, value)));
}

const getDaysList = ([year, month], quotes) => {
	const firstDayOfMonth = new Date(`${year}-${month}-01 10:00:00`);
	const lastDayOfMonth = new Date();
	lastDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1);
	lastDayOfMonth.setDate(firstDayOfMonth.getDate() - 1);
	const days = [];
	for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
		days.push({
			day: null,
			value: null
		});
	}
	for (let day = firstDayOfMonth.getDate(); day <= lastDayOfMonth.getDate(); day++) {
		let value = null;
		const checkValue = quotes.find(quote => {
			const yearQuote = Number(quote.date.split('-')[0]);
			const monthQuote = Number(quote.date.split('-')[1]);
			const dayQuote = Number(quote.date.split('-')[2]);
			return yearQuote === year && monthQuote === month && dayQuote === day;
		})
		if (checkValue) {
			value = checkValue.quote;
		}
		days.push({ day, value });
	}
	return days;
}

// ELEMENTS
const createQuoteCalendarContainer = () => {
    const element = document.createElement('div');
    element.style.background = 'rgba(255, 255, 255, 0.5)';
    element.style.position = 'fixed';
    element.style.zIndex = '1';
    element.style.top = '0';
    element.style.bottom = '0';
    element.style.left = '0';
    element.style.right = '0';
    element.style.display = 'flex';
    element.style.justifyContent = 'center';
	element.style.alignItems = 'center';
	element.setAttribute('can-close', true);
    return element;
}

const createQuoteCalendar = () => {
    const element = document.createElement('div');
    element.style.display = 'flex';
    element.style.flexDirection = 'column';
    element.style.width = '70%';
    element.style.height = '70%';
    element.style.backgroundColor = '#f6f6f6';
    element.style.border = '1px solid gray';
    return element;
}

const createQuoteCalendarClose = () => {
    const element = document.createElement('div');
    element.innerHTML = 'X';
    element.style.fontSize = '30px';
    element.style.width = '30px';
    element.style.height = '30px';
    element.style.fontWeight = 'normal';
    element.style.textAlign = 'center';
    element.style.color = 'rgb(25, 173, 71)';
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.cursor = 'pointer';
    element.style.userSelect = 'none';
    element.style.alignSelf = 'flex-end';
	element.style.marginBottom = '-30px';
	element.style.zIndex = '1';
	element.setAttribute('can-close', true);
    return element;
}

const createQuoteCalendarYear = year => {
    const element = document.createElement('div');
    element.style.width = '100%';
    element.style.fontSize = '40px';
    element.style.fontWeight = 'bold';
    element.style.textAlign = 'center';
	element.style.color = '#4a4b4a';
	element.style.userSelect = 'none';
    return element;
}

const createQuoteCalendarMonths = () => {
	const element = document.createElement('div');
	element.style.width = '100%';
	element.style.height = '50px';
	element.style.display = 'flex';
	element.style.justifyContent = 'center';
	element.style.alignItems = 'center';
    return element;
}

const createQuoteCalendarMonth = (month, disabled) => {
	const element = document.createElement('div');
	element.innerText = month;
	element.style.fontSize = '20px';
	element.style.fontWeight = 'bold';
	element.style.textAlign = 'center';
	element.style.color = '#4a4b4a';
	element.style.margin = '0px 5px';
	element.style.userSelect = 'none';
	element.style.cursor = 'pointer';
	if (disabled) {
		element.style.opacity = '0.2';
	}
    return element;
}

const createQuoteCalendarDivider = () => {
	const element = document.createElement('div');
	element.width = '80%';
	element.margin = '0px 10%';
	element.height = '1px';
	element.boxSizing = 'border-box';
	element.background = '#979797';
    return element;
}

const createQuoteCalendarWeek = () => {
	const element = document.createElement('div');
	element.style.display = 'flex';
	element.style.width = '80%';
	element.style.margin = '10px 10%';
	element.style.justifyContent = 'space-around';
	element.style.alignItems = 'center';
	return element;
}

const createQuoteCalendarWeekday = day => {
	const element = document.createElement('div');
	element.innerText = day;
	element.style.fontSize = '15px';
	element.style.fontWeight = 'bold';
	element.style.color = '#4a4b4a';
	element.style.userSelect = 'none';
    return element;
}

const createQuoteCalendarDays = () => {
	const element = document.createElement('div');
	element.style.display = 'flex';
	element.style.width = '80%';
	element.style.margin = '10px 10%';
	element.style.flexWrap = 'wrap';
	element.style.flexGrow = '1';
    return element;
}

const createQuoteCalendarDay = (number = '', value = false) => {
	const element = document.createElement('div');
	element.style.width = 'calc(100% / 7)';
	element.style.cursor = 'pointer';
	element.style.userSelect = 'none';
	const numberElement = document.createElement('div');
	numberElement.innerText = number;
	numberElement.style.fontWeight = 'bold';
	numberElement.style.fontSize = '19px';
	numberElement.style.color = '#4a4b4a';
	const valueElement = document.createElement('div');
	valueElement.style.fontWeight = 'bold';
	valueElement.style.fontSize = '11px';
	valueElement.style.color = '#4a4b4a';
	if (value) {
		valueElement.innerText = value;
	} else {
		element.style.opacity = '0.2';
	}
	element.append(numberElement);
	element.append(valueElement);
    return element;
}