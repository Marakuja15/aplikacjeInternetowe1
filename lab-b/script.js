class Todo {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
        this.listElement = document.getElementById('itemList');
        this.addButton = document.getElementById('addBtn');
        this.addInput = document.getElementById('addInput');
        this.dateInput = document.getElementById('dateInput');
        this.searchBox = document.getElementById('searchBox');
        this.editingId = null;
        
        this.loadFromStorage();
        this.init();
    }
    
    init() {
        this.draw();
        
        this.addButton.addEventListener('click', () => this.addTask());
        this.addInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        this.searchBox.addEventListener('input', () => this.draw());
    }
    
    draw() {
        this.listElement.innerHTML = '';
        
        const searchText = this.searchBox.value.toLowerCase().trim();
        
        let filteredTasks = this.tasks;
        if (searchText.length >= 2) {
            filteredTasks = this.tasks.filter(task => 
                task.text.toLowerCase().includes(searchText)
            );
        }
        
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'item';
            li.dataset.id = task.id;
            
            if (this.editingId === task.id) {
                const textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.className = 'item-edit';
                textInput.value = task.text;
                
                const dateInput = document.createElement('input');
                dateInput.type = 'datetime-local';
                dateInput.className = 'date-edit';
                dateInput.value = task.date || '';
                
                textInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.saveEdit();
                    }
                });
                
                li.appendChild(textInput);
                li.appendChild(dateInput);
                
                setTimeout(() => textInput.focus(), 0);
            } else {
                const contentDiv = document.createElement('div');
                contentDiv.className = 'item-content';
                contentDiv.addEventListener('click', () => this.editTask(task.id));
                
                const textSpan = document.createElement('span');
                textSpan.className = 'item-text';
                
                if (searchText.length >= 2) {
                    const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`(${escapedSearch})`, 'gi');
                    textSpan.innerHTML = task.text.replace(regex, '<mark>$1</mark>');
                } else {
                    textSpan.textContent = task.text;
                }
                
                contentDiv.appendChild(textSpan);
                
                if (task.date) {
                    const dateSpan = document.createElement('span');
                    dateSpan.className = 'item-date';
                    const date = new Date(task.date);
                    dateSpan.textContent = date.toLocaleString('pl-PL');
                    contentDiv.appendChild(dateSpan);
                }
                
                li.appendChild(contentDiv);
            }
            
            const actionBtn = document.createElement('button');
            
            if (this.editingId === task.id) {
                actionBtn.className = 'save-btn';
                actionBtn.textContent = 'Zmień';
                actionBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.saveEdit();
                });
            } else {
                actionBtn.className = 'delete-btn';
                actionBtn.textContent = 'Usuń';
                actionBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteTask(task.id);
                });
            }
            
            li.appendChild(actionBtn);
            this.listElement.appendChild(li);
        });
    }
    
    addTask() {
        const text = this.addInput.value.trim();
        const date = this.dateInput.value;
        
        if (text.length < 3) {
            alert('Zadanie musi mieć minimum 3 znaki!');
            return;
        }
        if (text.length > 255) {
            alert('Zadanie może mieć maksymalnie 255 znaków!');
            return;
        }
        
        if (date) {
            const selectedDate = new Date(date);
            const now = new Date();
            if (selectedDate < now) {
                alert('Data musi być w przyszłości!');
                return;
            }
        }
        
        this.tasks.push({
            id: this.nextId++,
            text: text,
            date: date || null
        });
        
        this.addInput.value = '';
        this.dateInput.value = '';
        this.addInput.focus();
        
        this.saveToStorage();
        this.draw();
    }
    
    deleteTask(id) {
        if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveToStorage();
            this.draw();
        }
    }
    
    editTask(id) {
        this.editingId = id;
        this.draw();
    }
    
    saveEdit() {
        if (this.editingId === null) return;
        
        const textInput = document.querySelector('.item-edit');
        const dateInput = document.querySelector('.date-edit');
        
        if (textInput) {
            const newText = textInput.value.trim();
            const newDate = dateInput ? dateInput.value : null;
            
            if (newText.length < 3) {
                alert('Zadanie musi mieć minimum 3 znaki!');
                this.editingId = null;
                this.draw();
                return;
            }
            if (newText.length > 255) {
                alert('Zadanie może mieć maksymalnie 255 znaków!');
                this.editingId = null;
                this.draw();
                return;
            }
            
            if (newDate) {
                const selectedDate = new Date(newDate);
                const now = new Date();
                if (selectedDate < now) {
                    alert('Data musi być w przyszłości!');
                    this.editingId = null;
                    this.draw();
                    return;
                }
            }
            
            const task = this.tasks.find(t => t.id === this.editingId);
            if (task) {
                task.text = newText;
                task.date = newDate || null;
                this.saveToStorage();
            }
        }
        
        this.editingId = null;
        this.draw();
    }
    
    saveToStorage() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        localStorage.setItem('todoNextId', this.nextId.toString());
    }
    
    loadFromStorage() {
        const stored = localStorage.getItem('todoTasks');
        const storedNextId = localStorage.getItem('todoNextId');
        
        if (stored) {
            this.tasks = JSON.parse(stored);
        }
        
        if (storedNextId) {
            this.nextId = parseInt(storedNextId);
        } else if (this.tasks.length > 0) {
            this.nextId = Math.max(...this.tasks.map(t => t.id)) + 1;
        }
    }
}

const todo = new Todo();
window.todo = todo;