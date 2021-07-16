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
//   1. LoadCalendar creates day blocks dynamically, with a reference (0 for the current month)
//      ==> setCalendarDayList injects correct days in calendar
//      ==> addBookedDays adds dots for event days (comparison to the bookedDaysList)
//      ==> updateAvailableDate sets clickable days
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
let months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai','Juin',
                'Juillet','Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
let calendarDayValue, selectedDaysCircles;


class BookedDay{
    constructor(eventYear, eventMonth, eventDay){
        this.year = eventYear;
        this.month = eventMonth;
        this.day = eventDay;
    }
}


let bookedDaysList = [];
// speaks for itself
// Set of dates showing events
// let bookedDaysList = [new BookedDay(2021, 'Juillet', 10),
//                         new BookedDay(2021, 'Juillet', 17),
//                         new BookedDay(2021, 'Juillet', 23),
//                         new BookedDay(2021, 'Juillet', 31),
//                         new BookedDay(2021, 'Août', 7),
//                         new BookedDay(2021, 'Août', 15),
//                         new BookedDay(2021, 'Octobre', 11),
//                         new BookedDay(2021, 'Novembre', 10),
//                         new BookedDay(2021, 'Décembre', 3),
//                         new BookedDay(2021, 'Décembre', 4),
//                         new BookedDay(2021, 'Décembre', 31),
//                         new BookedDay(2022, 'Janvier', 1),
//                         new BookedDay(2022, 'Janvier', 7),
//                         new BookedDay(2022, 'Janvier', 15),
//                         new BookedDay(2022, 'Janvier', 31),
//                         new BookedDay(2022, 'Février', 13),
//                          new BookedDay(2022, 'Décembre', 29),
//                          new BookedDay(2023, 'Janvier', 1),
//                          new BookedDay(2023, 'Janvier', 6),
//                          new BookedDay(2023, 'Décembre', 31),
//                          new BookedDay(2024, 'Janvier', 1),
//                          new BookedDay(2024, 'Janvier', 6)];


//addBookedDays(2021, 'Décembre', 31);

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
        monthReference = monthReference -1;
        calendarBody.innerHTML='';
        loadCalendar(monthReference);
    }
});
calendarRightArrow.addEventListener('click', ()=>{
    monthReference = monthReference +1;
    calendarBody.innerHTML='';
    loadCalendar(monthReference);
});






function loadCalendar(monthOffset){
    //*********** STARTING DATE ***************
    const dateObj = new Date();
    //const dateObj = new Date(2021, 11,21);   FOR TEST
    
    
    if(monthOffset>0){  
        dateObj.setMonth(dateObj.getMonth() + monthOffset);
        calendarLeftArrow.style.cursor = 'pointer';
        calendarLeftArrow.style.opacity = 1;
    }
    else{    //BACK BUTTON NOT AVAILABLE FOR CURRENT MONTH 
        calendarLeftArrow.style.cursor = 'auto';
        calendarLeftArrow.style.opacity = 0.3;
    }

    const today = dateObj.getDate();
    const thisMonth = dateObj.getMonth();
    const thisYear = dateObj.getFullYear();


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
    let todayDateIndex  = +todayNameStringFull.split(' ')[1] - 1;;
    calendarDayValue = document.querySelectorAll('.calendarDay');
    setCalendarDayList(numberOfDaysOfLastMonth,todayDateIndex, monthStartingDayIndex, numberOfDaysInMonth);

    // UPDATING MONTH AND YEAR ON CALENDAR HEADER
    document.querySelector('.month').innerText = `${months[thisMonth]} ${thisYear}`;

    //ADDING BOOKED DAYS
    let calendarDayBookedItems = [];
    addBookedDays(monthReference, todayDateIndex, monthStartingDayIndex, numberOfDaysInMonth,calendarDayBookedItems, bookedDaysList,thisYear, thisMonth, months);
    
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
        getSelectedDate(this.innerText);
    }
}


function setCalendarDayList(lastMonthDayCount, todayIndex, startIndex,daysCount){
    //LAST MONTH
    for (i = 0; i < startIndex ; i++){
            calendarDayValue[i].innerText = lastMonthDayCount-(startIndex-1)+i;
    }

    //THIS MONTH
    if(monthReference == 0){ //if current month
        let j = y = 0;
        //before Today on current Month
        for (let i= startIndex; i<todayIndex  + startIndex; i++){
            calendarDayValue[i].innerText = 1 + j;
            j++;
        }
        //starting Today on current Month
        for (let i= todayIndex + startIndex; i <daysCount+startIndex ; i++){
            calendarDayValue[i].innerText = todayIndex + 1 + y;
            calendarDayValue[i].classList.add('available');
            y++;
        }

    }
    else{//Full month available
        let j= 0;
        for (let i= startIndex; i <daysCount+startIndex ; i++){
                calendarDayValue[i].innerText = 1 + j;
                calendarDayValue[i].classList.add('available');
                j++;
        }
    }

    // NEXT MONTH
    let k = 0;
    for (let i = daysCount+startIndex ; i < calendarDayValue.length; i++){
        calendarDayValue[i].innerText = 1 + k;
        k++;
    }
}


function addBookedDays(ref, todayIndex, startIndex, daysCount, bookedDays, list, year, month, monthArray){
    let w = 0;
    
    //if current Month, available days iteration starting from today
    if(ref!=0){
        monthTemp = month - 1;
        let yearTemp;
        if (monthTemp == -1){
            yearTemp = year - 1;
            monthTemp = 11;
        }
        else{
            yearTemp = year;
        }
        for(let i= 0; i <startIndex ; i++){
            //setting days array for comparison to BookedDaysList, here for past months
            bookedDays[w] = new BookedDay(yearTemp,
                                            monthArray[monthTemp],
                                            +calendarDayValue[i].innerText); 
            for (j=0; j< list.length; j++){
                if(bookedDays[w].year ===  list[j].year){
                    if(bookedDays[w].month ===  list[j].month){
                        if(bookedDays[w].day ===  list[j].day){
                            calendarDayValue[i].parentElement.querySelector('svg').classList.add('booked');
                            calendarDayValue[i].parentElement.querySelector('svg').style.opacity = "0.3";
                        }
                    }
                }
            }
            w++;
    
        }
        todayIndex = 0;
    }
    for(let i= todayIndex+startIndex; i <daysCount+startIndex ; i++){
        //setting days array for comparison to BookedDaysList
        bookedDays[w] = new BookedDay(year,
                                        monthArray[month],
                                        +calendarDayValue[i].innerText); 
        for (j=0; j< list.length; j++){
            if(bookedDays[w].year ===  list[j].year){
                if(bookedDays[w].month ===  list[j].month){
                    if(bookedDays[w].day ===  list[j].day){
                        calendarDayValue[i].parentElement.querySelector('svg').classList.add('booked');
                    }
                }
            }
        }
        w++;

    }
    month = month + 1;
    for(let i= daysCount+startIndex; i <42 ; i++){
        if (month == 12){
            year = year + 1;
            month = 0;
        }
        bookedDays[w] = new BookedDay(year,
                                        monthArray[month],
                                        +calendarDayValue[i].innerText);
        for (j=0; j< list.length; j++){
            //setting days array for comparison to BookedDaysList, for coming months
            if(bookedDays[w].year ===  list[j].year){
                if(bookedDays[w].month ===  list[j].month){
                    if(bookedDays[w].day ===  list[j].day){
                        calendarDayValue[i].parentElement.querySelector('svg').classList.add('booked');
                        calendarDayValue[i].parentElement.querySelector('svg').style.opacity = '0.3';
                    }
                }
            }
        }
        w++;
    }
}

function getSelectedDate(day){
    selectedDay = +day;
    monthAndYear = document.querySelector('.month').innerText;
    relatedMonth = months.indexOf(monthAndYear.split(" ")[0]);
    relatedYear = +monthAndYear.split(" ")[1];
    selectedDate = new Date(relatedYear,relatedMonth,selectedDay).toLocaleDateString('fr-FR',{
        weekday:'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    //return selectedDate;
    console.log(`New selected date :
    ${selectedDate}`);
}


function pushBookedDay(eventYear, eventMonthString, eventDate){
    bookedDaysList.push(new BookedDay(eventYear, eventMonthString, eventDate));
    calendarBody.innerHTML="";
    loadCalendar(monthReference);
}