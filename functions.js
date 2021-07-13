///////////////////////////////////////////////////////////////////////////////
//
//                                       CALENDAR JS
//
//
//
//   monthReference : Current month reference offset for last month and next month 
//                    calculations
//   weekdays : Array to match with calendar display from Monday to Sunday instead
//              of using date API values from 0 to 6 (avoid '0' value index error)
//   months :  used for month update on when changing month
//
//   calendarDayValue : calendar body target to set day value
//   selectedDaysCircles : Shows up when date is selected
//
//   bookedDay: class for booked event dates
//
//
//   1. loadCalendar first with reference 0, the current month
//   2. Click event on "available dates" for reservation with toggleSelection()
//   3. Click event on Left and Right arrows to update calendar with updateAvailableDate() and
//      incremented or decremented month reference value 
//      and then allow selection on dates with toggleSelection()
//      
//
//
//////////////////////////////////////////////////////////////////////////////


let monthReference = 0;
let weekdays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi','samedi', 'dimanche'];
let months = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai','Juin',
                'Juillet','Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
let calendarDayValue, selectedDaysCircles;


class bookedDay{
    constructor(eventYear, eventMonth, eventDay){
        this.year = eventYear;
        this.month = eventMonth;
        this.day = eventDay;
    }
}

// speaks for itself
let bookedDaysList = [new bookedDay(2021, 'Juillet', 13),
                       new bookedDay(2021, 'Juillet', 17),
                        new bookedDay(2021, 'Juillet', 23),
                        new bookedDay(2021, 'Août', 7)];


// To fire click events, month change and calendar upadate
const calendarLeftArrow = document.getElementById('CalendarLeftArrow');
const calendarRightArrow = document.getElementById('CalendarRightArrow');

// Where we'll add the days dynamically
const calendarBody = document.getElementById('CalendarBody');


// 1.
loadCalendar(monthReference);


// 3.
calendarLeftArrow.addEventListener('click', ()=>{
    if(monthReference>0) {
        monthReference = +monthReference -1;
        calendarBody.innerHTML='';
        loadCalendar(monthReference);
    }
});
calendarRightArrow.addEventListener('click', ()=>{
    monthReference = +monthReference +1;
    calendarBody.innerHTML='';
    loadCalendar(monthReference);
});






function loadCalendar(monthOffset){
    //*********** STARTING DATE ***************
    const dateObj = new Date();
    //const dateObj = new Date(2021, 11,21);   
    
    
    if(monthOffset>0){
        dateObj.setMonth(dateObj.getMonth() + monthOffset);
        calendarLeftArrow.style.cursor = 'pointer';
        calendarLeftArrow.style.opacity = 1;
        console.log('Loading New Calendar');
    }
    else{
        calendarLeftArrow.style.cursor = 'auto';
        calendarLeftArrow.style.opacity = 0.3;
        console.log('Loading Calendar');
    }

    const today = dateObj.getDate();
    const thisMonth = dateObj.getMonth();
    const thisYear = dateObj.getFullYear();



    //CALENDAR BOUNDARIES
    // Get day string to adjust calendar days' indexes with corresponding calendar values 
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
    let monthStartingDayIndex = weekdays.indexOf(firstDayOfTheMonth);

    
    //GETTING LAST MONTH NUMBER OF DAYS
    const numberOfDaysOfLastMonth = new Date(thisYear, thisMonth, 0).getDate();


    //CREATING DATE BLOCKS DYNAMICALLY
    for(i=0 ; i< 42; i++){
        let dateBlock=document.createElement('div');
        dateBlock.style.display = "inline-flex";
       
        dateBlock.innerHTML= `
        <div class="calendarCircle">
        <div class="calendarDay"></div>
        <svg width="5" height="5" viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg">
        <circle cx="2.5" cy="2.5" r="2.5"/>
        </svg>
        </div>
        `;
        dateBlock.classList.add('calendarDayContainer');
        calendarBody.appendChild(dateBlock); 
    }
    selectedDaysCircles = document.querySelectorAll('.calendarCircle');

    //ADDING DATE BLOCKS VALUES

    //LAST MONTH
    calendarDayValue = document.querySelectorAll('.calendarDay');
    for (i = 0; i < monthStartingDayIndex ; i++){
            calendarDayValue[i].innerText = numberOfDaysOfLastMonth-(monthStartingDayIndex-1)+i;
    }


    //THIS MONTH
    // let j = 0;
    // for (let i= monthStartingDayIndex; i <numberOfDaysInMonth+monthStartingDayIndex ; i++){
    //         calendarDayValue[i].innerText = 1 + j;
    //         calendarDayValue[i].classList.add('available');
    //         j++;
    // }
    let j = y = 0;
    let todayDateIndex;
    //PAST DAYS THIS MONTH SET TO UNAVAILABLE
    if(monthReference == 0){
        todayDateIndex = +todayNameStringFull.split(' ')[1] - 1;
        console.log(todayDateIndex);
        //before Today on current Month
        for (let i= monthStartingDayIndex; i<todayDateIndex  + monthStartingDayIndex; i++){
            calendarDayValue[i].innerText = 1 + j;
            j++;
        }
        //starting Today on current Month
        for (let i= todayDateIndex + monthStartingDayIndex; i <numberOfDaysInMonth+monthStartingDayIndex ; i++){
            calendarDayValue[i].innerText = todayDateIndex + 1 + y;
            calendarDayValue[i].classList.add('available');
            y++;
        }

    }
    else{
        for (let i= monthStartingDayIndex; i <numberOfDaysInMonth+monthStartingDayIndex ; i++){
                calendarDayValue[i].innerText = 1 + j;
                calendarDayValue[i].classList.add('available');
                j++;
        }
    }


    // NEXT MONTH
    let k = 0;
    for (let i = numberOfDaysInMonth+monthStartingDayIndex ; i < calendarDayValue.length; i++){
        calendarDayValue[i].innerText = 1 + k;
        k++;
    }

    // UPDATING MONTH AND YEAR ON CALENDAR HEADER
    document.querySelector('.month').innerText = `${months[thisMonth]} ${thisYear}`;


    //ADDING BOOKED DAYS
    let calendarDayBookedItems = [];
    if(monthReference==0){
        for (let i= todayDateIndex; i <numberOfDaysInMonth+monthStartingDayIndex ; i++){
            calendarDayBookedItems[i-monthStartingDayIndex] = new bookedDay(thisYear,
                                                       months[thisMonth],
                                                    +calendarDayValue[i-monthStartingDayIndex].innerText); 
            for (j=0; j< bookedDaysList.length; j++){
                if(calendarDayBookedItems[i-monthStartingDayIndex].year ===  bookedDaysList[j].year){
                    if(calendarDayBookedItems[i-monthStartingDayIndex].month ===  bookedDaysList[j].month){
                        if(calendarDayBookedItems[i-monthStartingDayIndex].day ===  bookedDaysList[j].day){
                            calendarDayValue[i-monthStartingDayIndex].parentElement.querySelector('.available ~svg').classList.add('booked');
                        }
                    }
                }
            }
    
        }
    }
    else{
        for (let i= monthStartingDayIndex; i <numberOfDaysInMonth+monthStartingDayIndex ; i++){
            calendarDayBookedItems[i-monthStartingDayIndex] = new bookedDay(thisYear,
                                                       months[thisMonth],
                                                    +calendarDayValue[i-monthStartingDayIndex].innerText); 
            for (j=0; j< bookedDaysList.length; j++){
                if(calendarDayBookedItems[i-monthStartingDayIndex].year ===  bookedDaysList[j].year){
                    if(calendarDayBookedItems[i-monthStartingDayIndex].month ===  bookedDaysList[j].month){
                        if(calendarDayBookedItems[i-monthStartingDayIndex].day ===  bookedDaysList[j].day){
                            calendarDayValue[i-monthStartingDayIndex].parentElement.querySelector('svg').classList.add('booked');
                        }
                    }
                }
            }
    
        }
    }

    //SETTING CLICKABLE DAYS
    updateAvailableDate();
}


function updateAvailableDate(){
    for (i=0 ; i< calendarDayValue.length ; i++){
        calendarDayValue[i].removeEventListener('click',toggleSelection);
    }
    for (i=0 ; i< calendarDayValue.length; i++){
        if(calendarDayValue[i].classList.contains('available')){
            calendarDayValue[i].addEventListener('click',toggleSelection);
        }
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
}