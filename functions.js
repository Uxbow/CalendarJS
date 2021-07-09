let monthReference = 0;
let calendar = document.getElementById('CalendarContainer');
let weekdays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi','samedi', 'dimanche'];
let months = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai','Juin',
                'Juillet','Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
let myCalendarBlocks = document.querySelectorAll('.calendarDay');
const calendarLeftArrow = document.getElementById('CalendarLeftArrow');
const calendarRightArrow = document.getElementById('CalendarRightArrow');
const eventDatesList = document.querySelectorAll('.calendarDayContainer svg');
const selectedDaysCircles = document.querySelectorAll('.calendarCircle');
let availableCalendarDatesIndexes = [];
loadCalendar(0);

calendarLeftArrow.addEventListener('click', ()=>{
    if(monthReference>0) {
        monthReference = +monthReference -1;
        for(myCalendarBlock of myCalendarBlocks){
            myCalendarBlock.parentElement.classList.remove('selectedDate');
            myCalendarBlock.classList.remove('available');
        }
        for(eventDate of eventDatesList){
            eventDate.classList.remove('booked');
        }
        loadCalendar(monthReference);
    }
});
calendarRightArrow.addEventListener('click', ()=>{
    monthReference = +monthReference +1;
    for(myCalendarBlock of myCalendarBlocks){
        myCalendarBlock.parentElement.classList.remove('selectedDate');
        myCalendarBlock.classList.remove('available');
    }
    for(eventDate of eventDatesList){
        eventDate.classList.remove('booked');
    }
    loadCalendar(monthReference);
});

function updateAvailableDate(dates){
    for (block of myCalendarBlocks){
        block.removeEventListener('click',toggleSelection);
    }
    for (date of dates){
        myCalendarBlocks[date].addEventListener('click',toggleSelection);
    }
}



function toggleSelection(){
    if(this.parentElement.classList.contains('selectedDate')){
        this.parentElement.classList.remove('selectedDate');
    }
    else{
        for(circle of selectedDaysCircles){
            circle.classList.remove('selectedDate');
        }
        this.parentElement.classList.add('selectedDate');
    }
    //availableCalendarDates = document.querySelectorAll('.available');
}

function loadCalendar(monthOffset){
    const dateObj = new Date();
    // console.log(`This month : ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`);
    
    if(monthOffset>0){
        dateObj.setMonth(new Date().getMonth() + monthOffset);
        calendarLeftArrow.style.cursor = 'pointer';
        calendarLeftArrow.style.opacity = 1;
        console.log('Loading New Calendar');
    }
    else{
        calendarLeftArrow.style.cursor = 'auto';
        calendarLeftArrow.style.opacity = 0.3;
        console.log('Loading Calendar');
    }
    // console.log(`New calculated month : ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`);

    const today = dateObj.getDate();
    const thisMonth = dateObj.getMonth();
    const thisYear = dateObj.getFullYear();



    //CALENDAR BOUNDARIES
    // Get day string to adjust calendar days' indexes with corresponding date values 
    const numberOfDaysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
    const firstDayOfTheMonthFull = new Date(thisYear, thisMonth, 1).toLocaleDateString('fr-FR',{
        weekday:'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    
    const todayNameStringFull = new Date(thisYear, thisMonth, today ).toLocaleDateString('fr-FR',{
        weekday:'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const firstDayOfTheMonth = firstDayOfTheMonthFull.split(' ')[0];
    const todayNameString = todayNameStringFull.split(' ')[0];
    // console.log('----- TODAY ----');
    // console.log(`Today is ${todayNameString}`);
    // console.log(`Full date is ${todayNameStringFull}`);
    const referenceIndex = weekdays.indexOf(todayNameString);
    //console.log(`referenceIndex for iteration: ${referenceIndex}`);

    
    //Getting last month's details
    const numberOfDaysOfLastMonth = new Date(thisYear, thisMonth, 0).getDate();
    const firstDayLastMonthFull = new Date(thisYear, thisMonth-1, 1).toLocaleDateString('fr-FR',{
        weekday:'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const firstDayLastMonth = firstDayLastMonthFull.split(' ')[0];


    //Getting next month's details
    const numberOfDaysOfNextMonth = new Date(thisYear, thisMonth + 2, 0).getDate();
    const firstDayNextMonthFull = new Date(thisYear, thisMonth+1, 1).toLocaleDateString('fr-FR',{
        weekday:'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const firstDayNextMonth = firstDayNextMonthFull.split(' ')[0];

    
    
    // console.log('---- THIS MONTH -----');
    // console.log(`First Day of the month is ${firstDayOfTheMonth}`);
    // console.log(`Number of Days of this month is : ${numberOfDaysInMonth}`);

    // console.log('---- LAST MONTH-----');
    // console.log(`Number of Days of last month is : ${numberOfDaysOfLastMonth}`);
    // console.log(`First Day of the month is ${firstDayLastMonth}`);

    // console.log('---- NEXT MONTH-----');
    // console.log(`Number of Days of next month is : ${numberOfDaysOfNextMonth}`);
    // console.log(`First Day of the month is ${firstDayNextMonth}`);


    //Last month if overlapping
    for (i = 0; i < referenceIndex ; i++){
            myCalendarBlocks[i].innerText = numberOfDaysOfLastMonth-(referenceIndex-1)+i;
    }
    //this month

    let j = 0;
    for (let i= referenceIndex; i <numberOfDaysInMonth+referenceIndex ; i++){
            myCalendarBlocks[i].innerText = 1 + j;
            myCalendarBlocks[i].classList.add('available');
            availableCalendarDatesIndexes[j]=i;
            j++;
    }

    //nextMonth
    let k = 1;
    for (let i = numberOfDaysInMonth+referenceIndex ; i < myCalendarBlocks.length; i++){
        myCalendarBlocks[i].innerText = k;
        k++;
    }
    document.querySelector('.month').innerText = `${months[thisMonth]} ${thisYear}`;
    updateAvailableDate(availableCalendarDatesIndexes);
}


