let monthReference = 0;
let calendar = document.getElementById('CalendarContainer');
let weekdays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi','samedi', 'dimanche'];
let months = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai','Juin',
                'Juillet','Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
let calendarDayDigit, selectedDaysCircles;
;
const calendarLeftArrow = document.getElementById('CalendarLeftArrow');
const calendarRightArrow = document.getElementById('CalendarRightArrow');
const eventDatesList = document.querySelectorAll('.calendarDayContainer svg');


const calendarBody = document.getElementById('CalendarBody');



loadCalendar(0);

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
    const referenceIndex = weekdays.indexOf(firstDayOfTheMonth);
    // console.log(`referenceIndex for iteration: ${referenceIndex}`);

    
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
    // console.log(`First Day of the month is ${firstDayNextMonth}`)
    //Last month if overlapping



    //CREATING BLOCKS DYNAMICALLY
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
        calendarBody.style.width = "280px";
    }
    selectedDaysCircles = document.querySelectorAll('.calendarCircle');

    //ADDING BLOCKS DAYS VALUE
    calendarDayDigit = document.querySelectorAll('.calendarDay');
    for (i = 0; i < referenceIndex ; i++){
            calendarDayDigit[i].innerText = numberOfDaysOfLastMonth-(referenceIndex-1)+i;
    }
    //this month

    let j = 0;
    for (let i= referenceIndex; i <numberOfDaysInMonth+referenceIndex ; i++){
            calendarDayDigit[i].innerText = 1 + j;
            calendarDayDigit[i].classList.add('available');
            j++;
    }
    //nextMonth
    let k = 0;
    for (let i = numberOfDaysInMonth+referenceIndex ; i < calendarDayDigit.length; i++){
        calendarDayDigit[i].innerText = 1 + k;
        k++;
    }
    document.querySelector('.month').innerText = `${months[thisMonth]} ${thisYear}`;
    updateAvailableDate();
}


function updateAvailableDate(){

    for (i=0 ; i< calendarDayDigit.length ; i++){
        calendarDayDigit[i].removeEventListener('click',toggleSelection);
    }
    for (i=0 ; i< calendarDayDigit.length; i++){
        if(calendarDayDigit[i].classList.contains('available')){
            calendarDayDigit[i].addEventListener('click',toggleSelection);
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
    console.log(this.parentElement);
    console.log(this);
}