const msg: string = "Hello!";

alert(msg);
interface AppState {
  currentStyleName: string;
  currentStyleFile: string;
}

const availableStyles: Record<string, string> = {
  'Style-1': '/styles/theme-light.css',
  'Style-2': '/styles/theme-dark.css',
  'Niebieski': '/styles/theme-blue.css',
};

let appState: AppState = {
  currentStyleName: 'Jasny',
  currentStyleFile: availableStyles['Jasny']
};

function changeStyle(styleName: string, styleFile: string): void {
  const oldLink = document.getElementById('dynamic-style');

  const newLink = document.createElement('link');
  newLink.id = 'dynamic-style';
  newLink.rel = 'stylesheet';
  newLink.href = styleFile;

  if (oldLink && oldLink.parentNode) {
      oldLink.parentNode.removeChild(oldLink);
  }
  document.head.appendChild(newLink);

  appState.currentStyleName = styleName;
  appState.currentStyleFile = styleFile;
}

function renderStyleSwitcher(): void {
  const container = document.getElementById('style-switcher-container');
  
  if (!container) return;

  const list = document.createElement('ul');
  list.style.listStyle = 'none';
  list.style.padding = '0';

  for (const [name, file] of Object.entries(availableStyles)) {
    const listItem = document.createElement('li');
    listItem.style.marginBottom = '10px';

    const anchor = document.createElement('a');
    anchor.href = '#'; 
    anchor.textContent = `Zmień na styl: ${name}`;
    anchor.style.cursor = 'pointer';
    anchor.style.textDecoration = 'underline';

    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      if (appState.currentStyleName !== name) {
        changeStyle(name, file);
      }
    });

    listItem.appendChild(anchor);
    list.appendChild(listItem);
  }

  container.appendChild(list);
}

document.addEventListener('DOMContentLoaded', () => {
  renderStyleSwitcher();
});