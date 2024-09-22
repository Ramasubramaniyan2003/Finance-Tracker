class Dashboard{
    
    constructor() {
        this.loadCardData();
        console.log('called');
    }

    async loadCardData() {
        const todayExp = document.querySelector('#todayExp');
        const todayInc = document.querySelector('#todayInc');
        const lastMonExp = document.querySelector('#lastMonExp');
        const lastMonInc = document.querySelector('#lastMonInc');
        const totalInc = document.querySelector('#totalInc');
        const totalExp = document.querySelector('#totalExp');
        
        $.ajax({
            type: 'GET',
            url: '/dashboard/dashboard',
            headers: { 'X-AT-SessionToken': localStorage.sessionToken }
        }).done(function (response) {
            console.log(response.data);
            if (response.success === true) {
                todayExp.innerHTML = response.data.todayExpense;
                todayInc.innerHTML = response.data.todayIncome;
                lastMonExp.innerHTML = response.data.lastMonthExpense;
                lastMonInc.innerHTML = response.data.lastMonthIncome;
                totalInc.innerHTML = response.data.todayIncome;
                totalExp.innerHTML = response.data.totalExpense;

            } else {
                alert(response.error || 'Error saving data');
            };
        });
    }
}

Dashboard = new Dashboard()