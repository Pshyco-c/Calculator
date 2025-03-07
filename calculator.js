class Calculator {
    constructor() {
        this.input = document.getElementById("input");
        this.buttons = document.querySelectorAll("button");
        this.currentValue = "";
        this.lastResult = "";
        this.isNewCalculation = true;
        
        // Set initial display value
        this.updateDisplay();
        
        this.setupEventListeners();
        this.setupKeyboardSupport();
        this.setupThemeToggle();
    }

    setupEventListeners() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const value = e.target.innerHTML;
                this.handleInput(value);
                
                // Add animation effect
                button.classList.add('clicked');
                setTimeout(() => {
                    button.classList.remove('clicked');
                }, 100);
            });
        });
    }

    setupKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.handleInput(e.key);
            } else if (e.key === '+') {
                this.handleInput('+');
            } else if (e.key === '-') {
                this.handleInput('−');
            } else if (e.key === '*') {
                this.handleInput('×');
            } else if (e.key === '/') {
                this.handleInput('/');
            } else if (e.key === '%') {
                this.handleInput('%');
            } else if (e.key === 'Enter') {
                this.handleInput('=');
            } else if (e.key === 'Backspace') {
                this.handleInput('DEL');
            } else if (e.key === 'Escape') {
                this.handleInput('AC');
            }
        });
    }

    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
        });
    }

    handleInput(value) {
        try {
            switch(value) {
                case '=':
                    this.calculate();
                    break;
                case 'AC':
                    this.clear();
                    break;
                case 'DEL':
                    this.delete();
                    break;
                default:
                    this.appendValue(value);
            }
        } catch (error) {
            console.error("Error handling input:", error);
            this.showError();
        }
    }

    calculate() {
        try {
            if (!this.currentValue) return;
            
            // Replace display symbols with JavaScript operators
            let expression = this.currentValue
                .replace(/×/g, '*')
                .replace(/−/g, '-');
            
            // Handle percentage calculations
            if (expression.includes('%')) {
                expression = expression.replace(/(\d+(?:\.\d+)?)%/g, function(match, number) {
                    return `(${number}/100)`;
                });
            }

            // Evaluate the expression
            // Using Function instead of eval for slightly better security
            const result = new Function('return ' + expression)();
            
            if (!isFinite(result) || isNaN(result)) {
                throw new Error('Invalid calculation');
            }

            // Format the result (limit decimal places if needed)
            const formattedResult = this.formatResult(result);
            
            this.currentValue = formattedResult;
            this.lastResult = formattedResult;
            this.isNewCalculation = true;
            this.updateDisplay();
        } catch (error) {
            console.error("Calculation error:", error);
            this.showError();
        }
    }

    formatResult(result) {
        // Convert to number and back to string to remove trailing zeros
        if (Number.isInteger(result)) {
            return result.toString();
        } else {
            // Limit to 8 decimal places maximum
            return parseFloat(result.toFixed(8)).toString();
        }
    }

    clear() {
        this.currentValue = "";
        this.updateDisplay();
    }

    delete() {
        if (this.isNewCalculation) {
            this.currentValue = "";
            this.isNewCalculation = false;
        } else {
            this.currentValue = this.currentValue.slice(0, -1);
        }
        this.updateDisplay();
    }

    appendValue(value) {
        // If starting a new calculation or display shows initial "0", clear the display first
        if (this.isNewCalculation || this.input.value === "0") {
            this.currentValue = "";
            this.isNewCalculation = false;
        }
        
        // Prevent multiple decimal points in a number
        if (value === '.' && this.currentValue.includes('.')) {
            const lastOperatorIndex = Math.max(
                this.currentValue.lastIndexOf('+'),
                this.currentValue.lastIndexOf('−'),
                this.currentValue.lastIndexOf('×'),
                this.currentValue.lastIndexOf('/')
            );
            
            if (this.currentValue.substring(lastOperatorIndex).includes('.')) {
                return;
            }
        }
        
        // Prevent multiple operators in sequence
        const operators = ['+', '−', '×', '/', '%'];
        const lastChar = this.currentValue.slice(-1);
        
        if (operators.includes(value) && operators.includes(lastChar)) {
            this.currentValue = this.currentValue.slice(0, -1) + value;
        } else {
            this.currentValue += value;
        }
        
        this.updateDisplay();
    }

    updateDisplay() {
        // Always show "0" when the display is empty
        this.input.value = this.currentValue || "0";
    }

    showError() {
        this.input.value = "Error";
        this.isNewCalculation = true;
        
        setTimeout(() => {
            this.clear();
        }, 1500);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

    
    
    