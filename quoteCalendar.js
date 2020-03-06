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
	quoteCalendarDays: null,
	quoteCalendarLoading: null
}

const actions = {
	clickMonth: null
}

const initCalendar = (months, clickMonth) => {
	createCalendar();
	drawMonths(months, clickMonth);
};

const openCalendar = ({ quotes, currentDate }) => {
	actions.clickMonth = clickMonth;
	drawCalendar();
	setYear(currentDate.year);
	setCurrentMonth(currentDate);
	drawDays(quotes, currentDate);
}

const updateCalendar = ({ dates, quotes, currentDate }) => {
	drawCalendar(dates, quotes, currentDate, true);
}

const closeCalendar = event => {
	if (event.target.getAttribute('can-close')) {
		elements.quoteCalendarContainer.remove();
	}
}

const createCalendar = () => {
	elements.quoteCalendarContainer = createQuoteCalendarContainer();
	elements.quoteCalendar = createQuoteCalendar();
	elements.quoteCalendarClose = createQuoteCalendarClose();
	elements.quoteCalendarYear = createQuoteCalendarYear();
	elements.quoteCalendarMonths = createQuoteCalendarMonths();
	elements.quoteCalendarDivider = createQuoteCalendarDivider();
	elements.quoteCalendarWeek = createQuoteCalendarWeek();
	elements.quoteCalendarDays = createQuoteCalendarDays();
	elements.quoteCalendarLoading = createQuoteCalendarLoading();
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
	elements.quoteCalendar.append(elements.quoteCalendarLoading);
	elements.quoteCalendarContainer.append(elements.quoteCalendar);
}

const getDaysList = ({ year, month }, quotes) => {
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

/**
 * -----------------------------------------
 * 
 * SET FUNCTIONS
 * 
 * -----------------------------------------
 */
const setYear = year => {
	elements.quoteCalendarYear.innerText = year;
}

const setCurrentMonth = currentDate => {
	for (const element of elements.quoteCalendarMonths.children) {
		const month = Number(element.getAttribute('quote-calendar-month'));
		const year = Number(element.getAttribute('quote-calendar-year'));
		if (currentDate.month === month && currentDate.year === year) {
			element.style.opacity = '1';
		} else {
			element.style.opacity = '0.2';
		}
	}
}

const showLoading = () => {
	elements.quoteCalendarLoading.style.display = 'flex';
	elements.quoteCalendarDays.style.display = 'none';
}

const hideLoading = () => {
	elements.quoteCalendarLoading.style.display = 'none';
	elements.quoteCalendarDays.style.display = 'flex';
}

/**
 * -----------------------------------------
 * 
 * DRAW FUNCTIONS
 * 
 * -----------------------------------------
 */
const drawMonths = (months, clickMonth) => {
	while (elements.quoteCalendarMonths.children.length) {
		elements.quoteCalendarMonths.children.item(0).remove();
	}
	months.forEach((month) => {
		const monthElement = createQuoteCalendarMonth(month, months.length > 1, true);
		monthElement.onclick = () => clickMonth(month);
		elements.quoteCalendarMonths.append(monthElement);
	});
}

const drawDays = (quotes, currentDate) => {
	while (elements.quoteCalendarDays.children.length) {
		elements.quoteCalendarDays.children.item(0).remove();
	}
	const days = getDaysList(currentDate, quotes);
	days.forEach(({ day, value }) => elements.quoteCalendarDays.append(createQuoteCalendarDay(day, value)));
}

const drawCalendar = () => {
	document.querySelector("body").append(elements.quoteCalendarContainer);
}

/**
 * -----------------------------------------
 * 
 * CREATE ELEMENTS
 * 
 * -----------------------------------------
 */
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

const createQuoteCalendarMonth = (month, full, disabled) => {
	const element = document.createElement('div');
	const monthName = full ? MONTHS_SHORT_NAME[month.month - 1] : MONTHS_FULL_NAME[month.month - 1];
	element.innerText = monthName;
	element.style.fontSize = '20px';
	element.style.fontWeight = 'bold';
	element.style.textAlign = 'center';
	element.style.color = '#4a4b4a';
	element.style.margin = '0px 5px';
	element.style.userSelect = 'none';
	element.style.cursor = 'pointer';
	element.style.opacity = '0.2';
	element.setAttribute('quote-calendar-month', month.month);
	element.setAttribute('quote-calendar-year', month.year);
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

const createQuoteCalendarLoading = () => {
	const element = document.createElement('div');
	const datetime = new Date().getTime();
	element.classList.add('quote-calendar-loading-'+datetime);
	
	const node = document.createElement('style');
	node.innerHTML = `
		@-webkit-keyframes quote-calendar-loading-animation-${datetime} {
			0%, 80%, 100% { -webkit-transform: scale(0) }
			40% { -webkit-transform: scale(1.0) }
		}
		@keyframes quote-calendar-loading-animation-${datetime} {
			0%, 80%, 100% { 
				-webkit-transform: scale(0);
				transform: scale(0);
			}
			40% { 
				-webkit-transform: scale(1.0);
				transform: scale(1.0);
			}
		}
	`;
	for (let i = 0; i < 3; i++) {
		const dot = document.createElement('div');
		dot.style.width = '18px';
		dot.style.height = '18px';
		dot.style.background = '#00a857';
		dot.style.borderRadius = '100%';
		dot.style.display = 'inline-block';
		dot.style.animation = `quote-calendar-loading-animation-${datetime} 1.4s infinite ease-in-out both`;
		dot.style.margin = '0px 5px';
		if (i === 0) {
			dot.style.animationDelay = '-0.32s';
		} else if (i === 1) {
			dot.style.animationDelay = '-0.16s';
		}
		element.append(dot);
	}
	element.append(node);
	element.style.display = 'none';
	element.style.alignItems = 'center';
	element.style.justifyContent = 'center';
	// element.style.height = '100%';
	element.style.flexGrow = '1';

	return element;
}

// const node = document.createElement('style');
	// node.innerHTML = `
	// 	.quote-calendar-loading-${datetime} {
	// 		display: flex;
	// 		width: 80%;
	// 		margin: 10px 10%;
	// 		flex-wrap: wrap;
	// 		flex-grow: 1;
	// 	}
	// 	.quote-calendar-loading-day-${datetime} {
	// 		width: calc(100% / 7);
	// 		display: flex;
	// 		padding: 0px 1%;
	// 		box-sizing: border-box;
	// 	}
	// 	.quote-calendar-loading-day-${datetime} div {
	// 		width: 100%;
	// 		height: 60%;
	// 		background: linear-gradient(to right, #868686 20%, #525252 40%, #525252 60%, #868686 80%);
	// 		background-size: 200% auto;
	// 		animation: shine 0.5s linear infinite;
	// 		opacity: 0.4;
	// 	}
	// 	@keyframes shine {
	// 		to {
	// 			background-position: 200% center;
	// 		}
	// 	}
	// `;
	
	// for (let i = 0; i < 7*5; i++) {
	// 	const day = document.createElement('div');
	// 	day.classList.add('quote-calendar-loading-day-'+datetime);
	// 	day.append(document.createElement('div'));
	// 	element.append(day);
	// }