window.addEventListener('DOMContentLoaded', () => {

    const totalCostInput = document.getElementById('total-cost'),
          anInitialFeeInput = document.getElementById('an-initial-fee'),
          creditTermInput = document.getElementById('credit-term');

    const totalCostRange = document.getElementById('total-cost-range'),
          anInitialFeeRange = document.getElementById('an-initial-fee-range'),
          creditTermRange = document.getElementById('credit-term-range');

    const inputs = document.querySelectorAll('input[type="number"]'),
          ranges = document.querySelectorAll('.input-range');

    const totalAmountOfCredit = document.getElementById('amount-of-credit'),
          totalMonthlyPayment = document.getElementById('monthly-payment'),
          totalRecommendedIncome = document.getElementById('recommended-income');

    const bankBtns = document.querySelectorAll('.bank');

    assignValue(totalCostInput, anInitialFeeInput, creditTermInput, totalCostRange, anInitialFeeRange, creditTermRange);
    assignValue(totalCostRange, anInitialFeeRange, creditTermRange, totalCostInput, anInitialFeeInput, creditTermInput);

    const banks = [
        {
            name: 'alfa',
            percents: 8.7
        },
        {
            name: 'sberbank',
            percents: 8.4
        },
        {
            name: 'pochta',
            percents: 7.9
        },
        {
            name: 'tinkoff',
            percents: 9.2
        }
    ];

    let currentPercent = banks[0].percents;

    for(let bank of bankBtns) {
        bank.addEventListener('click', () => {
            for(let bank of bankBtns) {
                bank.classList.remove('active');
            }
            bank.classList.add('active');
            setCurrentPercent(bank);
            calc(totalCostInput.value, anInitialFeeInput.value, creditTermInput.value);
        });
    }

    for(let range of ranges) {
        range.addEventListener('input', () => {
            assignValue(totalCostInput, anInitialFeeInput, creditTermInput, totalCostRange, anInitialFeeRange, creditTermRange);
            calc(totalCostInput.value, anInitialFeeInput.value, creditTermInput.value);
        });
    }

    for(let input of inputs) {
        input.addEventListener('input', () => {
            if(input.value) {
                assignValue(totalCostRange, anInitialFeeRange, creditTermRange, totalCostInput, anInitialFeeInput, creditTermInput);
                calc(totalCostRange.value, anInitialFeeRange.value, creditTermRange.value);
            }
        });

        input.addEventListener('blur', () => {
            checkMinValue(totalCostInput, totalCostRange);
            checkMinValue(anInitialFeeInput, anInitialFeeRange);
            checkMinValue(creditTermInput, creditTermRange);

            calc(totalCostRange.value, anInitialFeeRange.value, creditTermRange.value);
        });
    }

    function checkMinValue(input, range) {
        const minValue = range.getAttribute('min');
    
        if(input.value) {
            if(input.value < minValue) {
                input.value = minValue;
                range.value = minValue;
            }
        } else {
            input.value = minValue;
            range.value = minValue;
        }
    }

    function assignValue(childInput1, childInput2, childInput3, parentInput1, parentInput2, parentInput3) {
        childInput1.value = parentInput1.value;
        childInput2.value = parentInput2.value;
        childInput3.value = parentInput3.value;
    }

    function setCurrentPercent(activeBank) {
        const dataAttrValue = activeBank.dataset.name,
              activeBankObj = banks.find(bank => bank.name === dataAttrValue);

        currentPercent = activeBankObj.percents;
    }

    function calc(totalCost = 0, anInitialFee = 100000, creditTerm = 1) {
        let monthlyPayment,
            amountOfCredit = totalCost - anInitialFee,
            interestRate = currentPercent,
            numbersOfYears = creditTerm,
            numbersOfMonth = numbersOfYears * 12;
        
        monthlyPayment = (amountOfCredit + (((amountOfCredit / 100) * interestRate) / 12) * numbersOfMonth) / numbersOfMonth;
        const monthlyPaymentRounded = Math.round(monthlyPayment);

        if(monthlyPaymentRounded < 0) {
            totalAmountOfCredit.innerHTML = `0₽`;
            totalMonthlyPayment.innerHTML = `0₽`;
            totalRecommendedIncome.innerHTML = `0₽`;
        } else {
            totalAmountOfCredit.innerHTML = `${amountOfCredit}₽`;
            totalMonthlyPayment.innerHTML = `${monthlyPaymentRounded}₽`;
            totalRecommendedIncome.innerHTML = `${Math.round(monthlyPaymentRounded + ((monthlyPaymentRounded / 100) * 35))}₽`;
        }
    }

});